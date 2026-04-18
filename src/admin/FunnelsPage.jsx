import { C, ft, ftD, fm, fk, pc } from '../config/theme.js';
import { Card, Badge, Toggle, Metric } from '../components/ui.jsx';

export function FunnelsPage({ funnels, setFunnels }) {
  const totalRev = funnels.reduce((s, f) => s + f.revenue, 0);
  const totalConv = funnels.reduce((s, f) => s + f.converted, 0);
  const activeFunnels = funnels.filter(f => f.sent > 0);
  const avgRate = activeFunnels.length > 0
    ? activeFunnels.reduce((s, f) => s + (f.converted / f.sent), 0) / activeFunnels.length * 100
    : 0;

  return (
    <div>
      <h1 style={{fontFamily:ftD,fontSize:24,fontWeight:700,color:C.nv,margin:"0 0 20px"}}>Funis</h1>
      
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
        <Metric label="Receita recuperada" value={fm(totalRev)} delta="+24%"/>
        <Metric label="Convertidos" value={totalConv.toLocaleString()} delta="+18%" color={C.co}/>
        <Metric label="Taxa média" value={pc(avgRate)} color={C.ig}/>
      </div>

      {funnels.map(f => (
        <Card key={f.id} style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:12}}>
            <div>
              <h3 style={{fontFamily:ft,fontSize:15,fontWeight:700,color:C.nv,margin:"0 0 4px"}}>{f.name}</h3>
              <div style={{display:"flex",gap:6}}>
                <Badge color={f.channel==='whatsapp'?C.sg:C.ig}>{f.channel}</Badge>
                <Badge color={f.type==='abandono'?C.co:f.type==='recompra'?C.sg:C.ig}>{f.type}</Badge>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <Toggle on={f.active} onToggle={() => setFunnels(fs => fs.map(x => x.id===f.id ? {...x, active: !x.active} : x))}/>
              <span style={{fontFamily:ft,fontSize:12,fontWeight:600,color:f.active?C.sg:C.lt}}>{f.active?"Ativo":"Off"}</span>
            </div>
          </div>
          
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12}}>
            {[["Enviados",f.sent.toLocaleString(),C.nv],["Convertidos",f.converted.toLocaleString(),C.sg],["Taxa",f.sent?pc((f.converted/f.sent)*100):"—",C.co],["Receita",fk(f.revenue),C.gl]].map(([l,v,c]) => (
              <div key={l} style={{background:C.cr,borderRadius:10,padding:"8px 10px"}}>
                <span style={{fontFamily:ft,fontSize:10,color:C.md,display:"block"}}>{l}</span>
                <span style={{fontFamily:ftD,fontSize:15,fontWeight:700,color:c}}>{v}</span>
              </div>
            ))}
          </div>
          
          <div style={{display:"flex",gap:8,overflowX:"auto"}}>
            {f.steps.map((s,i) => (
              <div key={i} style={{minWidth:200,background:C.wm,borderRadius:10,padding:10,flex:"0 0 auto"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <Badge color={s.type==='cupom'?C.gl:s.type==='urgência'?C.co:C.sg}>{s.type}</Badge>
                  <span style={{fontFamily:ft,fontSize:10,color:C.lt}}>{s.delay}</span>
                </div>
                <p style={{fontFamily:ft,fontSize:11,color:C.md,lineHeight:1.4,margin:0}}>{s.msg}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
