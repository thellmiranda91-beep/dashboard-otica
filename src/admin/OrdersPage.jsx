import { C, ft, ftD, fm } from '../config/theme.js';
import { Card, Badge, Btn } from '../components/ui.jsx';

export function OrdersPage({ orders, onGoToStore }) {
  return (
    <div>
      <h1 style={{fontFamily:ftD,fontSize:24,fontWeight:700,color:C.nv,margin:"0 0 20px"}}>Pedidos ({orders.length})</h1>
      
      {orders.length === 0 ? (
        <Card>
          <p style={{fontFamily:ft,textAlign:"center",color:C.lt,padding:40}}>Faça uma compra pela loja para ver pedidos aqui.</p>
          <div style={{textAlign:"center"}}>
            <Btn primary onClick={onGoToStore}>Ir à loja</Btn>
          </div>
        </Card>
      ) : (
        <Card style={{padding:0}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:ft}}>
            <thead>
              <tr style={{borderBottom:`1px solid ${C.bd}`}}>
                {["ID","Data","Itens","Total","Status"].map(h => (
                  <th key={h} style={{textAlign:"left",padding:"12px 14px",fontSize:11,fontWeight:600,color:C.md}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{borderBottom:`1px solid ${C.bd}`, background: "#FFF"}}>
                  <td style={{padding:"14px",fontSize:13,fontWeight:600,color:C.nv}}>#{o.id.toString().slice(-5)}</td>
                  <td style={{padding:"14px",fontSize:13,color:C.md}}>{new Date(o.date).toLocaleDateString('pt-BR')}</td>
                  <td style={{padding:"14px",fontSize:13,color:C.nv}}>
                    {o.items.map((i, idx) => (
                      <div key={idx} style={{marginBottom: 8}}>
                        <strong>{i.name}</strong> ({i.color})
                        {i.config?.prescriptionManual && (
                          <div style={{fontSize: 11, background: C.wm, padding: 8, borderRadius: 6, marginTop: 4}}>
                            <strong>OD:</strong> E:{i.config.prescriptionManual.od.sph} C:{i.config.prescriptionManual.od.cyl} E:{i.config.prescriptionManual.od.axis} | 
                            <strong>OE:</strong> E:{i.config.prescriptionManual.oe.sph} C:{i.config.prescriptionManual.oe.cyl} E:{i.config.prescriptionManual.oe.axis} | 
                            <strong>DNP:</strong> {i.config.prescriptionManual.dnp}
                          </div>
                        )}
                        {i.config?.prescriptionFile && (
                          <div style={{fontSize: 11, color: C.sg, fontWeight: 700, marginTop: 4}}>
                            📄 Receita Anexada (Ver no banco)
                          </div>
                        )}
                      </div>
                    ))}
                  </td>
                  <td style={{padding:"14px",fontSize:13,fontWeight:700,color:C.sg}}>{fm(o.total)}</td>
                  <td style={{padding:"14px"}}><Badge color={C.sg}>Confirmado</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
