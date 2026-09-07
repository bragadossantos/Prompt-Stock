# PromptStock

> **Discover, Use and Sell Better Prompts.**  
> The Marketplace for Better Prompts.

---

## 🚀 Visão Geral

O **PromptStock** é uma plataforma e marketplace web moderna, escalável e segura concebida para a descoberta, organização, utilização, compra e venda de prompts para Inteligência Artificial (ChatGPT, Midjourney, Claude, Flux, DALL-E, etc.).

---

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 15 (App Router), TypeScript, React 19, Tailwind CSS.
- **Backend:** Laravel 11 / 12 (Modular Monolith, REST API v1, Laravel Sanctum).
- **Base de Dados:** PostgreSQL 16 (Normalizada, UUIDs, Índices e Soft Deletes).
- **Cache & Filas:** Redis.
- **Pagamentos:** Arquitetura para Gateway Multicaixa Express / Referência e Webhooks seguros.

---

## 📂 Estrutura do Repositório

```text
PromptStock/
├── frontend/             # Next.js 15 App Router + Tailwind CSS
│   ├── src/app/          # Páginas, layouts e rotas
│   ├── src/components/   # Componentes modulares reutilizáveis
│   ├── src/context/      # Gestão de estado de autenticação (AuthProvider)
│   ├── src/lib/          # Cliente HTTP da API PromptStock
│   └── src/types/        # Definições TypeScript
│
├── backend/              # Laravel 11/12 Modular Monolith REST API
│   ├── app/Http/         # Controllers V1, Form Requests e Resources
│   ├── app/Models/       # User, Category, SubCategory, Tag, Setting
│   ├── database/         # Migrations e Seeders
│   └── routes/api.php    # Rotas da API V1 (/api/v1/)
│
├── docker-compose.yml    # PostgreSQL 16 e Redis para desenvolvimento
└── README.md
```

---

## ⚙️ Como Executar Localmente

### 1. Backend (Laravel API)
```bash
cd backend
php -S 127.0.0.1:8000 -t public
# ou
php artisan serve
```

### 2. Frontend (Next.js)
```bash
cd frontend
npm run dev
```

Aceda à aplicação em: `http://localhost:3000`  
API REST disponível em: `http://127.0.0.1:8000/api/v1`

---

## 🔑 Acesso Padrão de Demonstração

- **Administrador:** `admin@promptstock.com`
- **Senha:** `PromptStock@2026!`
