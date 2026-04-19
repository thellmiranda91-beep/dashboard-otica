import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function testZAPI() {
  console.log('--- Testando Integração Z-API com Client-Token ---');
  
  const instanceId = process.env.ZAPI_INSTANCE_ID;
  const token = process.env.ZAPI_TOKEN;
  const clientToken = process.env.ZAPI_CLIENT_TOKEN;
  const targetPhone = '5511999999999'; 

  try {
    const response = await fetch(
      `https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Client-Token': clientToken
        },
        body: JSON.stringify({
          phone: targetPhone,
          message: 'Teste de integração Elior Eyewear via Z-API com Client-Token'
        })
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Z-API configurada e autenticada com sucesso!');
      console.log('ID da Mensagem:', data.messageId);
    } else {
      console.error('❌ Erro na Z-API:', data);
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

testZAPI();
