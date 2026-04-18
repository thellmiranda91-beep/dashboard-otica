import { useState } from 'react';
import { C, ft, ftD } from '../config/theme.js';
import { Btn, Inp } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/* ═══ Lead Capture Popup ═══ */
export function LeadPopup({ onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  const [wpp, setWpp] = useState('');

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(12,31,46,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(4px)"}} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{background:C.wh,borderRadius:20,padding:"40px 32px",maxWidth:380,width:"100%",textAlign:"center",position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:12,right:16,background:C.wm,border:"none",width:26,height:26,borderRadius:8,cursor:"pointer",fontSize:14,color:C.md}}>&times;</button>
        <h2 style={{fontFamily:ftD,fontSize:22,fontWeight:700,color:C.nv,marginBottom:6}}>Ganhe 15% OFF</h2>
        <p style={{fontFamily:ft,fontSize:14,color:C.md,marginBottom:20}}>+ frete grátis na primeira compra</p>
        <Inp placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
        <Inp placeholder="WhatsApp" value={wpp} onChange={e => setWpp(e.target.value)}/>
        <Btn primary full onClick={() => { onSubmit(email, wpp); onClose(); }}>Quero meu cupom!</Btn>
      </div>
    </div>
  );
}

/* ═══ Abandoned Cart Notification ═══ */
export function AbandonNotif({ onClose, onBack }) {
  return (
    <div style={{position:"fixed",bottom:20,right:20,zIndex:150,background:C.wh,border:`1px solid ${C.bd}`,borderRadius:14,padding:"16px 20px",maxWidth:300,boxShadow:"0 10px 28px rgba(12,31,46,0.12)"}}>
      <button onClick={onClose} style={{position:"absolute",top:8,right:12,background:"none",border:"none",fontSize:14,cursor:"pointer",color:C.lt}}>&times;</button>
      <p style={{fontFamily:ft,fontSize:14,fontWeight:700,color:C.nv,marginBottom:4}}>Esqueceu algo?</p>
      <p style={{fontFamily:ft,fontSize:13,color:C.md,marginBottom:10}}>Use <span style={{fontWeight:700,color:C.co}}>VOLTE10</span> = 10% OFF</p>
      <Btn primary small onClick={onBack}>Voltar ao carrinho</Btn>
    </div>
  );
}

/* ═══ Upsell Modal ═══ */
export function UpsellModal({ onDecline }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(12,31,46,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:C.wh,borderRadius:20,padding:"36px 28px",maxWidth:400,width:"100%",textAlign:"center"}}>
        <h2 style={{fontFamily:ftD,fontSize:22,fontWeight:700,color:C.nv,marginBottom:6}}>Pedido confirmado!</h2>
        <p style={{fontFamily:ft,fontSize:14,color:C.md,marginBottom:24}}>Segundo óculos com <span style={{color:C.co,fontWeight:700}}>40% OFF</span></p>
        <Btn onClick={onDecline} full>Ver confirmação</Btn>
      </div>
    </div>
  );
}

/* ═══ Confirmation Page ═══ */
export function ConfirmPage({ onContinue }) {
  return (
    <div style={{padding:"56px 24px",textAlign:"center",maxWidth:500,margin:"0 auto"}}>
      <div style={{width:72,height:72,borderRadius:"50%",background:C.sgS,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.sg} strokeWidth="2.5"><path d="M22 4L12 14.01l-3-3"/></svg>
      </div>
      <h1 style={{fontFamily:ftD,fontSize:26,fontWeight:700,color:C.nv,marginBottom:6}}>Obrigado pela compra!</h1>
      <p style={{fontFamily:ft,fontSize:14,color:C.md,marginBottom:8}}>Pedido #{Math.floor(Math.random()*90000+10000)} confirmado.</p>
      <p style={{fontFamily:ft,fontSize:13,color:C.lt,marginBottom:32}}>Você receberá atualizações via WhatsApp e Email.</p>
      <Btn primary onClick={onContinue}>Continuar comprando</Btn>
    </div>
  );
}

/* ═══ Admin Login Modal ═══ */
export function LoginModal({ onClose, onSuccess }) {
  const { login } = useAuth();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const submit = () => {
    const r = login(user, pass);
    if (r.success) { onSuccess(); } else { setErr(r.error); }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(12,31,46,0.7)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(6px)"}} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{background:C.wh,borderRadius:20,padding:"48px 36px",maxWidth:380,width:"100%",textAlign:"center"}}>
        <div style={{width:48,height:48,borderRadius:14,background:C.nv,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
          <span style={{fontFamily:ftD,fontSize:18,fontWeight:700,color:"#7DD3C0"}}>E</span>
        </div>
        <h2 style={{fontFamily:ftD,fontSize:22,fontWeight:700,color:C.nv,marginBottom:4}}>Acesso administrativo</h2>
        <p style={{fontFamily:ft,fontSize:13,color:C.lt,marginBottom:24}}>Área restrita</p>
        {err && <div style={{fontFamily:ft,background:C.dnS,color:C.dn,padding:"8px 14px",borderRadius:8,fontSize:13,fontWeight:600,marginBottom:14}}>{err}</div>}
        <Inp label="Usuário" placeholder="seu.usuario" value={user} onChange={e => setUser(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}/>
        <Inp label="Senha" type="password" placeholder="••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}/>
        <Btn primary full onClick={submit} style={{marginTop:8}}>Entrar</Btn>
        <button onClick={onClose} style={{fontFamily:ft,background:"none",border:"none",color:C.lt,fontSize:12,cursor:"pointer",marginTop:14}}>Cancelar</button>
      </div>
    </div>
  );
}
