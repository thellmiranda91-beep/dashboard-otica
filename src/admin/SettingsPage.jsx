import { C, ft, ftD } from '../config/theme.js';
import { Card, Toggle, Btn, Inp } from '../components/ui.jsx';

export function SettingsPage() {
  return (
    <div>
      <h1 style={{fontFamily:ftD,fontSize:24,fontWeight:700,color:C.nv,margin:"0 0 20px"}}>Configurações</h1>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card>
          <h3 style={{fontFamily:ft,fontSize:15,fontWeight:700,color:C.nv,margin:"0 0 14px"}}>Pagamento</h3>
          {["Pix (5% OFF)","Cartão (Mercado Pago)","Boleto"].map(i => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.bd}`}}>
              <span style={{fontFamily:ft,fontSize:13,color:C.nv}}>{i}</span>
              <Toggle on={true} onToggle={() => {}}/>
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{fontFamily:ft,fontSize:15,fontWeight:700,color:C.nv,margin:"0 0 14px"}}>Logística</h3>
          {["Correios PAC","Correios SEDEX","Jadlog"].map((i, idx) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.bd}`}}>
              <span style={{fontFamily:ft,fontSize:13,color:C.nv}}>{i}</span>
              <Toggle on={idx<2} onToggle={() => {}}/>
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{fontFamily:ft,fontSize:15,fontWeight:700,color:C.nv,margin:"0 0 14px"}}>Tráfego pago</h3>
          {["Meta Ads","TikTok Ads","Google Ads"].map((i, idx) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.bd}`}}>
              <span style={{fontFamily:ft,fontSize:13,color:C.nv}}>{i}</span>
              <Toggle on={idx<2} onToggle={() => {}}/>
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{fontFamily:ft,fontSize:15,fontWeight:700,color:C.nv,margin:"0 0 14px"}}>Dados da loja</h3>
          <Inp label="Nome" defaultValue="Elior Eyewear"/>
          <Inp label="Domínio" defaultValue="www.elior.com.br"/>
          <Inp label="CNPJ" defaultValue="00.000.000/0001-00"/>
          <Inp label="CEP de origem" defaultValue="01001-000"/>
          <Btn primary>Salvar</Btn>
        </Card>
      </div>
    </div>
  );
}
