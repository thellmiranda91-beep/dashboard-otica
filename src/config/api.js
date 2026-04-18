const BASE = import.meta.env.VITE_API_URL || '';

async function call(endpoint, options = {}) {
  const token = localStorage.getItem('elior_token');
  const res = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

// ═══ AUTH ═══
export const api = {
  login: (username, password) =>
    call('/api/auth/login', { method: 'POST', body: { username, password } }),

  // ═══ PRODUCTS ═══
  getProducts: () => call('/api/products'),
  createProduct: (product) => call('/api/products', { method: 'POST', body: product }),
  updateProduct: (id, data) => call(`/api/products/${id}`, { method: 'PUT', body: data }),
  deleteProduct: (id) => call(`/api/products/${id}`, { method: 'DELETE' }),

  // ═══ ORDERS ═══
  getOrders: (params) => call(`/api/orders?${new URLSearchParams(params)}`),
  createOrder: (order) => call('/api/orders', { method: 'POST', body: order }),
  updateOrder: (id, data) => call(`/api/orders/${id}`, { method: 'PUT', body: data }),

  // ═══ PAYMENTS ═══
  createPayment: (payment) =>
    call('/api/payments/create', { method: 'POST', body: payment }),

  // ═══ SHIPPING ═══
  calculateShipping: (cep, itemsCount = 1) =>
    call('/api/shipping/calculate', { method: 'POST', body: { cep_destination: cep, items_count: itemsCount } }),

  // ═══ MESSAGING ═══
  sendWhatsApp: (to, message, template, variables) =>
    call('/api/messaging/whatsapp', { method: 'POST', body: { to, message, template, variables } }),
  sendEmail: (to, subject, template, variables) =>
    call('/api/messaging/email', { method: 'POST', body: { to, subject, template, variables } }),

  // ═══ AI ═══
  generateDescription: async (name, cat) => {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 500,
          messages: [{ role: 'user', content: `Copywriter e-commerce óculos. Descrição persuasiva (2 frases, PT-BR) para: ${name} (${cat}). APENAS a descrição.` }]
        })
      });
      const d = await r.json();
      return d.content?.map(b => b.text || '').join('') || 'Descrição gerada.';
    } catch {
      return 'Armação premium com design sofisticado e acabamento impecável. Tecnologia que une proteção máxima ao conforto absoluto.';
    }
  },

  generateBanner: async (prompt) => {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 500,
          messages: [{ role: 'user', content: `Diretor de arte e-commerce óculos. Briefing: ${prompt || 'Banner hero Elior'}. APENAS JSON: {"headline":"...","subheadline":"...","cta":"...","colors":"...","layout":"...","mood":"..."}` }]
        })
      });
      const d = await r.json();
      return JSON.parse(d.content?.map(b => b.text || '').join('').replace(/```json|```/g, '').trim());
    } catch {
      return { headline: 'Visão que inspira', subheadline: 'Óculos premium', cta: 'Explorar', colors: 'Navy+coral', layout: 'Split', mood: 'Sofisticado' };
    }
  },
};
