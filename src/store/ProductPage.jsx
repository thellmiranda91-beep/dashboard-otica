import { useState, useRef } from 'react';
import { C, ft, ftD, fm } from '../config/theme.js';
import { Stars, Btn, Inp } from '../components/ui.jsx';
import { useMobile } from '../hooks/useMobile.js';
import { useCart } from '../context/CartContext.jsx';
import { ProdCard } from './ProductCard.jsx';
import { BUMPS, CROSS_ITEMS, USAGE_OPTIONS } from '../config/data.js';

/* ─── DATA CONFIG (Style: Zeno) ─── */
const ZENO_STEPS = [
  'Como você vai usar seus óculos?',
  'Qual o tipo de lente?',
  'Quer algum tratamento extra?',
  'Como vai enviar sua receita?'
];

const RX_OPTIONS = [
  { id: 'upload', label: 'Selecionar foto ou PDF da receita', desc: 'Tire uma foto da receita ou envie o arquivo PDF.', icon: '📎' },
  { id: 'whatsapp', label: 'Enviar depois pelo WhatsApp', desc: 'Nossa equipe entra em contato após o pedido. Simples e sem estresse.', icon: '💬' },
  { id: 'manual', label: 'Digitar os dados da receita', desc: 'Preencha os dados do receituário manualmente.', icon: '✍️' }
];

/* ─── UI COMPONENTS ─── */

function InfoBox({ title, desc, icon }) {
  return (
    <div style={{ background: '#F8F9FA', borderRadius: 8, padding: '16px', display: 'flex', gap: 12, flex: 1 }}>
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div>
        <p style={{ fontFamily: ft, fontSize: 13, fontWeight: 700, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</p>
        <p style={{ fontFamily: ft, fontSize: 12, color: C.md, margin: 0, lineHeight: 1.4 }}>{desc}</p>
      </div>
    </div>
  );
}

function ProgressHeader({ step, total }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontFamily: ft, fontSize: 12, color: C.md }}>Etapa {step} de {total}</span>
      </div>
      <div style={{ background: '#E9ECEF', height: 4, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ background: C.nv, height: '100%', width: `${(step / total) * 100}%`, transition: 'width 0.3s ease' }} />
      </div>
    </div>
  );
}

function OptionCard({ item, selected, onSelect, badge, showPrice = true, customContent }) {
  return (
    <div 
      onClick={() => onSelect(item.id)}
      style={{ 
        border: selected ? `2px solid ${C.nv}` : `1px solid #DEE2E6`,
        borderRadius: 12,
        padding: '20px',
        marginBottom: 12,
        cursor: 'pointer',
        position: 'relative',
        background: '#FFF',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {badge && (
        <span style={{ position: 'absolute', top: -10, right: 12, background: C.nv, color: '#FFF', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 20 }}>
          {badge}
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        {item.icon && <span style={{ fontSize: 24 }}>{item.icon}</span>}
        {item.img && <img src={item.img} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} />}
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: ft, fontSize: 15, fontWeight: 700, margin: 0, color: C.nv }}>{item.label}</p>
          <p style={{ fontFamily: ft, fontSize: 13, color: C.md, margin: '4px 0 0', whiteSpace: 'pre-line' }}>{item.desc}</p>
          {customContent}
          {item.specs && (
            <ul style={{ margin: '8px 0 0', paddingLeft: 16, color: C.sg, fontSize: 12 }}>
              {item.specs.map((s, i) => <li key={i} style={{ marginBottom: 2 }}>{s}</li>)}
            </ul>
          )}
          {item.delivery && <p style={{ fontSize: 12, color: C.lt, margin: '8px 0 0' }}>🕒 {item.delivery}</p>}
        </div>
      </div>
      {showPrice && item.price !== undefined && (
        <div style={{ textAlign: 'right', minWidth: 80 }}>
          <span style={{ fontWeight: 700 }}>{item.price > 0 ? `+ ${fm(item.price)}` : 'Incluso'}</span>
        </div>
      )}
    </div>
  );
}

function ManualRXForm({ data, onChange }) {
  const fields = ['sph', 'cyl', 'axis'];
  const labels = { sph: 'Esférico', cyl: 'Cilíndrico', axis: 'Eixo' };
  
  return (
    <div style={{ background: '#F8F9FA', padding: 20, borderRadius: 12, marginTop: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <p style={{ fontWeight: 800, fontSize: 13, color: C.nv, marginBottom: 10 }}>OLHO DIREITO (OD)</p>
          {fields.map(f => (
            <Inp key={f} label={labels[f]} type="text" placeholder="0.00" value={data.od?.[f] || ''} onChange={e => onChange('od', f, e.target.value)} />
          ))}
        </div>
        <div>
          <p style={{ fontWeight: 800, fontSize: 13, color: C.nv, marginBottom: 10 }}>OLHO ESQUERDO (OE)</p>
          {fields.map(f => (
            <Inp key={f} label={labels[f]} type="text" placeholder="0.00" value={data.oe?.[f] || ''} onChange={e => onChange('oe', f, e.target.value)} />
          ))}
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <Inp label="DNP (Distância Nasopupilar)" placeholder="Ex: 32/33" value={data.dnp || ''} onChange={e => onChange('dnp', null, e.target.value)} />
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */

export function ProductPage({ product, recommendations, setPage, openProd, lensOptions = [], treatments = [] }) {
  const isMobile = useMobile();
  const [wizardMode, setWizardMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selColor, setSelColor] = useState(product.colors[0]);
  const [mainImg, setMainImg] = useState(product.images?.[0] || product.img);
  const [rxFile, setRxFile] = useState(null);
  const [rxFileName, setRxFileName] = useState('');
  
  const [order, setOrder] = useState({
    usage: null,
    lens: null,
    treatment: null,
    prescription: null,
    prescriptionFile: null,
    prescriptionManual: { od: {}, oe: {}, dnp: '' }
  });

  const rxInputRef = useRef(null);
  const { addItem } = useCart();
  const p = product;
  const productImages = p.images || [p.img];

  // Pricing
  const lensPrice = order.lens ? (lensOptions.find(l => l.id === order.lens)?.price || 0) : 0;
  const treatPrice = order.treatment ? (treatments.find(t => t.id === order.treatment)?.price || 0) : 0;
  const totalPrice = p.price + lensPrice + treatPrice;

  const handleNext = () => {
    if (currentStep === 1 && order.usage === 'armacao') {
      addItem({ ...p, price: totalPrice }, selColor, { usage: 'armacao' });
      setPage('checkout');
      return;
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    else {
      addItem({ ...p, price: totalPrice }, selColor, { ...order, prescriptionFile: rxFile });
      setPage('checkout');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else setWizardMode(false);
  };

  const select = (field, val) => {
    setOrder(prev => ({ ...prev, [field]: val }));
    if (field === 'prescription' && val === 'upload') {
      rxInputRef.current?.click();
    }
  };

  const updateManualRx = (eye, field, val) => {
    setOrder(prev => {
      const manual = { ...prev.prescriptionManual };
      if (eye === 'dnp') manual.dnp = val;
      else {
        manual[eye] = { ...manual[eye], [field]: val };
      }
      return { ...prev, prescriptionManual: manual };
    });
  };

  const handleRxUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRxFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setRxFile(ev.target.result);
        setOrder(prev => ({ ...prev, prescriptionFile: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (wizardMode) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 550px', minHeight: '100vh', background: '#FFF' }}>
        {/* Left: Sticky Image */}
        <div style={{ background: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: 0, height: '100vh', padding: 40 }}>
          <div style={{ width: '100%', maxWidth: 500 }}>
            <img src={mainImg} style={{ width: '100%', borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }} />
            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 18, fontWeight: 700, fontFamily: ftD }}>{p.name}</p>
          </div>
        </div>

        {/* Right: Wizard Container */}
        <div style={{ padding: '60px 40px', overflowY: 'auto', background: '#FDFDFD' }}>
          <button onClick={handleBack} style={{ border: 'none', background: '#000', color: '#FFF', padding: '8px 16px', borderRadius: 4, cursor: 'pointer', marginBottom: 20, fontSize: 12, fontWeight: 700 }}>‹ Voltar</button>

          <ProgressHeader step={currentStep} total={4} />

          <h2 style={{ fontFamily: ftD, fontSize: 28, fontWeight: 700, marginBottom: 12 }}>{ZENO_STEPS[currentStep - 1]}</h2>
          <p style={{ color: C.md, marginBottom: 32 }}>Escolha uma opção para continuar</p>

          <div style={{ marginBottom: 40 }}>
            <input type="file" ref={rxInputRef} style={{ display: 'none' }} onChange={handleRxUpload} accept="image/*,.pdf" />

            {currentStep === 1 && USAGE_OPTIONS.map(opt => (
              <OptionCard key={opt.id} item={opt} selected={order.usage === opt.id} onSelect={(id) => select('usage', id)} badge={opt.badge} showPrice={false} />
            ))}
            {currentStep === 2 && lensOptions.map(opt => (
              <OptionCard key={opt.id} item={opt} selected={order.lens === opt.id} onSelect={(id) => select('lens', id)} />
            ))}
            {currentStep === 3 && treatments.map(opt => (
              <OptionCard key={opt.id} item={opt} selected={order.treatment === opt.id} onSelect={(id) => select('treatment', id)} badge={opt.status} />
            ))}
            {currentStep === 4 && RX_OPTIONS.map(opt => (
              <OptionCard 
                key={opt.id} 
                item={opt} 
                selected={order.prescription === opt.id} 
                onSelect={(id) => select('prescription', id)} 
                showPrice={false}
                customContent={
                  opt.id === 'upload' && rxFileName ? (
                    <div style={{ marginTop: 8, padding: '8px 12px', background: C.sgS, borderRadius: 8, color: C.sg, fontSize: 11, fontWeight: 700 }}>
                      ✅ Arquivo: {rxFileName}
                    </div>
                  ) : opt.id === 'manual' && order.prescription === 'manual' ? (
                    <ManualRXForm data={order.prescriptionManual} onChange={updateManualRx} />
                  ) : null
                }
              />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #EEE', paddingTop: 24 }}>
            <div>
              <span style={{ display: 'block', fontSize: 13, color: C.md }}>Total acumulado:</span>
              <span style={{ color: C.nv, fontWeight: 900, fontSize: 18 }}>{fm(totalPrice)}</span>
            </div>
            <Btn primary style={{ padding: '16px 40px' }} onClick={handleNext} disabled={
              (currentStep === 1 && !order.usage) ||
              (currentStep === 2 && !order.lens) ||
              (currentStep === 3 && !order.treatment) ||
              (currentStep === 4 && !order.prescription) ||
              (currentStep === 4 && order.prescription === 'upload' && !rxFile)
            }>
              {currentStep === 4 ? 'Confirmar e ver carrinho' : 'Próxima etapa ❯'}
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? '20px 16px' : '28px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <button style={{ fontFamily: ft, background: 'none', border: 'none', color: C.md, cursor: 'pointer', fontSize: 13, marginBottom: 20 }} onClick={() => setPage('catalog')}>&larr; Voltar ao catálogo</button>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(400px, 1fr) 450px', gap: isMobile ? 32 : 60, alignItems: 'start' }}>
        {/* Left: Product Images */}
        <div style={{ position: isMobile ? 'static' : 'sticky', top: 20 }}>
          <div style={{ background: C.wm, borderRadius: 24, overflow: 'hidden', aspectRatio: '1', marginBottom: 20, border: `1px solid ${C.bd}` }}>
            <img src={mainImg} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 10 }}>
             {productImages.map((img, idx) => (
               <div 
                key={idx} 
                onClick={() => setMainImg(img)}
                style={{ 
                  flexShrink: 0, width: 80, height: 80, borderRadius: 12, overflow: 'hidden', 
                  border: mainImg === img ? `2px solid ${C.nv}` : `1px solid ${C.bd}`, 
                  cursor: 'pointer', opacity: mainImg === img ? 1 : 0.6 
                }}
              >
                <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
             ))}
          </div>
        </div>

        {/* Right: Info */}
        <div>
          <span style={{ fontFamily: ft, fontSize: 12, fontWeight: 700, color: C.sg, letterSpacing: 2, textTransform: 'uppercase' }}>{p.cat === 'grau' ? 'Armação de Grau' : 'Óculos de Sol'}</span>
          <h1 style={{ fontFamily: ftD, fontSize: 40, fontWeight: 900, color: C.nv, margin: '8px 0 12px', lineHeight: 1 }}>{p.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Stars r={p.rating || 4.8} s={16} />
            <span style={{ fontFamily: ft, fontSize: 14, color: C.md }}>4.9 (1,247 avaliações reais)</span>
          </div>

          <div style={{ borderBottom: '1px solid #EEE', paddingBottom: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <span style={{ fontSize: 18, color: C.lt, textDecoration: 'line-through' }}>{fm(p.price * 1.35)}</span>
              <span style={{ fontFamily: ftD, fontSize: 36, fontWeight: 800, color: C.nv }}>{fm(p.price)}</span>
              <span style={{ background: C.coS, color: C.co, fontSize: 12, fontWeight: 700, padding: '4px 8px', borderRadius: 4 }}>OFERTA 35% OFF</span>
            </div>
            <p style={{ fontSize: 15, color: C.sg, fontWeight: 600 }}>💳 Ou em 10x de {fm(p.price / 10)} sem juros</p>
          </div>

          <p style={{ fontFamily: ft, fontSize: 15, color: C.md, lineHeight: 1.6, marginBottom: 32 }}>{p.desc}</p>

          <div style={{ marginBottom: 32 }}>
            <p style={{ fontWeight: 800, fontSize: 14, marginBottom: 16 }}>Selecione a cor: <span style={{ fontWeight: 400, color: C.lt, marginLeft: 8 }}>{selColor}</span></p>
            <div style={{ display: 'flex', gap: 16 }}>
              {p.colors.map(c => (
                <div 
                  key={c}
                  onClick={() => setSelColor(c)}
                  title={c}
                  style={{ 
                    width: 36, height: 36, borderRadius: '50%', 
                    background: c === 'Preto' ? '#000' : c === 'Tartaruga' ? 'linear-gradient(45deg, #4b2c20 50%, #8b5a2b 50%)' : c === 'Dourado' ? '#D4AF37' : '#CCC',
                    border: selColor === c ? `2px solid ${C.nv}` : '2px solid #FFF', 
                    boxShadow: selColor === c ? `0 0 0 2px ${C.nv}40` : '0 0 0 1px #EEE',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ background: '#F8F9FA', padding: 20, borderRadius: 16, border: `1px solid ${C.bd}`, marginBottom: 32 }}>
            <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800 }}>Por que escolher Elior?</h4>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: C.md }}>
              <li style={{ marginBottom: 6 }}>Acetato italiano premium feito à mão</li>
              <li style={{ marginBottom: 6 }}>Dobradiças reforçadas de alta durabilidade</li>
              <li>Lentes com proteção UV400 em todos os modelos</li>
            </ul>
          </div>

          <Btn primary full onClick={() => setWizardMode(true)} style={{ padding: '22px', fontSize: 17, fontWeight: 800, letterSpacing: 0.5 }}>CONFIGURAR LENTES E COMPRAR ❯</Btn>

          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <InfoBox icon="📦" title="FRETE EXPRESSO" desc="Enviamos em 24h úteis para todo Brasil." />
            <InfoBox icon="🔒" title="PAGAMENTO SEGURO" desc="Criptografia SSL de ponta a ponta." />
          </div>
        </div>
      </div>

      {/* Social Proof Videos */}
      <div style={{ marginTop: 100 }}>
         <h2 style={{ fontFamily: ftD, fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 40 }}>Veja por que somos favoritos</h2>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
           {[1,2,3,4].map(i => (
             <div key={i} style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '9/16', background: C.wm, position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
               <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                 <source src="https://player.vimeo.com/external/494252666.sd.mp4?s=72fa13e92801236f0b09485bb24e6c9867c29367&profile_id=164" />
               </video>
               <div style={{ position: 'absolute', bottom: 20, left: 20, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <span style={{ color: '#FFF', fontSize: 12 }}>▶</span>
               </div>
             </div>
           ))}
         </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div style={{ marginTop: 100, paddingTop: 60, borderTop: `1px solid ${C.bd}` }}>
          <h3 style={{ fontFamily: ftD, fontSize: 32, fontWeight: 800, color: C.nv, marginBottom: 40, textAlign: 'center' }}>Produtos Relacionados</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            {recommendations.slice(0, 4).map(r => <ProdCard key={r.id} p={r} onClick={() => openProd(r)} />)}
          </div>
        </div>
      )}
    </div>
  );
}
