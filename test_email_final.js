import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function testEmail() {
  console.log('--- Testando Envio de E-mail Real (Resend) ---');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'thellmiranda91@gmail.com',
        subject: 'Teste de Integração - Elior Eyewear',
        html: '<strong>Parabéns!</strong> A integração com o Resend está funcionando corretamente.'
      })
    });
    const data = await response.json();
    if (response.ok) {
      console.log('✅ E-mail enviado com sucesso para thellmiranda91@gmail.com!');
      console.log('ID do E-mail:', data.id);
    } else {
      console.log('❌ Erro Resend:', data);
    }
  } catch (e) {
    console.error('❌ Erro na requisição Resend:', e.message);
  }
}

testEmail();
