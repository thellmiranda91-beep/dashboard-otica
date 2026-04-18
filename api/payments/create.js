// POST /api/payments/create
// Creates a payment via Mercado Pago (Pix, Credit Card, or Boleto)

import { supabase, cors, handleOptions } from '../_lib/supabase.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  cors(res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      order_id,
      payment_method, // 'pix' | 'credit_card' | 'boleto'
      amount,
      payer,
      card_token,      // only for credit_card
      installments,    // only for credit_card
      description
    } = req.body;

    // Build Mercado Pago payment body
    const mpBody = {
      transaction_amount: parseFloat(amount),
      description: description || `Pedido Elior #${order_id}`,
      payment_method_id: payment_method === 'credit_card' ? undefined : payment_method,
      payer: {
        email: payer.email,
        first_name: payer.name?.split(' ')[0],
        last_name: payer.name?.split(' ').slice(1).join(' '),
        identification: {
          type: 'CPF',
          number: payer.cpf?.replace(/\D/g, '')
        }
      }
    };

    // Credit card specific
    if (payment_method === 'credit_card') {
      mpBody.token = card_token;
      mpBody.installments = installments || 1;
    }

    // Pix discount (5%)
    if (payment_method === 'pix') {
      mpBody.transaction_amount = parseFloat((amount * 0.95).toFixed(2));
    }

    // Call Mercado Pago API
    console.log(`[MP Debug] Criando pagamento tipo: ${payment_method} para o pedido: ${order_id}`);
    
    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'X-Idempotency-Key': `elior-${order_id}-${Date.now()}`
      },
      body: JSON.stringify(mpBody)
    });

    const mpData = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('[MP Error Details]', JSON.stringify(mpData, null, 2));
      return res.status(400).json({
        error: 'Payment failed at gateway',
        details: mpData
      });
    }

    // Update order in database
    const updateData = {
      payment_id: mpData.id?.toString(),
      payment_status: mpData.status,
      payment_method: payment_method,
      payment_data: {
        mp_id: mpData.id,
        status: mpData.status,
        status_detail: mpData.status_detail,
      },
      updated_at: new Date().toISOString()
    };

    // Add Pix data if applicable
    if (payment_method === 'pix' && mpData.point_of_interaction) {
      updateData.payment_data.pix = {
        qr_code: mpData.point_of_interaction.transaction_data?.qr_code,
        qr_code_base64: mpData.point_of_interaction.transaction_data?.qr_code_base64,
        ticket_url: mpData.point_of_interaction.transaction_data?.ticket_url
      };
    }

    // Add boleto data if applicable
    if (payment_method === 'boleto' && mpData.transaction_details) {
      updateData.payment_data.boleto = {
        barcode: mpData.barcode?.content,
        external_url: mpData.transaction_details?.external_resource_url
      };
    }

    await supabase
      .from('orders')
      .update(updateData)
      .eq('id', order_id);

    // If approved, update stock
    if (mpData.status === 'approved') {
      await updateStock(order_id);
      await supabase
        .from('orders')
        .update({ status: 'confirmed' })
        .eq('id', order_id);
    }

    return res.status(200).json({
      success: true,
      payment_id: mpData.id,
      status: mpData.status,
      pix_qr: updateData.payment_data.pix || null,
      boleto_url: updateData.payment_data.boleto?.external_url || null
    });

  } catch (error) {
    console.error('[API Payments] Critical Error:', error);
    return res.status(500).json({ error: 'Erro interno no processamento do pagamento', details: error.message });
  }
}
}

async function updateStock(orderId) {
  const { data: items } = await supabase
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', orderId);

  if (items) {
    for (const item of items) {
      await supabase.rpc('decrement_stock', {
        p_id: item.product_id,
        qty: item.quantity
      });
    }
  }
}
