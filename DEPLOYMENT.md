# 🚀 Guia de Implantação e Hospedagem — PromptStock

Este documento descreve o processo completo e otimizado para hospedar o **PromptStock** em produção.

---

## 🏛️ Arquitetura de Produção

O PromptStock é estruturado em arquitetura desacoplada:

```text
  [ Utilizadores / Navegadores ]
                │
                ▼
   ┌───────────────────────────┐
   │    Vercel (Edge / CDN)    │  <--- Frontend (Next.js 15 App Router)
   │  promptstock.vercel.app   │
   └─────────────┬─────────────┘
                 │ Chamadas REST API (JSON / Bearer Token)
                 ▼
   ┌───────────────────────────┐
   │    Hospedagem de API      │  <--- Backend (Laravel 12 Modular Monolith)
   │ (Render / Railway / VPS)  │
   └─────────────┬─────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
  [ PostgreSQL 16 ]    [ Redis ]
```

- **Frontend (Next.js 15):** Hospedado na **Vercel** para máxima velocidade, SSR/SSG na Edge global e deployments automáticos por Git.
- **Backend (Laravel 12 API):** Hospedado num ambiente com suporte a PHP 8.2+ e Workers (ex.: Render, Railway, Fly.io, DigitalOcean ou VPS).

---

## 🌐 1. Hospedagem do Frontend na Vercel

### Passo a Passo

1. **Aceda à Vercel:**
   - Faça login em [vercel.com](https://vercel.com) e clique em **"Add New..." > "Project"**.

2. **Importar o Repositório:**
   - Selecione o repositório GitHub do projeto (`Prompt-Stock`).

3. **Configurar o "Root Directory" (Fundamental):**
   - No campo **Root Directory**, clique em **Edit** e selecione a pasta:
     ```text
     frontend
     ```
   - A Vercel detectará imediatamente o framework como **Next.js**.

4. **Configurar Variáveis de Ambiente (Environment Variables):**
   - Adicione a variável apontando para a sua API em produção:
     - **Key:** `NEXT_PUBLIC_API_URL`
     - **Value:** `https://sua-api.com/api/v1` (ou a URL do seu backend no Render/Railway)

5. **Fazer o Deploy:**
   - Clique em **"Deploy"**.
   - Em menos de 2 minutos a aplicação estará no ar com certificado SSL automático e CDN mundial.

---

## 🛡️ 2. Arquivos de Configuração Já Preparados

### A. `frontend/vercel.json`
Já configurado com as melhores práticas de segurança e headers HTTP:
- `X-Frame-Options: DENY` (Proteção contra clickjacking)
- `X-Content-Type-Options: nosniff` (Proteção contra MIME sniffing)
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### B. `frontend/next.config.ts`
- Otimização de compilação em produção.
- `reactStrictMode: true`.
- Remoção do cabeçalho `x-powered-by`.
- Suporte a imagens remotas e avatares.

### C. `backend/config/cors.php`
- Suporte nativo a domínios da Vercel:
  - Qualquer URL gerada para testes ou previews (`*.vercel.app`) é autorizada automaticamente.
  - Suporte à variável `CORS_ALLOWED_ORIGINS` para definir domínios customizados em produção.

---

## 🔌 3. Configuração do Backend (Laravel 12)

Para colocar a API online (no Render, Railway ou VPS):

1. **Defina as Variáveis de Ambiente essenciais no backend (`.env`):**
   ```env
   APP_NAME="PromptStock API"
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://api.seudominio.com

   # URL do seu frontend na Vercel para CORS
   CORS_ALLOWED_ORIGINS=https://promptstock.vercel.app,https://seudominio.com

   # Base de dados (PostgreSQL recomendado para produção)
   DB_CONNECTION=pgsql
   DB_HOST=seu-db-host.com
   DB_PORT=5432
   DB_DATABASE=promptstock
   DB_USERNAME=seu_usuario
   DB_PASSWORD=sua_senha

   # Sessão e Cache
   SESSION_DRIVER=database
   CACHE_STORE=database
   QUEUE_CONNECTION=database
   ```

2. **Comandos de Inicialização em Produção:**
   ```bash
   php artisan migrate --force
   php artisan db:seed --force # opcional para dados iniciais
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

---

## ✅ 4. Checklist de Verificação

- [x] Build do Next.js 15 testado e validado (`npm run build` gerando 19 rotas com sucesso).
- [x] Suíte de 35 testes automatizados do Laravel aprovada (157 asserções).
- [x] CORS configurado para aceitar requisições de domínios `*.vercel.app`.
- [x] `.env.example` do frontend documentado.
- [x] Headers de segurança do `vercel.json` ativos.
