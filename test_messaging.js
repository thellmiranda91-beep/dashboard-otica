import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function testWhatsApp() {
  console.log('\n--- Testando WhatsApp Cloud API ---');
  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${process.env.WA_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WA_TOKEN}`
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: '5511999999999', // Número fictício para teste de credenciais
          type: 'text',
          text: { body: 'Teste de integração' }
        })
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log('❌ Erro WhatsApp (esperado se o número for inválido, mas checa o token):', data.error.message);
    } else {
      console.log('✅ WhatsApp Token parece válido!');
    }
  } catch (e) {
    console.error('❌ Erro na requisição WhatsApp:', e.message);
  }
}

async function testEmail() {
  console.log('\n--- Testando Resend (E-mail) ---');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'test@example.com',
        subject: 'Teste de Integração',
        html: '<p>Teste</p>'
      })
    });
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Resend API Key válida!');
    } else {
      console.log('❌ Erro Resend:', data.message || data);
    }
  } catch (e) {
    console.error('❌ Erro na requisição Resend:', e.message);
  }
}

async function run() {
  await testWhatsApp();
  await testEmail();
}

run();
