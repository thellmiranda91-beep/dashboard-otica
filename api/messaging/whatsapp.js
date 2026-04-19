// POST /api/messaging/whatsapp
// Sends WhatsApp messages via Z-API

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

    // Z-API expects 55 + DDD + Number
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

    // Send via Z-API
    const zapiResponse = await fetch(
      `https://api.z-api.io/instances/${process.env.ZAPI_INSTANCE_ID}/token/${process.env.ZAPI_TOKEN}/send-text`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Client-Token': process.env.ZAPI_CLIENT_TOKEN
        },
        body: JSON.stringify({
          phone: phone,
          message: content
        })
      }
    );

    const zapiData = await zapiResponse.json();

    // Log message in Supabase
    try {
      await supabase.from('message_log').insert({
        channel: 'whatsapp',
        recipient: to,
        content: content,
        status: zapiResponse.ok ? 'sent' : 'failed',
        external_id: zapiData.messageId,
        sent_at: new Date().toISOString(),
        metadata: { zapi_response: zapiData }
      });
    } catch (dbError) {
      console.error('Database logging error:', dbError);
    }

    if (!zapiResponse.ok) {
      return res.status(400).json({
        error: 'Falha ao enviar WhatsApp via Z-API',
        details: zapiData
      });
    }

    return res.status(200).json({
      success: true,
      message_id: zapiData.messageId,
      to: phone
    });

  } catch (error) {
    console.error('WhatsApp error:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
