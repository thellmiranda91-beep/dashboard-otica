import { useState } from 'react';
import { C, ft, ftD, fm } from '../config/theme.js';
import { Btn } from '../components/ui.jsx';
import { useCart } from '../context/CartContext.jsx';
import { CROSS_ITEMS } from '../config/data.js';

export function CartDrawer({ onClose, onCheckout }) {
  const { 
    items, removeItem, updateQty, cross, toggleCross, total, count, 
    remainingForFreeShipping, freeShippingThreshold, isFreeShipping 
  } = useCart();
  
  const progress = Math.min(100, ((freeShippingThreshold - remainingForFreeShipping) / freeShippingThreshold) * 100);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(12,31,46,0.4)", zIndex: 200, backdropFilter: "blur(4px)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.wh, width: "100%", maxWidth: 440, height: "100vh", position: "fixed", right: 0, top: 0, display: "flex", flexDirection: "column" }}>
        
        {/* HEADER */}
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.bd}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: ftD, fontSize: 19, fontWeight: 700, color: C.nv, margin: 0 }}>Meu Carrinho ({count})</h2>
          <button onClick={onClose} style={{ background: C.wm, border: "none", width: 30, height: 30, borderRadius: 8, cursor: "pointer", fontSize: 16, color: C.md, display: "flex", alignItems: "center", justifyContent: "center" }}>&times;</button>
        </div>

        {/* FREE SHIPPING PROGRESS */}
        {items.length > 0 && (
          <div style={{ padding: "16px 22px", background: C.coS }}>
            <p style={{ fontFamily: ft, fontSize: 13, fontWeight: 600, color: C.nv, marginBottom: 8, textAlign: "center" }}>
              {isFreeShipping 
                ? "🎉 Parabéns! Você ganhou FRETE GRÁTIS" 
                : <span>Faltam apenas <span style={{ color: C.co, fontWeight: 800 }}>{fm(remainingForFreeShipping)}</span> para Frete Grátis</span>}
            </p>
            <div style={{ background: "rgba(0,0,0,0.05)", height: 6, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ background: C.co, height: "100%", width: `${progress}%`, transition: "width 0.4s ease" }} />
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", padding: 22 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <p style={{ fontSize: 40, margin: 0 }}>🛒</p>
              <p style={{ fontFamily: ft, color: C.lt, marginTop: 10 }}>Seu carrinho está vazio</p>
              <Btn primary onClick={onClose} style={{ marginTop: 20 }}>Voltar às compras</Btn>
            </div>
          ) : (
            <>
              {/* ITEMS */}
              {items.map(item => (
                <div key={item.uniqueId} style={{ display: "flex", gap: 14, marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${C.bd}` }}>
                  <img src={item.images?.[0] || item.img} alt="" style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 12 }} />
                  <div style={{ flex: 1, fontFamily: ft }}>
                    <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 6px", color: C.nv }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: C.lt, margin: "0 0 10px" }}>Cor: {item.color} {item.config?.prescriptionFile && <span style={{color:C.sg,fontWeight:700,marginLeft:8}}>📄 Receita Anexada</span>}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${C.bd}`, borderRadius: 8, background: C.wh }}>
                        <button onClick={() => updateQty(item.uniqueId, -1)} style={{ background: "none", border: "none", padding: "4px 12px", cursor: "pointer", color: C.md }}>-</button>
                        <span style={{ fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.uniqueId, 1)} style={{ background: "none", border: "none", padding: "4px 12px", cursor: "pointer", color: C.md }}>+</button>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 800, color: C.nv }}>{fm(item.price * item.qty)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.uniqueId)} style={{ background: "none", border: "none", color: C.lt, cursor: "pointer", fontSize: 18, alignSelf: "start" }}>&times;</button>
                </div>
              ))}

              {/* CROSS-SELL (Compre Junto) */}
              <div style={{ marginTop: 20 }}>
                <p style={{ fontFamily: ftD, fontSize: 15, fontWeight: 700, marginBottom: 12, color: C.nv }}>⚡ Aproveite e complete seu pedido</p>
                <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10 }}>
                  {CROSS_ITEMS.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => toggleCross(c.id)} 
                      style={{ 
                        minWidth: 140, padding: "12px", borderRadius: 12, border: cross[c.id] ? `2px solid ${C.co}` : `1.5px solid ${C.bd}`, 
                        cursor: "pointer", background: cross[c.id] ? C.coS : C.wh, transition: "all 0.2s" 
                      }}
                    >
                      <p style={{ fontFamily: ft, fontSize: 12, margin: "0 0 4px", fontWeight: 700, color: C.nv }}>{c.name}</p>
                      <p style={{ fontFamily: ft, fontSize: 13, margin: 0, color: C.co, fontWeight: 800 }}>+{fm(c.price)}</p>
                      <button style={{ 
                        marginTop: 8, width: "100%", background: cross[c.id] ? C.co : C.nv, color: "#FFF", 
                        border: "none", borderRadius: 6, padding: "4px", fontSize: 11, fontWeight: 700, cursor: "pointer" 
                      }}>
                        {cross[c.id] ? "Adicionado" : "Adicionar"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SOCIAL PROOF BLOCK */}
              <div style={{ marginTop: 24, padding: "16px", background: C.cr, borderRadius: 12, display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#DDD", overflow: "hidden" }}>
                  <img src="https://i.pravatar.cc/100?u=12" alt="" style={{ width: "100%" }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.nv }}>"A qualidade me surpreendeu!"</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: C.lt }}>Ana P. — Compradora verificada ⭐⭐⭐⭐⭐</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
          <div style={{ padding: 22, borderTop: `1px solid ${C.bd}`, background: C.wh }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 19, fontWeight: 900, color: C.nv, marginBottom: 16 }}>
              <span>Total</span>
              <span>{fm(total)}</span>
            </div>
            <Btn primary full onClick={() => { onClose(); onCheckout(); }} style={{ padding: "18px", fontSize: 16, fontWeight: 800 }}>
              FINALIZAR COMPRA ❯
            </Btn>
            
            {/* TRUST BADGES */}
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 12, opacity: 0.6 }}>
               <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="Visa" style={{ height: 18 }} />
               <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="Master" style={{ height: 18 }} />
               <img src="https://cdn-icons-png.flaticon.com/128/9402/9402128.png" alt="Pix" style={{ height: 18 }} />
               <span style={{ fontSize: 10, fontFamily: ft, fontWeight: 700, color: C.lt, marginLeft: 4 }}>Site 100% Seguro</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
