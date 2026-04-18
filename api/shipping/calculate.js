// POST /api/shipping/calculate
// Calculates shipping cost and delivery time via Correios

import { cors, handleOptions } from '../_lib/supabase.js';

const CEP_ORIGIN = process.env.STORE_CEP_ORIGIN || '01001000';

// Default dimensions for eyewear box (cm)
const BOX = { weight: 300, height: 8, width: 18, length: 22 };

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  cors(res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cep_destination, items_count = 1 } = req.body;

    if (!cep_destination) {
      return res.status(400).json({ error: 'CEP de destino é obrigatório' });
    }

    const cepClean = cep_destination.replace(/\D/g, '');
    if (cepClean.length !== 8) {
      return res.status(400).json({ error: 'CEP inválido' });
    }

    const weight = BOX.weight * Math.min(items_count, 5);

    // Option 1: CepCerto API (simpler, recommended)
    if (process.env.CEPCERTO_KEY) {
      const url = `https://cepcerto.com/ws/json-frete/${CEP_ORIGIN}/${cepClean}/${weight}/${BOX.height}/${BOX.width}/${BOX.length}/${process.env.CEPCERTO_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      const options = [];

      if (data.valorpac && data.valorpac !== '0') {
        options.push({
          service: 'PAC',
          code: '04510',
          price: parseFloat(data.valorpac.replace(',', '.')),
          days: parseInt(data.prazopac) || 8,
          free: false
        });
      }

      if (data.valorsedex && data.valorsedex !== '0') {
        options.push({
          service: 'SEDEX',
          code: '04014',
          price: parseFloat(data.valorsedex.replace(',', '.')),
          days: parseInt(data.prazosedex) || 3,
          free: false
        });
      }

      // Free shipping for orders with 2 or more products (promo)
      options.forEach(opt => {
        if (items_count >= 2) { 
          opt.free = true;
          opt.original_price = opt.price;
          opt.price = 0;
        }
      });

      return res.status(200).json({
        success: true,
        origin: CEP_ORIGIN,
        destination: cepClean,
        options
      });
    }

    // Option 2: Correios official API
    if (process.env.CORREIOS_TOKEN) {
      const authRes = await fetch('https://api.correios.com.br/token/v1/autentica/cartaopostagem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${process.env.CORREIOS_TOKEN}`
        },
        body: JSON.stringify({ numero: process.env.CORREIOS_CARTAO_POSTAGEM })
      });
      const authData = await authRes.json();

      const services = ['04510', '04014']; // PAC, SEDEX
      const options = [];

      for (const svc of services) {
        const priceRes = await fetch(
          `https://api.correios.com.br/preco/v1/nacional/${svc}?cepOrigem=${CEP_ORIGIN}&cepDestino=${cepClean}&peso=${weight}&formato=1&comprimento=${BOX.length}&altura=${BOX.height}&largura=${BOX.width}&diametro=0`,
          { headers: { 'Authorization': `Bearer ${authData.token}` } }
        );
        const priceData = await priceRes.json();

        if (priceData.pcFinal) {
          options.push({
            service: svc === '04510' ? 'PAC' : 'SEDEX',
            code: svc,
            price: parseFloat(priceData.pcFinal),
            days: parseInt(priceData.prazoEntrega) || (svc === '04510' ? 8 : 3),
            free: true,
            original_price: parseFloat(priceData.pcFinal)
          });
        }
      }

      return res.status(200).json({
        success: true,
        origin: CEP_ORIGIN,
        destination: cepClean,
        options
      });
    }

    // Fallback: estimated values
    return res.status(200).json({
      success: true,
      origin: CEP_ORIGIN,
      destination: cepClean,
      options: [
        { service: 'PAC', code: '04510', price: 0, days: 8, free: true, original_price: 18.90 },
        { service: 'SEDEX', code: '04014', price: 0, days: 3, free: true, original_price: 32.50 }
      ]
    });

  } catch (error) {
    console.error('Shipping error:', error);
    return res.status(500).json({ error: 'Erro ao calcular frete' });
  }
}
