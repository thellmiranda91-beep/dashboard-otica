// POST /api/webhooks/mercadopago
// Receives payment status updates from Mercado Pago

import { supabase, cors } from '../_lib/supabase.js';

export default async function handler(req, res) {
  cors(res);

  if (req.method === 'GET') {
    // Webhook verification
    return res.status(200).json({ status: 'ok' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data, action } = req.body;

    if (type === 'payment' && data?.id) {
      // Fetch payment details from MP
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
        headers: { 'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}` }
      });
      const payment = await mpRes.json();

      // Find order by payment_id
      const { data: orders } = await supabase
        .from('orders')
        .select('id, customer_id, total')
        .eq('payment_id', data.id.toString())
        .limit(1);

      if (orders?.length > 0) {
        const order = orders[0];
        const newStatus = mapMPStatus(payment.status);

        await supabase
          .from('orders')
          .update({
            payment_status: payment.status,
            status: newStatus,
            payment_data: {
              mp_id: payment.id,
              status: payment.status,
              status_detail: payment.status_detail,
              date_approved: payment.date_approved
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id);

        // If approved, send confirmation via WhatsApp
        if (payment.status === 'approved') {
          await sendOrderConfirmation(order.id, order.customer_id);
        }
      }
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(200).json({ received: true }); // Always 200 for webhooks
  }
}

function mapMPStatus(mpStatus) {
  const map = {
    'approved': 'confirmed',
    'pending': 'pending',
    'in_process': 'pending',
    'rejected': 'cancelled',
    'cancelled': 'cancelled',
    'refunded': 'refunded',
    'charged_back': 'refunded'
  };
  return map[mpStatus] || 'pending';
}

async function sendOrderConfirmation(orderId, customerId) {
  try {
    const { data: customer } = await supabase
      .from('customers')
      .select('name, phone, email')
      .eq('id', customerId)
      .single();

    if (customer?.phone) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/messaging/whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customer.phone,
          template: 'order_confirmation',
          variables: {
            nome: customer.name,
            pedido: orderId.toString().slice(-5),
            link: `${process.env.NEXT_PUBLIC_APP_URL}/pedido/${orderId}`
          }
        })
      });
    }

    if (customer?.email) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/messaging/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customer.email,
          subject: `Pedido #${orderId.toString().slice(-5)} confirmado!`,
          template: 'order_confirmation',
          variables: { nome: customer.name, pedido: orderId.toString().slice(-5) }
        })
      });
    }
  } catch (e) {
    console.error('Notification error:', e);
  }
}
