import { useState } from 'react';
import { C, ft, ftD } from '../config/theme.js';
import { Card, Metric, Badge, Progress, Tabs } from '../components/ui.jsx';

export function IntelPage() {
  const [tab, setTab] = useState('overview');

  return (
    <div>
      <h1 style={{fontFamily:ftD,fontSize:24,fontWeight:700,color:C.nv,margin:"0 0 20px"}}>Inteligência</h1>
      <Tabs tabs={[["overview","Métricas"],["cohort","Coorte"],["channels","Canais"]]} active={tab} onChange={setTab}/>

      {tab === 'overview' && (
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            <Metric label="LTV médio" value="R$ 724" delta="+15%"/>
            <Metric label="CAC" value="R$ 48" delta="-8%" color={C.co}/>
            <Metric label="LTV:CAC" value="15.1x" delta="+22%" color={C.ig}/>
            <Metric label="Recompra" value="28.4%" delta="+3pp" color={C.gl}/>
          </div>
          <Card>
            <h3 style={{fontFamily:ft,fontSize:14,fontWeight:700,color:C.nv,margin:"0 0 14px"}}>Comportamento</h3>
            {[["Tempo no site","4m 32s","+18%",C.sg],["Páginas/sessão","6.8","+12%",C.ig],["Rejeição","24%","-5%",C.co],["Carrinho→compra","34%","+8%",C.gl],["Mobile","72%","+3%",C.nv]].map(([l,v,d,c]) => (
              <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.bd}`}}>
                <span style={{fontFamily:ft,fontSize:13,color:C.nv}}>{l}</span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontFamily:ftD,fontSize:15,fontWeight:700,color:C.nv}}>{v}</span>
                  <Badge color={d.startsWith('+')?C.sg:C.dn}>{d}</Badge>
                </div>
              </div>
            ))}
          </Card>
        </>
      )}

      {tab === 'cohort' && (
        <Card>
          <h3 style={{fontFamily:ftD,fontSize:17,fontWeight:700,color:C.nv,margin:"0 0 16px"}}>Retenção mensal por coorte</h3>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:ft,fontSize:11}}>
            <thead>
              <tr>
                <th style={{padding:6,textAlign:"left",color:C.md}}>Coorte</th>
                {["M0","M1","M2","M3","M4"].map(m => <th key={m} style={{padding:6,color:C.md}}>{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                {m:"Jan",r:[100,42,28,22,18]},
                {m:"Fev",r:[100,45,31,24,20]},
                {m:"Mar",r:[100,40,27,21,0]},
                {m:"Abr",r:[100,48,33,0,0]},
                {m:"Mai",r:[100,46,0,0,0]}
              ].map(row => (
                <tr key={row.m}>
                  <td style={{padding:6,fontWeight:600,color:C.nv}}>{row.m}</td>
                  {row.r.map((v,i) => (
                    <td key={i} style={{padding:6,textAlign:"center",fontWeight:600,color:v===0?C.lt:v>30?C.sg:v>15?C.gl:C.co,background:v===0?"transparent":v>30?C.sgS:v>15?C.glS:C.coS,borderRadius:3}}>
                      {v || ""}{v ? "%" : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'channels' && (
        <Card>
          <h3 style={{fontFamily:ft,fontSize:14,fontWeight:700,color:C.nv,margin:"0 0 14px"}}>Performance por canal</h3>
          {[
            {ch:"Meta Ads",v:42,roi:4.7,c:C.co},
            {ch:"Google Ads",v:28,roi:3.8,c:C.ig},
            {ch:"Orgânico",v:18,roi:"∞",c:C.sg},
            {ch:"TikTok",v:8,roi:3.2,c:C.gl},
            {ch:"Indicação",v:4,roi:12.1,c:C.nv}
          ].map(ch => (
            <div key={ch.ch} style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:6,height:6,borderRadius:3,background:ch.c}}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontFamily:ft,fontSize:12,fontWeight:600,color:C.nv}}>{ch.ch}</span>
                  <span style={{fontFamily:ft,fontSize:11,fontWeight:600,color:ch.c}}>{ch.v}%</span>
                </div>
                <Progress value={ch.v} color={ch.c} h={4}/>
              </div>
              <span style={{fontFamily:ft,fontSize:11,fontWeight:700,color:C.nv,minWidth:50,textAlign:"right"}}>ROI {ch.roi}x</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
