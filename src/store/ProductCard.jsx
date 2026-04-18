import { C, ft, ftD, fm } from '../config/theme.js';
import { Stars } from '../components/ui.jsx';

export function ProdCard({ p, onClick }) {
  return (
    <div onClick={onClick} style={{background:C.wh,border:`1px solid ${C.bd}`,borderRadius:16,overflow:"hidden",cursor:"pointer",transition:"all .25s"}} onMouseOver={e => {e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 12px 28px rgba(12,31,46,0.08)"}} onMouseOut={e => {e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"}}>
      <div style={{position:"relative",background:C.wm,aspectRatio:"1",overflow:"hidden"}}>
        <img src={p.images?.[0] || p.img} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}} loading="lazy"/>
        {p.badge && <span style={{position:"absolute",top:12,left:12,background:p.badge==="Últimas unidades"?C.dn:C.nv,color:C.wh,padding:"5px 12px",fontSize:11,fontWeight:600,borderRadius:8,fontFamily:ft}}>{p.badge}</span>}
      </div>
      <div style={{padding:"16px 18px 18px"}}>
        <p style={{fontFamily:ft,fontSize:11,fontWeight:600,color:C.sg,letterSpacing:1.5,marginBottom:4,textTransform:"uppercase"}}>{p.cat}</p>
        <h3 style={{fontFamily:ftD,fontSize:16,fontWeight:600,color:C.nv,marginBottom:6}}>{p.name}</h3>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
          <Stars r={p.rating} s={12}/><span style={{fontFamily:ft,fontSize:11,color:C.lt}}>({p.sold})</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontFamily:ft,fontSize:18,fontWeight:700,color:C.nv}}>{fm(p.price)}</span>
          {p.oldPrice && <><span style={{fontFamily:ft,fontSize:12,color:C.lt,textDecoration:"line-through"}}>{fm(p.oldPrice)}</span><span style={{fontFamily:ft,fontSize:11,fontWeight:700,color:C.co,background:C.coS,padding:"2px 6px",borderRadius:4}}>-{Math.round((1-p.price/p.oldPrice)*100)}%</span></>}
        </div>
      </div>
    </div>
  );
}
