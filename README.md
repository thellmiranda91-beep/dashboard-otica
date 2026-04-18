# Elior Eyewear — Sistema Completo

E-commerce full-stack com loja, admin, backend integrado, pagamentos, frete e mensageria.

## Estrutura do Projeto

```
elior-full/
├── src/                        # FRONTEND
│   ├── config/                 # Configurações
│   │   ├── theme.js           # Cores, fontes, formatters
│   │   ├── data.js            # Dados estáticos (fallback)
│   │   ├── api.js             # Client HTTP das APIs
│   │   └── supabase.js        # Cliente Supabase
│   ├── context/
│   │   ├── AuthContext.jsx    # Login/logout/usuários
│   │   └── CartContext.jsx    # Carrinho + frete
│   ├── components/
│   │   └── ui.jsx             # Btn, Card, Input, Badge, etc.
│   ├── store/                  # LOJA (frontend público)
│   │   ├── Layout.jsx         # Nav, PromoBar, Footer
│   │   ├── HomePage.jsx       # Hero, bestsellers, testemunhos
│   │   ├── CatalogPage.jsx    # Listagem com filtros
│   │   ├── ProductPage.jsx    # Detalhe do produto
│   │   ├── ProductCard.jsx    # Card de produto
│   │   ├── CartDrawer.jsx     # Carrinho lateral
│   │   ├── Checkout.jsx       # 3 passos + pagamento
│   │   └── Modals.jsx         # Popups, login admin
│   ├── admin/                  # PAINEL ADMIN (10 seções)
│   │   ├── Layout.jsx         # Sidebar
│   │   ├── DashboardPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── FunnelsPage.jsx
│   │   ├── MessagingPage.jsx
│   │   ├── FinancePage.jsx
│   │   ├── IntelPage.jsx
│   │   ├── BannersPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── UsersPage.jsx
│   │   └── SettingsPage.jsx
│   ├── App.jsx                 # Orquestrador principal
│   └── main.jsx                # Entry point React
│
├── api/                        # BACKEND (Vercel Serverless)
│   ├── _lib/supabase.js       # Cliente DB compartilhado
│   ├── auth/login.js          # Login com bcrypt + JWT
│   ├── orders/index.js        # CRUD de pedidos
│   ├── payments/create.js     # Mercado Pago (Pix/Cartão/Boleto)
│   ├── webhooks/mercadopago.js # Webhook de status de pagamento
│   ├── shipping/calculate.js  # Cálculo Correios
│   ├── messaging/whatsapp.js  # Envio WhatsApp Cloud API
│   ├── messaging/email.js     # Envio via Resend
│   └── cron/recover-carts.js  # Recuperação de carrinho (30min)
│
├── supabase/
│   └── schema.sql              # 15 tabelas PostgreSQL
│
├── index.html                  # Entry HTML com SEO
├── package.json
├── vite.config.js              # Build config
├── vercel.json                 # Deploy config + cron
└── .env.example                # Template de variáveis
```

## Setup (30-45 minutos)

### 1. Supabase (banco de dados)
```
1. Crie conta em https://supabase.com
2. Novo projeto
3. SQL Editor → cole o conteúdo de supabase/schema.sql → Run
4. Settings > API → copie URL, anon key, service_role key
```

### 2. Mercado Pago (pagamentos)
```
1. https://www.mercadopago.com.br/developers
2. Criar aplicação > copiar Access Token e Public Key
3. Webhooks: https://seu-dominio.vercel.app/api/webhooks/mercadopago
4. Cadastrar chave Pix na conta
```

### 3. Correios (frete) — escolha uma
**CepCerto (recomendado):**
```
1. https://cepcerto.com → criar conta
2. Copiar API key
```
**Correios oficial:**
```
1. https://www.correios.com.br/atendimento/developers
2. Obter token + cartão de postagem
```

### 4. WhatsApp Business API
```
1. https://developers.facebook.com
2. Criar app Business
3. Ativar WhatsApp > copiar Token + Phone Number ID
```

### 5. Email (Resend)
```
1. https://resend.com → conta
2. Verificar domínio (contato@elior.com.br)
3. Copiar API Key
```

### 6. Configurar .env
```bash
cp .env.example .env
# Preencher todas as variáveis
```

### 7. Deploy
```bash
npm install
npx vercel --prod
# Adicionar variáveis de ambiente no dashboard Vercel
```

## Fluxo Completo de Compra

```
Cliente → Catálogo → Produto → Carrinho → Checkout
                                            ↓
        Backend: POST /api/orders (cria pedido no banco)
                                            ↓
        Backend: POST /api/payments/create (chama Mercado Pago)
                                            ↓
        Frontend mostra QR Code Pix ou processa cartão
                                            ↓
        Cliente paga
                                            ↓
        Mercado Pago → POST /api/webhooks/mercadopago
                                            ↓
        Backend atualiza status + dispara WhatsApp + Email
                                            ↓
        Cliente recebe confirmação
```

## Fluxo de Carrinho Abandonado

```
Cliente abandona carrinho → salvo em abandoned_carts
                                ↓
        Cron /api/cron/recover-carts (cada 30min)
                                ↓
        30min → WhatsApp: "Seus óculos estão esperando"
                                ↓
        4h → WhatsApp: "Use VOLTE10 = 10% OFF"
                                ↓
        24h → WhatsApp: "Última chance!"
                                ↓
        Cliente volta e compra → marca como "recovered"
```

## Acesso Admin

O login está escondido no footer da loja.
Clique nos **três pontinhos** (···) no canto inferior direito.

**Credenciais:** `teomiranda` / `123456`

## Editando o sistema

Cada seção do admin está em um arquivo próprio:
- Quer mudar o dashboard? `src/admin/DashboardPage.jsx`
- Ajustar funis? `src/admin/FunnelsPage.jsx`
- Nova seção? Criar arquivo em `src/admin/`, importar em `App.jsx`

Loja funciona do mesmo jeito:
- Hero na home? `src/store/HomePage.jsx`
- Carrinho? `src/store/CartDrawer.jsx`
- Checkout? `src/store/Checkout.jsx`

Tokens de cor/fonte centralizados em `src/config/theme.js`.
Dados iniciais (produtos, funis, templates) em `src/config/data.js`.

## APIs disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login admin |
| GET/POST | `/api/orders` | Listar/criar pedidos |
| POST | `/api/payments/create` | Criar pagamento (Pix/Cartão/Boleto) |
| POST | `/api/webhooks/mercadopago` | Webhook de status |
| POST | `/api/shipping/calculate` | Calcular frete |
| POST | `/api/messaging/whatsapp` | Enviar WhatsApp |
| POST | `/api/messaging/email` | Enviar Email |
| GET | `/api/cron/recover-carts` | Cron recuperação (auto) |
