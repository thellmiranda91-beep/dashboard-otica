import { useState, useEffect } from 'react';
import { C, ft, ftD, fm } from '../config/theme.js';
import { Card, Btn, Inp, Stars } from '../components/ui.jsx';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../config/api.js';
import { CROSS_ITEMS } from '../config/data.js';
import { useRef } from 'react';

export function CheckoutPage({ setPage, onComplete }) {
  const cardBrickRef = useRef(null);
  const { 
    items, total, subtotal, activeBumps, activeCross, shippingCost, 
    toggleCross, cross, crossCatalog, calcShipping, shippingLoading,
    shipping, selectedShippingOption, setSelectedShippingOption
  } = useCart();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [form, setForm] = useState({ 
    name:'', cpf:'', email:'', phone:'', 
    cep:'', street:'', number:'', city:'', state:'', 
    payMethod:'pix' 
  });
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  const maskCPF = (v) => v.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').substring(0, 14);
  const maskCEP = (v) => v.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2').substring(0, 9);
  const maskPhone = (v) => v.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').substring(0, 15);

  // Initialize Mercado Pago
  useEffect(() => {
    if (window.MercadoPago && step === 2 && form.payMethod === 'credit_card') {
      const mpKey = import.meta.env.VITE_MP_PUBLIC_KEY || 'APP_USR-1eb4eec6-b6a9-45bb-8b74-f05c8e035d55';
      const mp = new window.MercadoPago(mpKey, { locale: 'pt-BR' });
      const bricksBuilder = mp.bricks();

      const renderCardBrick = async (bricksBuilder) => {
        const settings = {
          initialization: { amount: total },
          callbacks: {
            onSubmit: async (formData) => {
              setLoading(true);
              try {
                const order = await api.createOrder(orderDataBuilder());
                const payment = await api.createPayment({
                  order_id: order.id,
                  payment_method: 'credit_card',
                  amount: total,
                  card_token: formData.token,
                  installments: formData.installments,
                  payer: { name: form.name, email: form.email, cpf: form.cpf }
                });
                onComplete(order.id, total);
              } catch (e) {
                setError(e.error || "Falha no pagamento com cartão.");
              } finally {
                setLoading(false);
              }
            },
            onError: (error) => console.error(error),
          },
        };
        cardBrickRef.current = await bricksBuilder.create('cardPayment', 'cardPaymentBrick_container', settings);
      };
      renderCardBrick(bricksBuilder);
    }
    return () => {
      if (cardBrickRef.current) cardBrickRef.current.unmount();
    };
  }, [step, form.payMethod]);

  const orderDataBuilder = () => ({
    customer: { 
      name: form.name, email: form.email, phone: form.phone, cpf: form.cpf,
      address: { cep: form.cep, street: form.street, number: form.number, city: form.city, state: form.state } 
    },
    items: items.map(i => ({ product_id: i.id, name: i.name, color: i.color, quantity: i.qty, price: i.price, config: i.config })),
    shipping: { service: selectedShippingOption?.service || 'PAC', price: shippingCost },
    total: total,
    method: form.payMethod
  });

  // Responsive Effect
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timer Effect
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const cleanCep = form.cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      calcShipping(cleanCep);
      fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        .then(r => r.json())
        .then(d => {
          if (!d.erro) {
            setForm(p => ({ 
              ...p, 
              street: d.logradouro || p.street, 
              city: d.localidade || p.city, 
              state: d.uf || p.state 
            }));
          }
        })
        .catch(() => {});
    }
  }, [form.cep]);

  const formatTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  const isMobile = width < 900;

  const upd = (k, v) => setForm(p => ({...p, [k]: v}));

  const handleOrder = async () => {
    if (loading) return;
    
    // Validação final de campos
    const required = ['name', 'cpf', 'email', 'phone', 'cep', 'street', 'number', 'city', 'state'];
    const missing = required.filter(f => !form[f]);
    if (missing.length > 0) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (form.cpf.replace(/\D/g,'').length !== 11) {
      setError("CPF inválido. Digite os 11 números.");
      return;
    }

    setLoading(true);
    setError(null);
    
    // Preparar dados do pedido
    const finalAmount = form.payMethod === 'pix' ? total * 0.95 : total;
    const orderData = {
      customer: { 
        name: form.name, 
        email: form.email, 
        phone: form.phone, 
        cpf: form.cpf, 
        address: { 
          cep: form.cep, street: form.street, number: form.number, city: form.city, state: form.state 
        } 
      },
      items: items.map(i => ({ 
        product_id: i.id, 
        name: i.name, 
        color: i.color, 
        quantity: i.qty, 
        price: i.price,
        config: i.config,
        prescription: i.config?.prescriptionFile ? "FILE_ATTACHED" : "LATER/MANUAL"
      })),
      addons: [
        ...activeBumps.map(b => ({ name: b.name, price: b.price, type: 'bump' })),
        ...activeCross.map(c => ({ name: c.name, price: c.price, type: 'cross_sell' }))
      ],
      shipping: { 
        service: selectedShippingOption?.service || 'PAC', 
        price: shippingCost 
      },
      total: finalAmount,
      method: form.payMethod
    };

    console.log("Processando pedido Elior...", orderData);

    try {
      // Tentar salvar via API
      const order = await api.createOrder(orderData);
      const payment = await api.createPayment({
        order_id: order.order_id || order.id || Date.now(),
        payment_method: form.payMethod,
        amount: finalAmount,
        payer: { name: form.name, email: form.email, cpf: form.cpf }
      });

      if (form.payMethod === 'pix' && payment.pix_qr) {
        setPixData(payment.pix_qr);
      } else {
        onComplete(order.order_id || order.id, finalAmount);
      }
    } catch (e) {
      console.error("Erro no Processamento:", e);
      setError(e.error || e.message || "Ocorreu um erro ao processar seu pagamento. Verifique seus dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (pixData) {
    return (
      <div style={{padding:"60px 24px",maxWidth:460,margin:"0 auto",textAlign:"center"}}>
        <h2 style={{fontFamily:ftD,fontSize:28,fontWeight:700,color:C.nv,marginBottom:8}}>Pague com Pix</h2>
        <p style={{fontFamily:ft,fontSize:15,color:C.md,marginBottom:32}}>Aprovação instantânea • Desconto 5% aplicado</p>
        <div style={{background:C.wh,padding:30,borderRadius:24,boxShadow:"0 10px 40px rgba(0,0,0,0.05)",marginBottom:24,border:`1px solid ${C.bd}`}}>
            {pixData.qr_code_base64 && <img src={`data:image/png;base64,${pixData.qr_code_base64}`} alt="QR Pix" style={{width:240,height:240,margin:"0 auto 24px",borderRadius:12}}/>}
            <div style={{fontFamily:ft,fontSize:12,background:C.cr,padding:16,borderRadius:12,wordBreak:"break-all",color:C.tx,textAlign:"left",border:`1px solid ${C.bd}`}}>{pixData.qr_code}</div>
            <Btn outline full style={{marginTop:12, fontSize: 13}} onClick={() => navigator.clipboard?.writeText(pixData.qr_code)}>Copiar código Pix</Btn>
        </div>
        <Btn primary full onClick={() => onComplete(`ORD-${Date.now()}`, total * 0.95)} style={{padding: 18}}>JÁ REALIZEI O PAGAMENTO</Btn>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:"#F9FAFB", paddingBottom: 60}}>
      {/* MINIMAL HEADER */}
      <div style={{background:C.wh,borderBottom:`1px solid ${C.bd}`,padding:"15px 40px",display:"flex",justifyContent:"space-between",alignItems:"center", position:"sticky", top: 0, zIndex: 100}}>
        <div onClick={() => setPage('home')} style={{cursor:"pointer",fontFamily:ftD,fontSize:22,fontWeight:900,color:C.nv}}>ELIOR</div>
        <div style={{display:"flex",alignItems:"center",gap:8,color:C.sg,fontSize:11,fontWeight:700,letterSpacing: 1}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            PAGAMENTO 100% SEGURO
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding: isMobile ? "20px 16px" : "40px 24px",display:"grid",gridTemplateColumns: isMobile ? "1fr" : "1fr 380px",gap: isMobile ? 20 : 40}}>
        
        {/* LEFT COLUMN: FORMS */}
        <div>
          {/* URGENCY BAR */}
          <div style={{background:C.coS,padding:"10px 16px",borderRadius:12,marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"center",border:`1.5px solid ${C.co}`}}>
              <span style={{color:C.co,fontWeight:700,fontSize:12}}>⏰ Seus itens estão reservados! Finalize agora.</span>
              <span style={{fontFamily:ftD,color:C.co,fontWeight:800,fontSize:14}}>{formatTime(timeLeft)}</span>
          </div>

          <Card style={{padding:0,overflow:"hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.03)"}}>
            {/* TABS */}
            <div style={{display:"flex",background:"#F3F4F6",borderBottom:`1px solid ${C.bd}`}}>
                {["Dados","Entrega","Pagamento"].map((s,i) => (
                    <div key={i} style={{flex:1,padding:"15px",textAlign:"center",fontSize:12,fontWeight:700,color:i===step?C.nv:C.lt,borderBottom:i===step?`3px solid ${C.co}`:"none",background:i===step?"#FFF":"transparent", transition: "all 0.3s"}}>
                        {i+1}. {s}
                    </div>
                ))}
            </div>

            <div style={{padding: isMobile ? 20 : 32}}>
                {step === 0 && (
                    <div style={{animation:"fadeIn 0.3s"}}>
                        <h3 style={{fontSize:18,fontWeight:800,marginBottom:20}}>Informações de Contato</h3>
                        <Inp label="Nome Completo" value={form.name} onChange={e => upd('name',e.target.value)} placeholder="Como está no cartão"/>
                        <div style={{display:"grid",gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",gap:16}}>
                            <Inp label="CPF" value={form.cpf} onChange={e => upd('cpf',maskCPF(e.target.value))} placeholder="000.000.000-00"/>
                            <Inp label="WhatsApp" value={form.phone} onChange={e => upd('phone',maskPhone(e.target.value))} placeholder="(11) 99999-0000"/>
                        </div>
                        <Inp label="E-mail" value={form.email} onChange={e => upd('email',e.target.value)} placeholder="seu@email.com" type="email"/>
                        <Btn primary full onClick={() => {
                          if(!form.name || !form.email || !form.cpf || !form.phone) return setError("Preencha todos os dados de contato.");
                          setError(null);
                          setStep(1);
                        }} style={{padding:"18px", fontSize: 16}}>CONTINUAR ❯</Btn>
                    </div>
                )}

                {step === 1 && (
                    <div style={{animation:"fadeIn 0.3s"}}>
                        <h3 style={{fontSize:18,fontWeight:800,marginBottom:20}}>Endereço de Entrega</h3>
                        <div style={{display:"grid",gridTemplateColumns: "1fr 1fr",gap:16}}>
                            <Inp label="CEP" value={form.cep} onChange={e => upd('cep',maskCEP(e.target.value))} placeholder="00000-000"/>
                             <Inp label="Cidade" value={form.city} onChange={e => upd('city',e.target.value)}/>
                        </div>
                        {shippingLoading && <p style={{fontSize:12, color:C.co, fontWeight:700, marginBottom:10}}>🔄 Calculando frete...</p>}
                        {!shippingLoading && shipping?.options && (
                          <div style={{marginBottom: 24}}>
                            <p style={{fontSize:13, fontWeight:700, marginBottom:10, color: C.nv}}>Selecione a forma de entrega:</p>
                            {shipping.options.map((opt, i) => (
                              <div 
                                key={i} 
                                onClick={() => setSelectedShippingOption(opt)}
                                style={{
                                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                  padding: 16, borderRadius: 12, border: `1.5px solid ${selectedShippingOption?.service === opt.service ? C.nv : C.bd}`,
                                  background: selectedShippingOption?.service === opt.service ? `${C.nv}05` : '#FFF',
                                  cursor: 'pointer', marginBottom: 10, transition: "all 0.2s"
                                }}
                              >
                                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                                  <div style={{width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${selectedShippingOption?.service === opt.service ? C.nv : C.lt}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    {selectedShippingOption?.service === opt.service && <div style={{width: 10, height: 10, borderRadius: '50%', background: C.nv}} />}
                                  </div>
                                  <div>
                                    <p style={{fontSize: 14, fontWeight: 700, margin: 0, color: C.tx}}>{opt.service}</p>
                                    <p style={{fontSize: 11, color: C.md, margin: 0}}>{opt.days} dias úteis</p>
                                  </div>
                                </div>
                                <span style={{fontSize: 14, fontWeight: 900, color: (isFreeShipping || opt.price === 0) ? C.sg : C.nv}}>
                                  {(isFreeShipping || opt.price === 0) ? 'GRÁTIS' : fm(opt.price)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        <Inp label="Logradouro" value={form.street} onChange={e => upd('street',e.target.value)}/>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                            <Inp label="Número" value={form.number} onChange={e => upd('number',e.target.value)}/>
                            <Inp label="Estado" value={form.state} onChange={e => upd('state',e.target.value)} placeholder="Ex: SP"/>
                        </div>
                        <div style={{display:"flex",gap:12}}>
                            <Btn outline onClick={() => setStep(0)} style={{flex:1}}>Voltar</Btn>
                            <Btn primary onClick={() => setStep(2)} disabled={!form.cep} style={{flex:2}}>CONTINUAR ❯</Btn>
                        </div>
                    </div>
                )}

                        {step === 2 && (
                    <div style={{animation:"fadeIn 0.3s"}}>
                        {error && (
                          <div style={{background: '#FEE2E2', color: '#B91C1C', padding: 12, borderRadius: 10, marginBottom: 20, fontSize: 13, fontWeight: 600, border: '1px solid #FCA5A5'}}>
                            ⚠️ {error}
                          </div>
                        )}
                        <h3 style={{fontSize:18,fontWeight:800,marginBottom:20}}>Escolha o Pagamento</h3>
                        {[
                            {id:"pix",title:"Pix",desc:"Aprovação imediata + 5% OFF",icon:"🌀",color:C.sg},
                            {id:"credit_card",title:"Cartão de Crédito",desc:"Até 10x sem juros",icon:"💳",color:C.ig},
                            {id:"boleto",title:"Boleto",desc:"Vencimento em 3 dias",icon:"📄",color:C.lt}
                        ].map(m => (
                            <label key={m.id} style={{display:"flex",alignItems:"center",gap:16,padding: isMobile ? "12px" : "18px",border:form.payMethod===m.id?`2px solid ${C.nv}`:`1.5px solid ${C.bd}`,borderRadius:14,cursor:"pointer",marginBottom:10,transition:"all 0.2s",background:form.payMethod===m.id?`${C.nv}05`:"#FFF"}}>
                                <input type="radio" checked={form.payMethod===m.id} onChange={() => upd('payMethod',m.id)} style={{accentColor:C.nv,width:20,height:20}}/>
                                <span style={{fontSize:22}}>{m.icon}</span>
                                <div style={{flex:1}}>
                                    <p style={{fontFamily:ft,fontSize:14,fontWeight:700,margin:0}}>{m.title}</p>
                                    <p style={{fontFamily:ft,fontSize:12,color:m.color,fontWeight:600,margin:"2px 0 0"}}>{m.desc}</p>
                                </div>
                            </label>
                        ))}

                        <div style={{marginTop:32,display:"flex",gap:12}}>
                        {form.payMethod === 'credit_card' ? (
                            <div id="cardPaymentBrick_container" style={{marginTop: 20}}></div>
                        ) : (
                          <Btn primary onClick={handleOrder} disabled={loading} style={{flex: isMobile ? 1 : 2, background:C.sg, padding:"18px",fontSize:16}}>
                              {loading ? "Processando..." : `FINALIZAR — ${fm(form.payMethod==='pix'?total*0.95:total)}`}
                          </Btn>
                        )}
                        </div>
                    </div>
                )}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        <div style={{position: isMobile ? "static" : "sticky", top: 80, alignSelf:"start"}}>
          <Card style={{padding:20,marginBottom:20, boxShadow: "0 4px 20px rgba(0,0,0,0.03)"}}>
            <h3 style={{fontSize:15,fontWeight:800,marginBottom:16,display:"flex",justifyContent:"space-between"}}>
                Resumo
                <span style={{color:C.lt,fontWeight:400,fontSize:12}}>{items.length} itens</span>
            </h3>
            
            <div style={{maxHeight: 250, overflowY:"auto", marginBottom:16, paddingRight:5}}>
                {items.map(i => (
                    <div key={i.uniqueId} style={{display:"flex",gap:10,marginBottom:12}}>
                        <img src={i.images?.[0] || i.img} style={{width:44,height:44,borderRadius:8,objectFit:"cover"}}/>
                        <div style={{flex:1}}>
                            <p style={{fontSize:11,fontWeight:700,margin:0, lineHeight: 1.2}}>{i.name}</p>
                            <p style={{fontSize:10,color:C.lt,margin:0}}>{i.color} x{i.qty}</p>
                        </div>
                        <span style={{fontSize:12,fontWeight:700}}>{fm(i.price*i.qty)}</span>
                    </div>
                ))}
            </div>

            {/* DYNAMIC ORDER BUMPS FROM ADMIN */}
            {crossCatalog.map(item => (
              <div key={item.id} style={{background:C.glS, border:`2px dotted ${C.gl}`, padding:"14px 16px", borderRadius:12, marginBottom:12}}>
                  <div style={{display:"flex", alignItems:"center", gap:12, cursor: "pointer"}} onClick={() => toggleCross(item.id)}>
                      <input type="checkbox" checked={!!cross[item.id]} onChange={() => {}} style={{width:18, height:18, accentColor:C.gl}}/>
                      {item.img && <img src={item.img} style={{width:50, height:50, borderRadius:8, objectFit:"cover"}} />}
                      <div style={{flex:1}}>
                          <p style={{fontSize:13, fontWeight:800, color:C.gl, margin:0}}>{item.name}</p>
                          <p style={{fontSize:11, color:C.md, margin:0}}>{item.price > 0 ? `Por apenas + ${fm(item.price)}` : 'Incluso'}</p>
                          {item.id === 'combo4' && <span style={{fontSize:9, background:C.co, color:"#FFF", padding:"2px 4px", borderRadius:4, fontWeight:700}}>OFERTA ÚNICA</span>}
                      </div>
                  </div>
              </div>
            ))}

            <div style={{borderTop:`1px solid ${C.bd}`,paddingTop:14,display:"flex",flexDirection:"column",gap:6}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:C.md}}>
                    <span>Subtotal</span><span>{fm(subtotal)}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:C.md}}>
                    <span>Frete</span><span style={{color:shippingCost===0?C.sg:C.md, fontWeight: 700}}>{shippingCost===0?"GRÁTIS":fm(shippingCost)}</span>
                </div>
                {form.payMethod === 'pix' && (
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:C.sg,fontWeight:600}}>
                        <span>Desconto Pix</span><span>-{fm(total*0.05)}</span>
                    </div>
                )}
                <div style={{display:"flex",justifyContent:"space-between",fontSize:18,fontWeight:900,marginTop:10,color:C.nv}}>
                    <span>Total</span><span>{fm(form.payMethod==='pix'?total*0.95:total)}</span>
                </div>
            </div>
          </Card>

          {/* SOCIAL PROOF CARD */}
          <div style={{background:C.wh,borderRadius:20,padding:"16px 20px",border:`1px solid ${C.bd}`, boxShadow: "0 4px 15px rgba(0,0,0,0.02)"}}>
             <div style={{display:"flex",gap:8,marginBottom:10}}>
                <Stars r={5} s={10}/>
             </div>
             <p style={{fontSize:12,color:C.md,lineHeight:1.5, margin: 0}}>"Recebi muito rápido! Os óculos são lindos e o atendimento pelo WhatsApp foi 10."</p>
             <p style={{fontSize:11,fontWeight:700,marginTop:8, color: C.nv}}>— Marina S. <span style={{color:C.sg, fontSize: 9}}>✅ Cliente VIP</span></p>
          </div>

          <div style={{marginTop:20,display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",opacity:0.4}}>
             {["Site Seguro","SSL","Antifraude"].map(s => <span key={s} style={{fontSize:9,fontWeight:700,padding:"3px 6px",border:`1px solid ${C.lt}`,borderRadius:4}}>{s}</span>)}
          </div>
        </div>

      </div>
    </div>
  );
}
