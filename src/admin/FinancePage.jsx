import { useState } from 'react';
import { C, ft, ftD, fm, fk, pc } from '../config/theme.js';
import { Card, Metric, MiniBar, Tabs } from '../components/ui.jsx';
import { MONTHS, REV_DATA, COST_DATA } from '../config/data.js';

export function FinancePage({ products }) {
  const [tab, setTab] = useState('overview');
  
  const totalRev = products.reduce((s, p) => s + p.price * p.sold, 0);
  const totalCost = products.reduce((s, p) => s + p.cost * p.sold, 0);
  const totalProfit = totalRev - totalCost;

  return (
    <div>
      <h1 style={{fontFamily:ftD,fontSize:24,fontWeight:700,color:C.nv,margin:"0 0 20px"}}>Financeiro</h1>
      <Tabs tabs={[["overview","Visão geral"],["pnl","P&L"],["cashflow","Fluxo de caixa"]]} active={tab} onChange={setTab}/>

      {tab === 'overview' && (
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            <Metric label="Receita" value={fm(totalRev)} delta="+18%"/>
            <Metric label="Custos" value={fm(totalCost)} color={C.co}/>
            <Metric label="Lucro" value={fm(totalProfit)} delta="+22%" color={C.ig}/>
            <Metric label="Margem" value={pc((totalProfit/totalRev)*100)} color={C.gl}/>
          </div>
          <Card>
            <h3 style={{fontFamily:ft,fontSize:14,fontWeight:700,color:C.nv,margin:"0 0 14px"}}>Receita mensal</h3>
            <MiniBar data={REV_DATA} color={C.co} h={90}/>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
              {MONTHS.map((m,i) => <span key={i} style={{fontFamily:ft,fontSize:9,color:C.lt,flex:1,textAlign:"center"}}>{m}</span>)}
            </div>
          </Card>
        </>
      )}

      {tab === 'pnl' && (
        <Card>
          <h3 style={{fontFamily:ftD,fontSize:17,fontWeight:700,color:C.nv,margin:"0 0 16px"}}>Demonstrativo de Resultado</h3>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:ft}}>
            <thead>
              <tr style={{borderBottom:`2px solid ${C.bd}`}}>
                <th style={{textAlign:"left",padding:"8px 0",fontSize:11,color:C.md}}>Conta</th>
                {MONTHS.slice(-6).map(m => <th key={m} style={{textAlign:"right",padding:"8px 6px",fontSize:11,color:C.md}}>{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                {l:"Receita",d:REV_DATA.slice(-6),b:true,c:C.nv},
                {l:"(-) COGS",d:COST_DATA.slice(-6),c:C.dn},
                {l:"(=) Lucro bruto",d:REV_DATA.slice(-6).map((r,i) => r - COST_DATA.slice(-6)[i]),b:true,c:C.sg},
                {l:"(-) Marketing (12%)",d:REV_DATA.slice(-6).map(r => Math.round(r*.12)),c:C.md},
                {l:"(-) Operação (9%)",d:REV_DATA.slice(-6).map(r => Math.round(r*.09)),c:C.md},
                {l:"(=) Lucro líquido",d:REV_DATA.slice(-6).map((r,i) => Math.round(r - COST_DATA.slice(-6)[i] - r*.21)),b:true,c:C.sg}
              ].map((row,i) => (
                <tr key={i} style={{borderBottom:`1px solid ${C.bd}`}}>
                  <td style={{padding:"8px 0",fontSize:12,fontWeight:row.b?700:400,color:row.c}}>{row.l}</td>
                  {row.d.map((v,j) => (
                    <td key={j} style={{textAlign:"right",padding:"8px 6px",fontSize:12,fontWeight:row.b?700:400,color:row.c}}>{fk(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'cashflow' && (
        <Card>
          <h3 style={{fontFamily:ftD,fontSize:17,fontWeight:700,color:C.nv,margin:"0 0 16px"}}>Fluxo de caixa</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10}}>
            {MONTHS.slice(-6).map((m,i) => {
              const idx = i + 6;
              const net = REV_DATA[idx] - COST_DATA[idx] - Math.round(REV_DATA[idx]*.21);
              return (
                <div key={m} style={{background:C.cr,borderRadius:12,padding:14,textAlign:"center"}}>
                  <span style={{fontFamily:ft,fontSize:12,fontWeight:700,color:C.nv,display:"block",marginBottom:8}}>{m}</span>
                  <span style={{fontFamily:ft,fontSize:10,color:C.md,display:"block"}}>Entrada</span>
                  <span style={{fontFamily:ft,fontSize:13,fontWeight:700,color:C.sg}}>{fk(REV_DATA[idx])}</span>
                  <div style={{borderTop:`1px solid ${C.bd}`,marginTop:8,paddingTop:8}}>
                    <span style={{fontFamily:ftD,fontSize:15,fontWeight:700,color:net>0?C.sg:C.dn}}>+{fk(net)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
