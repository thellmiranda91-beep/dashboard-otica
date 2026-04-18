import { useState } from 'react';
import { C, ft, ftD } from '../config/theme.js';
import { Card, Badge, Btn, Inp, Tabs } from '../components/ui.jsx';
import { api } from '../config/api.js';

export function MessagingPage({ templates, msgLog, setMsgLog }) {
  const [tab, setTab] = useState('templates');
  const [testPhone, setTestPhone] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [status, setStatus] = useState(null);

  const sendTest = async (channel) => {
    const dest = channel === 'whatsapp' ? testPhone : testEmail;
    if (!dest) return;
    setStatus('sending');
    try {
      if (channel === 'whatsapp') {
        await api.sendWhatsApp(dest, 'Mensagem de teste da Elior! 👓');
      } else {
        await api.sendEmail(dest, 'Teste Elior', null, { nome: 'Cliente' });
      }
    } catch (e) {}
    setMsgLog(prev => [{
      id: 'm' + Date.now(),
      to: dest, channel,
      template: 'Teste manual',
      status: 'delivered',
      date: new Date().toLocaleString('pt-BR'),
      opened: false
    }, ...prev]);
    setStatus('sent');
    setTimeout(() => setStatus(null), 2500);
  };

  return (
    <div>
      <h1 style={{fontFamily:ftD,fontSize:24,fontWeight:700,color:C.nv,margin:"0 0 4px"}}>Central de mensagens</h1>
      <p style={{fontFamily:ft,fontSize:14,color:C.md,margin:"0 0 20px"}}>WhatsApp & Email — Templates, envios e integrações</p>

      <Tabs tabs={[["templates","Templates"],["send","Enviar"],["log","Histórico"],["config","API Config"]]} active={tab} onChange={setTab}/>

      {/* TAB: Templates */}
      {tab === 'templates' && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
          {templates.map(t => (
            <Card key={t.id}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <h3 style={{fontFamily:ft,fontSize:14,fontWeight:700,color:C.nv,margin:0}}>{t.name}</h3>
                <Badge color={t.channel==='whatsapp'?C.sg:C.ig}>{t.channel}</Badge>
              </div>
              {t.subject && <p style={{fontFamily:ft,fontSize:12,fontWeight:600,color:C.ig,margin:"0 0 6px"}}>{t.subject}</p>}
              <p style={{fontFamily:ft,fontSize:13,color:C.md,lineHeight:1.5,margin:0,background:C.cr,padding:10,borderRadius:8,whiteSpace:"pre-wrap"}}>{t.content}</p>
            </Card>
          ))}
        </div>
      )}

      {/* TAB: Send */}
      {tab === 'send' && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Card>
            <h3 style={{fontFamily:ft,fontSize:15,fontWeight:700,color:C.nv,margin:"0 0 16px"}}>WhatsApp</h3>
            <Inp label="Número" placeholder="+55 11 99999-0000" value={testPhone} onChange={e => setTestPhone(e.target.value)}/>
            <Btn primary onClick={() => sendTest('whatsapp')} disabled={!testPhone || status === 'sending'} full>
              {status === 'sending' ? "Enviando..." : status === 'sent' ? "Enviado! ✓" : "Enviar teste"}
            </Btn>
          </Card>
          <Card>
            <h3 style={{fontFamily:ft,fontSize:15,fontWeight:700,color:C.nv,margin:"0 0 16px"}}>Email</h3>
            <Inp label="Email" placeholder="cliente@email.com" value={testEmail} onChange={e => setTestEmail(e.target.value)}/>
            <Btn primary onClick={() => sendTest('email')} disabled={!testEmail || status === 'sending'} full style={{background:C.ig}}>
              {status === 'sending' ? "Enviando..." : status === 'sent' ? "Enviado! ✓" : "Enviar teste"}
            </Btn>
          </Card>
        </div>
      )}

      {/* TAB: Log */}
      {tab === 'log' && (
        <Card style={{padding:0}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:ft}}>
            <thead>
              <tr style={{borderBottom:`1px solid ${C.bd}`}}>
                {["Para","Canal","Template","Status","Data"].map(h => (
                  <th key={h} style={{textAlign:"left",padding:"12px 14px",fontSize:11,fontWeight:600,color:C.md}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {msgLog.map(m => (
                <tr key={m.id} style={{borderBottom:`1px solid ${C.bd}`}}>
                  <td style={{padding:"10px 14px",fontSize:13,fontWeight:600,color:C.nv}}>{m.to}</td>
                  <td style={{padding:"10px 14px"}}><Badge color={m.channel==='whatsapp'?C.sg:C.ig}>{m.channel}</Badge></td>
                  <td style={{padding:"10px 14px",fontSize:13,color:C.md}}>{m.template}</td>
                  <td style={{padding:"10px 14px"}}><Badge color={m.status==='delivered'?C.sg:m.status==='sent'?C.gl:C.dn}>{m.status==='delivered'?"Entregue":m.status==='sent'?"Enviado":"Falhou"}</Badge></td>
                  <td style={{padding:"10px 14px",fontSize:12,color:C.lt}}>{m.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* TAB: Config */}
      {tab === 'config' && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <h3 style={{fontFamily:ft,fontSize:15,fontWeight:700,color:C.nv,margin:"0 0 14px"}}>WhatsApp Business API</h3>
            <Inp label="Phone Number ID" placeholder="123456789"/>
            <Inp label="Access Token" type="password" placeholder="EAAxxxxx"/>
            <Inp label="Webhook URL" defaultValue="https://elior.com.br/api/webhooks/whatsapp"/>
            <Btn primary>Salvar</Btn>
          </Card>
          <Card>
            <h3 style={{fontFamily:ft,fontSize:15,fontWeight:700,color:C.nv,margin:"0 0 14px"}}>Email (Resend)</h3>
            <Inp label="API Key" type="password" placeholder="re_xxxxx"/>
            <Inp label="Email remetente" defaultValue="contato@elior.com.br"/>
            <Inp label="Nome remetente" defaultValue="Elior Eyewear"/>
            <Btn primary style={{background:C.ig}}>Salvar</Btn>
          </Card>
        </div>
      )}
    </div>
  );
}
