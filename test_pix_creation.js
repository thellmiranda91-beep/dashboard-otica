import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function createPixPayment() {
  console.log('--- Simulando Criação de Pagamento Pix ---');
  
  const payload = {
    transaction_amount: 100.00,
    description: 'Teste de Integração Elior Eyewear',
    payment_method_id: 'pix',
    payer: {
      email: 'test_user_123@testuser.com',
      first_name: 'Test',
      last_name: 'User',
      identification: {
        type: 'CPF',
        number: '19119119100'
      }
    }
  };

  try {
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'X-Idempotency-Key': `test-${Date.now()}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Pagamento Pix criado com sucesso!');
      console.log('ID do Pagamento:', data.id);
      console.log('Status:', data.status);
      console.log('QR Code (Copia e Cola):', data.point_of_interaction.transaction_data.qr_code);
    } else {
      console.error('❌ Erro ao criar Pix:', data);
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

createPixPayment();
