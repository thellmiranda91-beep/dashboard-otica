import { C, ft, ftD, fm, fk } from '../config/theme.js';
import { Card, Metric, MiniBar } from '../components/ui.jsx';
import { MONTHS, REV_DATA } from '../config/data.js';

export function DashboardPage({ products }) {
  const totalRev = products.reduce((s, p) => s + p.price * p.sold, 0);
  const totalCost = products.reduce((s, p) => s + p.cost * p.sold, 0);
  const totalProfit = totalRev - totalCost;
  const totalSold = products.reduce((s, p) => s + p.sold, 0);

  return (
    <div>
      <h1 style={{fontFamily:ftD,fontSize:24,fontWeight:700,color:C.nv,margin:"0 0 20px"}}>Dashboard</h1>
      
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        <Metric label="Receita" value={fm(totalRev)} delta="+18%"/>
        <Metric label="Lucro" value={fm(totalProfit)} delta="+22%" color={C.ig}/>
        <Metric label="Ticket médio" value={fm(Math.round(totalRev/totalSold))} delta="+8%" color={C.co}/>
        <Metric label="Pedidos" value={totalSold.toLocaleString()} delta="+15%" color={C.gl}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:20}}>
        <Card>
          <h3 style={{fontFamily:ft,fontSize:14,fontWeight:700,color:C.nv,margin:"0 0 14px"}}>Receita mensal</h3>
          <MiniBar data={REV_DATA} color={C.co} h={100}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
            {MONTHS.map((m,i) => <span key={i} style={{fontFamily:ft,fontSize:9,color:C.lt,flex:1,textAlign:"center"}}>{m}</span>)}
          </div>
        </Card>
        <Card>
          <h3 style={{fontFamily:ft,fontSize:14,fontWeight:700,color:C.nv,margin:"0 0 14px"}}>Top 5 produtos</h3>
          {[...products].sort((a,b) => b.sold - a.sold).slice(0,5).map((p,i) => (
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <span style={{fontFamily:ft,fontSize:11,fontWeight:700,color:C.lt,minWidth:16}}>#{i+1}</span>
              <img src={p.img} alt="" style={{width:28,height:28,borderRadius:6,objectFit:"cover"}}/>
              <span style={{fontFamily:ft,fontSize:12,fontWeight:600,color:C.nv,flex:1}}>{p.name}</span>
              <span style={{fontFamily:ft,fontSize:12,fontWeight:700,color:C.sg}}>{fk(p.price*p.sold)}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <h3 style={{fontFamily:ft,fontSize:14,fontWeight:700,color:C.nv,margin:"0 0 14px"}}>Funil de conversão</h3>
        {[["Visitantes",45230,100,C.ig],["Adicionaram ao carrinho",8741,19.3,C.co],["Checkout iniciado",3422,7.6,C.gl],["Pagamento",1876,4.1,C.sg]].map(([l,v,pct,c]) => (
          <div key={l} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontFamily:ft,fontSize:12,color:C.nv,fontWeight:500}}>{l}</span>
              <span style={{fontFamily:ft,fontSize:12,fontWeight:700,color:c}}>{v.toLocaleString()} ({pct}%)</span>
            </div>
            <div style={{height:8,background:C.wm,borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,background:c,borderRadius:4}}/>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
