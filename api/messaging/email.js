// POST /api/messaging/email
// Sends transactional emails via Resend

import { supabase, cors, handleOptions } from '../_lib/supabase.js';

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  cors(res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, template, variables, html, text } = req.body;

    if (!to) return res.status(400).json({ error: 'Email é obrigatório' });

    // Load template if specified
    let emailSubject = subject;
    let emailBody = html || text;

    if (template && !emailBody) {
      const { data: tpl } = await supabase
        .from('message_templates')
        .select('subject, content')
        .eq('name', template)
        .eq('channel', 'email')
        .single();

      if (tpl) {
        emailSubject = emailSubject || tpl.subject;
        emailBody = tpl.content;
      }
    }

    // Replace variables
    if (variables) {
      Object.entries(variables).forEach(([key, val]) => {
        emailSubject = emailSubject?.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val);
        emailBody = emailBody?.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val);
      });
    }

    // Wrap in HTML template
    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
      <body style="font-family:'Outfit',Helvetica,Arial,sans-serif;background:#FAF7F2;padding:40px 20px;">
        <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;">
          <div style="background:#0C1F2E;padding:24px 32px;text-align:center;">
            <span style="font-family:'Sora',sans-serif;font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.5px;">elior</span>
          </div>
          <div style="padding:32px;">
            <div style="font-size:15px;line-height:1.7;color:#5C5C5C;white-space:pre-wrap;">${emailBody}</div>
          </div>
          <div style="padding:16px 32px;background:#FAF7F2;text-align:center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="display:inline-block;padding:12px 32px;background:#E05C3A;color:#fff;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">Visitar a loja</a>
          </div>
          <div style="padding:16px 32px;text-align:center;font-size:11px;color:#9A9A9A;">
            Elior Eyewear · contato@elior.com.br · (11) 99999-0000
          </div>
        </div>
      </body>
      </html>
    `;

    // Send via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Elior <contato@elior.com.br>',
        to: [to],
        subject: emailSubject || 'Elior Eyewear',
        html: fullHtml
      })
    });

    const resendData = await resendResponse.json();

    // Log
    await supabase.from('message_log').insert({
      channel: 'email',
      recipient: to,
      subject: emailSubject,
      content: emailBody,
      status: resendResponse.ok ? 'sent' : 'failed',
      external_id: resendData.id,
      sent_at: new Date().toISOString(),
      metadata: { resend_response: resendData }
    });

    if (!resendResponse.ok) {
      return res.status(400).json({ error: 'Falha ao enviar email', details: resendData });
    }

    return res.status(200).json({ success: true, email_id: resendData.id });

  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
