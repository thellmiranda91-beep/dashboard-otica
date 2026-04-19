# Guia de Deploy no Vercel - Elior Eyewear

## Status das Integrações

✅ **Todas as integrações foram testadas e validadas:**
- Mercado Pago (Pix, Cartão, Boleto)
- Z-API (WhatsApp)
- Resend (E-mail)
- Supabase (Banco de Dados)

## Passo a Passo para Deploy

### 1. Acessar Vercel
1. Vá para https://vercel.com
2. Faça login com sua conta GitHub
3. Clique em **"Add New..."** → **"Project"**

### 2. Importar Repositório
1. Procure por **`thellmiranda91-beep/dashboard-otica`**
2. Clique em **"Import"**

### 3. Configurar Variáveis de Ambiente

Na tela de configuração, vá para **"Environment Variables"** e adicione as seguintes variáveis:

#### Mercado Pago
```
MP_ACCESS_TOKEN = (copie de .env)
MP_PUBLIC_KEY = (copie de .env)
```

#### Z-API (WhatsApp)
```
ZAPI_INSTANCE_ID = (copie de .env)
ZAPI_TOKEN = (copie de .env)
ZAPI_CLIENT_TOKEN = (copie de .env)
```

#### Resend (E-mail)
```
RESEND_API_KEY = (copie de .env)
EMAIL_FROM = Elior <onboarding@resend.dev>
```

#### Supabase (Banco de Dados)
```
SUPABASE_URL = (copie de .env)
SUPABASE_SERVICE_ROLE_KEY = (copie de .env)
```

**Nota:** As credenciais estão no arquivo `.env` local. Copie-as para as variáveis de ambiente do Vercel.

### 4. Deploy
1. Clique em **"Deploy"**
2. Aguarde a conclusão (geralmente 2-3 minutos)
3. Você receberá um link público como: `https://seu-projeto.vercel.app`

## Após o Deploy

### Configurar Webhook do Mercado Pago
1. Acesse https://www.mercadopago.com.br/developers
2. Vá para **"Webhooks"**
3. Adicione a URL: `https://seu-projeto.vercel.app/api/webhooks/mercadopago`
4. Selecione os eventos: `payment.created`, `payment.updated`

### Testar a Loja
1. Acesse `https://seu-projeto.vercel.app`
2. Navegue pelo catálogo
3. Adicione um produto ao carrinho
4. Vá ao checkout
5. Teste um pagamento com Pix (QR Code será exibido)

### Acessar Painel Admin
1. Na loja, vá ao footer
2. Clique nos **três pontinhos (···)** no canto inferior direito
3. Faça login com as credenciais configuradas

## Troubleshooting

### Se receber erro de conexão com Supabase
- Verifique se `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` estão corretos
- Teste a conexão localmente: `npm run dev`

### Se WhatsApp não funcionar
- Verifique se `ZAPI_CLIENT_TOKEN` está correto
- Teste com: `node test_zapi.js`

### Se E-mail não funcionar
- Verifique se `RESEND_API_KEY` está correto
- Teste com: `node test_email_final.js`

### Se Mercado Pago não funcionar
- Verifique se `MP_ACCESS_TOKEN` está correto
- Teste com: `node test_mp.js`

## Monitoramento

Após o deploy, você pode:
1. Ver logs em tempo real no dashboard do Vercel
2. Monitorar performance e erros
3. Configurar alertas de falha

## Próximos Passos (Opcional)

- [ ] Configurar domínio customizado (ex: `loja.elior.com.br`)
- [ ] Configurar SSL/TLS (automático no Vercel)
- [ ] Configurar CDN para imagens
- [ ] Adicionar analytics
- [ ] Configurar backup automático do banco de dados

## Suporte

Se encontrar problemas:
1. Verifique os logs do Vercel
2. Teste as integrações localmente
3. Consulte a documentação oficial:
   - Vercel: https://vercel.com/docs
   - Mercado Pago: https://developers.mercadopago.com.br
   - Z-API: https://z-api.io/docs
   - Resend: https://resend.com/docs
   - Supabase: https://supabase.com/docs

## ⚠️ Segurança

**IMPORTANTE:** Nunca faça commit de credenciais no GitHub. As credenciais devem ser:
1. Armazenadas localmente em `.env` (não commitado)
2. Adicionadas como variáveis de ambiente no Vercel
3. Mantidas seguras em um local protegido
