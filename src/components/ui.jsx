import { C, ft, ftD } from '../config/theme.js';

export const Stars = ({r, s=14}) => <span style={{color:C.gl,fontSize:s,letterSpacing:1}}>{"★".repeat(Math.floor(r))}{"☆".repeat(5-Math.floor(r))}</span>;

export const Badge = ({children, color=C.sg}) => <span style={{fontFamily:ft,fontSize:11,fontWeight:700,color,background:color+"15",padding:"4px 10px",borderRadius:6,whiteSpace:"nowrap"}}>{children}</span>;

export const Btn = ({children, primary, small, onClick, disabled, full, style:s}) => (
  <button disabled={disabled} onClick={onClick} style={{fontFamily:ft,fontSize:small?12:14,fontWeight:600,padding:small?"7px 14px":"12px 24px",borderRadius:10,border:primary?"none":`1.5px solid ${C.bd}`,background:disabled?"#ccc":primary?C.co:C.wh,color:primary?C.wh:C.nv,cursor:disabled?"not-allowed":"pointer",transition:"all .2s",display:"inline-flex",alignItems:"center",gap:6,width:full?"100%":undefined,justifyContent:"center",boxSizing:"border-box",...s}}>{children}</button>
);

export const Card = ({children, style:s, ...p}) => <div style={{background:C.wh,border:`1px solid ${C.bd}`,borderRadius:16,padding:24,...s}} {...p}>{children}</div>;

export const Toggle = ({on, onToggle}) => (
  <div onClick={onToggle} style={{width:44,height:24,borderRadius:12,background:on?C.sg:C.bd,cursor:"pointer",padding:2,transition:"background .2s",display:"flex",alignItems:"center"}}>
    <div style={{width:20,height:20,borderRadius:10,background:C.wh,transform:on?"translateX(20px)":"none",transition:"transform .2s",boxShadow:"0 1px 3px rgba(0,0,0,.15)"}}/>
  </div>
);

export const Progress = ({value, color=C.co, h=8}) => (
  <div style={{height:h,background:C.wm,borderRadius:h/2,overflow:"hidden"}}>
    <div style={{height:"100%",width:`${Math.min(value,100)}%`,background:color,borderRadius:h/2,transition:"width .5s"}}/>
  </div>
);

export const MiniBar = ({data, color=C.co, h=80}) => {
  const m = Math.max(...data);
  return <div style={{display:"flex",alignItems:"end",gap:3,height:h}}>{data.map((v,i) => <div key={i} style={{flex:1,height:`${(v/m)*100}%`,background:i===data.length-1?color:color+"40",borderRadius:"3px 3px 0 0",minHeight:2}}/>)}</div>;
};

export const Metric = ({label, value, delta, color=C.sg}) => (
  <div style={{background:C.wh,border:`1px solid ${C.bd}`,borderRadius:14,padding:"18px 20px"}}>
    <span style={{fontFamily:ft,fontSize:12,fontWeight:500,color:C.md,display:"block",marginBottom:10}}>{label}</span>
    <p style={{fontFamily:ftD,fontSize:24,fontWeight:700,color:C.nv,margin:"0 0 4px"}}>{value}</p>
    {delta && <span style={{fontFamily:ft,fontSize:12,fontWeight:600,color:delta.startsWith("+")?C.sg:C.dn}}>{delta}</span>}
  </div>
);

export const Inp = ({label, ...p}) => (
  <div style={{marginBottom:14}}>
    {label && <label style={{fontFamily:ft,fontSize:12,fontWeight:600,color:C.md,display:"block",marginBottom:5}}>{label}</label>}
    <input {...p} style={{fontFamily:ft,width:"100%",padding:"11px 14px",border:`1.5px solid ${C.bd}`,borderRadius:10,fontSize:14,boxSizing:"border-box",outline:"none",color:C.tx,background:C.wh,...(p.style||{})}}/>
  </div>
);

export const Tabs = ({tabs, active, onChange}) => (
  <div style={{display:"flex",gap:4,background:C.wm,borderRadius:10,padding:3,marginBottom:24}}>
    {tabs.map(t => <button key={t[0]} onClick={() => onChange(t[0])} style={{fontFamily:ft,fontSize:12,fontWeight:active===t[0]?600:500,padding:"8px 16px",borderRadius:8,border:"none",background:active===t[0]?C.wh:"transparent",color:active===t[0]?C.nv:C.md,cursor:"pointer"}}>{t[1]}</button>)}
  </div>
);
