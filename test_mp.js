import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function testMP() {
  console.log('--- Testando Mercado Pago ---');
  console.log('Token:', process.env.MP_ACCESS_TOKEN ? 'Configurado' : 'Faltando');
  
  try {
    const response = await fetch('https://api.mercadopago.com/v1/payment_methods', {
      headers: {
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Conexão com Mercado Pago estabelecida com sucesso!');
      console.log('Métodos de pagamento disponíveis:', data.length);
    } else {
      console.error('❌ Erro ao conectar com Mercado Pago:', data);
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

testMP();
