import { useState } from 'react';
import { C, ft, ftD, fm } from '../config/theme.js';
import { useCart } from '../context/CartContext.jsx';
import { useMobile } from '../hooks/useMobile.js';
import { Btn } from '../components/ui.jsx';

export const PromoBar = ({ cH, cM, cS }) => {
  const isMobile = useMobile();
  return (
    <div style={{background:C.nv,color:C.wh,textAlign:"center",padding: isMobile ? "8px 12px" : "10px 20px",fontFamily:ft,fontSize: isMobile ? 11 : 13,fontWeight:500}}>
      {isMobile ? "Frete grátis · Até 35% OFF · Pix 5% extra" : "Frete grátis · Até 35% OFF · Pix 5% extra · Termina em "}
      {!isMobile && <span style={{fontWeight:700,color:"#7DD3C0"}}>{cH}:{cM}:{cS}</span>}
    </div>
  );
};

export const StoreNav = ({ page, filter, setPage, setFilter, showCart, setShowCart }) => {
  const { count } = useCart();
  const isMobile = useMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding: isMobile ? "0 16px" : "0 24px",height:64,borderBottom:`1px solid ${C.bd}`,position:"sticky",top:0,zIndex:100,background:"rgba(255,255,255,.95)",backdropFilter:"blur(10px)"}}>
      <div style={{display:"flex",alignItems:"center",gap: isMobile ? 16 : 36}}>
        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{background:"none", border:"none", padding: 0, cursor:"pointer", color:C.nv}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        )}
        <span style={{fontFamily:ftD,fontSize: isMobile ? 20 : 24,fontWeight:700,color:C.nv,letterSpacing:-.5,cursor:"pointer"}} onClick={() => {setPage("home");setShowCart(false);setMenuOpen(false)}}>elior</span>
        
        {!isMobile && (
          <div style={{fontFamily:ft,display:"flex",gap:20,fontSize:14,color:C.md,fontWeight:500}}>
            {[["all","Todos"],["grau","Grau"],["sol","Sol"]].map(([f,l]) => (
              <span key={f} style={{cursor:"pointer",color:filter===f&&page==="catalog"?C.nv:C.md}} onClick={() => {setPage("catalog");setFilter(f)}}>{l}</span>
            ))}
          </div>
        )}
      </div>

      <div style={{display:"flex", gap: 8, alignItems:"center"}}>
        <button onClick={() => setShowCart(!showCart)} style={{position:"relative",background:count>0?C.nv:"transparent",border:`1.5px solid ${count>0?C.nv:C.bd}`,borderRadius:10,padding: isMobile ? "7px 10px" : "8px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={count>0?C.wh:C.md} strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
          {count > 0 && <span style={{fontFamily:ft,fontSize:13,fontWeight:600,color:C.wh}}>{count}</span>}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobile && menuOpen && (
        <div style={{position:"absolute", top: 64, left: 0, right: 0, background: C.wh, borderBottom: `1px solid ${C.bd}`, padding: 20, display: "flex", flexDirection: "column", gap: 16, animation: "fadeIn 0.2s"}}>
          {[["all","Todos os Óculos"],["grau","Óculos de Grau"],["sol","Óculos de Sol"]].map(([f,l]) => (
            <span key={f} style={{fontFamily:ft, fontSize: 16, fontWeight: 600, color: filter===f&&page==="catalog"?C.co:C.nv}} onClick={() => {setPage("catalog");setFilter(f);setMenuOpen(false)}}>{l}</span>
          ))}
        </div>
      )}
    </nav>
  );
};

export const Footer = ({ onLoginClick }) => (
  <footer style={{borderTop:`1px solid ${C.bd}`,padding:"40px 24px 24px",marginTop:48,background:C.cr,fontFamily:ft}}>
    <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:28}}>
      <div><span style={{fontFamily:ftD,fontSize:22,fontWeight:700,color:C.nv}}>elior</span><p style={{fontSize:13,color:C.md,lineHeight:1.7,marginTop:10}}>Óculos premium com tecnologia e preço justo.</p></div>
      <div><p style={{fontWeight:700,fontSize:13,color:C.nv,marginBottom:10}}>Links</p>{["Sobre","Trocas","FAQ"].map(l => <p key={l} style={{fontSize:13,color:C.md,marginBottom:8,cursor:"pointer"}}>{l}</p>)}</div>
      <div><p style={{fontWeight:700,fontSize:13,color:C.nv,marginBottom:10}}>Contato</p><p style={{fontSize:13,color:C.md,marginBottom:8}}>(11) 99999-0000</p><p style={{fontSize:13,color:C.md}}>contato@elior.com.br</p></div>
      <div><p style={{fontWeight:700,fontSize:13,color:C.nv,marginBottom:10}}>Pagamentos</p><p style={{fontSize:13,color:C.md,marginBottom:8}}>Pix · Cartão · Boleto</p><p style={{fontSize:13,color:C.md}}>Correios · Jadlog</p></div>
    </div>
    <div style={{maxWidth:1100,margin:"24px auto 0",borderTop:`1px solid ${C.bd}`,paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12,color:C.lt}}>
      <span>© 2026 Elior Eyewear — CNPJ 00.000.000/0001-00</span>
      <span onClick={onLoginClick} style={{cursor:"default",padding:"4px 8px",borderRadius:4,transition:"all .3s",userSelect:"none"}} onMouseOver={e => {e.target.style.background=C.wm;e.target.style.cursor="pointer"}} onMouseOut={e => {e.target.style.background="transparent";e.target.style.cursor="default"}}>···</span>
    </div>
  </footer>
);
