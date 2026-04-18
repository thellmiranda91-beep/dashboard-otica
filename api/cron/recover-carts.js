// GET /api/cron/recover-carts
// Vercel Cron Job - runs every 30 minutes
// Sends recovery messages for abandoned carts

import { supabase } from '../_lib/supabase.js';

export const config = {
  // Vercel Cron schedule: every 30 minutes
  cron: '*/30 * * * *'
};

export default async function handler(req, res) {
  // Verify cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const now = new Date();
    let recovered = 0;

    // Step 1: Find carts abandoned 30+ minutes ago (first contact)
    const thirtyMinAgo = new Date(now - 30 * 60 * 1000).toISOString();
    const { data: newAbandoned } = await supabase
      .from('abandoned_carts')
      .select('*')
      .eq('recovery_status', 'pending')
      .eq('recovery_attempts', 0)
      .lt('created_at', thirtyMinAgo);

    for (const cart of (newAbandoned || [])) {
      // Send WhatsApp reminder
      if (cart.phone) {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/messaging/whatsapp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: cart.phone,
            template: 'cart_reminder',
            variables: {
              nome: cart.cart_data?.customer_name || 'Cliente',
              produto: cart.cart_data?.items?.[0]?.name || 'seus óculos',
              link: `${process.env.NEXT_PUBLIC_APP_URL}/carrinho?recovery=${cart.id}`
            }
          })
        });
      }

      // Send email reminder
      if (cart.email) {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/messaging/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: cart.email,
            subject: 'Seus óculos estão esperando!',
            template: 'cart_reminder',
            variables: {
              nome: cart.cart_data?.customer_name || 'Cliente',
              produto: cart.cart_data?.items?.[0]?.name || 'seus óculos'
            }
          })
        });
      }

      await supabase.from('abandoned_carts').update({
        recovery_status: 'contacted',
        recovery_attempts: 1,
        last_contact_at: now.toISOString()
      }).eq('id', cart.id);

      recovered++;
    }

    // Step 2: Send coupon to carts abandoned 4+ hours ago (second contact)
    const fourHoursAgo = new Date(now - 4 * 60 * 60 * 1000).toISOString();
    const { data: secondWave } = await supabase
      .from('abandoned_carts')
      .select('*')
      .eq('recovery_status', 'contacted')
      .eq('recovery_attempts', 1)
      .lt('last_contact_at', fourHoursAgo);

    for (const cart of (secondWave || [])) {
      if (cart.phone) {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/messaging/whatsapp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: cart.phone,
            message: `Ainda pensando? 🤔 Use o cupom VOLTE10 e ganhe 10% OFF! Válido por 24h ⏰\n\n${process.env.NEXT_PUBLIC_APP_URL}/carrinho?recovery=${cart.id}&coupon=VOLTE10`
          })
        });
      }

      await supabase.from('abandoned_carts').update({
        recovery_attempts: 2,
        last_contact_at: now.toISOString()
      }).eq('id', cart.id);

      recovered++;
    }

    // Step 3: Urgency message 24h later (third contact)
    const dayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    const { data: thirdWave } = await supabase
      .from('abandoned_carts')
      .select('*')
      .eq('recovery_status', 'contacted')
      .eq('recovery_attempts', 2)
      .lt('last_contact_at', dayAgo);

    for (const cart of (thirdWave || [])) {
      if (cart.phone) {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/messaging/whatsapp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: cart.phone,
            message: `Última chance! 🔥 Poucas unidades restantes. Seu cupom VOLTE10 expira em breve!\n\n${process.env.NEXT_PUBLIC_APP_URL}/carrinho?recovery=${cart.id}&coupon=VOLTE10`
          })
        });
      }

      await supabase.from('abandoned_carts').update({
        recovery_attempts: 3,
        last_contact_at: now.toISOString()
      }).eq('id', cart.id);

      recovered++;
    }

    // Expire old carts (7+ days)
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
    await supabase
      .from('abandoned_carts')
      .update({ recovery_status: 'expired' })
      .eq('recovery_status', 'contacted')
      .gte('recovery_attempts', 3)
      .lt('created_at', weekAgo);

    return res.status(200).json({
      success: true,
      processed: recovered,
      timestamp: now.toISOString()
    });

  } catch (error) {
    console.error('Cart recovery error:', error);
    return res.status(500).json({ error: 'Recovery cron failed' });
  }
}
