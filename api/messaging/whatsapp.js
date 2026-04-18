// POST /api/messaging/whatsapp
// Sends WhatsApp messages via Meta Cloud API

import { supabase, cors, handleOptions } from '../_lib/supabase.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  cors(res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, message, template, variables } = req.body;

    if (!to) return res.status(400).json({ error: 'Número é obrigatório' });

    const phone = to.replace(/\D/g, '');

    // Build message content
    let content = message;
    if (template && !message) {
      // Load template from DB
      const { data: tpl } = await supabase
        .from('message_templates')
        .select('content')
        .eq('name', template)
        .eq('channel', 'whatsapp')
        .single();

      content = tpl?.content || message;
    }

    // Replace variables
    if (content && variables) {
      Object.entries(variables).forEach(([key, val]) => {
        content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val);
      });
    }

    // Send via WhatsApp Cloud API
    const waResponse = await fetch(
      `https://graph.facebook.com/v21.0/${process.env.WA_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WA_TOKEN}`
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone,
          type: 'text',
          text: { body: content }
        })
      }
    );

    const waData = await waResponse.json();

    // Log message
    await supabase.from('message_log').insert({
      channel: 'whatsapp',
      recipient: to,
      content: content,
      status: waResponse.ok ? 'sent' : 'failed',
      external_id: waData.messages?.[0]?.id,
      sent_at: new Date().toISOString(),
      metadata: { wa_response: waData }
    });

    if (!waResponse.ok) {
      return res.status(400).json({
        error: 'Falha ao enviar WhatsApp',
        details: waData.error
      });
    }

    return res.status(200).json({
      success: true,
      message_id: waData.messages?.[0]?.id,
      to: phone
    });

  } catch (error) {
    console.error('WhatsApp error:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
