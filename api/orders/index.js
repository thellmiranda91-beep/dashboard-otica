// /api/orders/index.js
// GET  - List orders (admin)
// POST - Create new order (storefront)

import { supabase, cors, handleOptions } from '../_lib/supabase.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  cors(res);

  try {
    if (req.method === 'GET') {
      const { status, page = 1, limit = 20 } = req.query;
      let query = supabase
        .from('orders')
        .select('*, customer:customers(*), items:order_items(*)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (status) query = query.eq('status', status);
      const { data, count, error } = await query;

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ orders: data, total: count, page: +page, limit: +limit });
    }

    if (req.method === 'POST') {
      const { customer, items, addons, shipping, coupon_code } = req.body;

      // 1. Create or find customer
      let customerId;
      const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customer.email)
        .single();

      if (existing) {
        customerId = existing.id;
        await supabase.from('customers').update({
          name: customer.name,
          phone: customer.phone,
          cpf: customer.cpf,
          updated_at: new Date().toISOString()
        }).eq('id', customerId);
      } else {
        const { data: newCustomer } = await supabase
          .from('customers')
          .insert({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            cpf: customer.cpf
          })
          .select('id')
          .single();
        
        if (!newCustomer) throw new Error("Falha ao criar/encontrar cliente. Verifique se a tabela 'customers' existe.");
        customerId = newCustomer.id;
      }

      // 2. Save address
      if (customer.address) {
        await supabase.from('customer_addresses').upsert({
          customer_id: customerId,
          ...customer.address,
          is_default: true
        }, { onConflict: 'customer_id' });
      }

      // 3. Calculate totals
      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const addonsTotal = (addons || []).reduce((s, a) => s + a.price, 0);
      const shippingCost = shipping?.price || 0;

      // 4. Apply coupon
      let discount = 0;
      if (coupon_code) {
        const { data: coupon } = await supabase
          .from('coupons')
          .select('*')
          .eq('code', coupon_code)
          .eq('active', true)
          .single();

        if (coupon) {
          discount = coupon.type === 'percentage'
            ? (subtotal + addonsTotal) * coupon.value / 100
            : coupon.value;
          await supabase.from('coupons').update({ used: coupon.used + 1 }).eq('id', coupon.id);
        }
      }

      const total = subtotal + addonsTotal + shippingCost - discount;

      // 5. Create order
      const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '0.0.0.0';
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          subtotal,
          shipping_cost: shippingCost,
          discount,
          total,
          shipping_method: shipping?.service || 'PAC',
          coupon_code,
          ip_address: clientIp
        })
        .select('id, order_number')
        .single();

      if (orderError) return res.status(500).json({ error: "Erro ao registrar pedido (DB_ORDER_FAILED)", details: orderError.message });

      // 6. Create order items
      const orderItems = items.map(i => ({
        order_id: order.id,
        product_id: i.product_id,
        product_name: i.name,
        color: i.color,
        lens_type: i.lens_type,
        quantity: i.quantity,
        unit_price: i.price,
        total: i.price * i.quantity,
        config: i.config
      }));
      await supabase.from('order_items').insert(orderItems);

      // 7. Create addons
      if (addons?.length > 0) {
        await supabase.from('order_addons').insert(
          addons.map(a => ({ order_id: order.id, name: a.name, price: a.price, type: a.type }))
        );
      }

      return res.status(201).json({
        success: true,
        order_id: order.id,
        order_number: order.order_number,
        total
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[API Orders] Critical Error:', err);
    let techDetail = err.message || JSON.stringify(err);
    if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL === 'https://placeholder.supabase.co') {
      techDetail = "CONFIGURAÇÃO FALTANDO: As chaves SUPABASE_URL ou SUPABASE_SERVICE_KEY não foram configuradas no painel da Vercel (Production Variables).";
    }
    return res.status(500).json({ 
      error: 'Erro interno no processamento do pedido (CRASH_RECOVERY)', 
      details: techDetail
    });
  }
}
