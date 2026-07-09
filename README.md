# Catálogo Performance Tríade

Catálogo digital de dropshipping com checkout finalizado via WhatsApp, roteamento
dinâmico por vendedor e painel administrativo. Next.js (App Router) + TypeScript +
Tailwind CSS + PostgreSQL (Prisma).

Domínio de produção: `https://catalogo.performancetriade.com.br`

## Stack

- Next.js 14 (App Router), React, TypeScript
- Tailwind CSS
- PostgreSQL + Prisma ORM
- Autenticação de admin via cookie JWT (jose)
- Deploy via Docker (Dockerfile multi-stage) + docker-compose, pronto para EasyPanel

## Modelagem do banco de dados

Ver `prisma/schema.prisma`:

- **Categoria** — nome, slug
- **Produto** — nome, descrição, preço, imagem, categoria (opcional), ativo — sem
  campo de estoque (modelo dropshipping)
- **Vendedor** — nome, whatsapp, hash único (usado em `/c/[hash]`), ativo
- **Admin** — email + hash de senha (login do painel)

## Rodando localmente

```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run db:seed   # cria o admin inicial (ADMIN_EMAIL / ADMIN_PASSWORD do .env)
npm run dev
```

Acesse `http://localhost:3000/admin/login` com as credenciais definidas em `.env`
(`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Fluxo do cliente

1. Admin cadastra um vendedor em `/admin/vendedores` → um `hash` único é gerado.
2. O link `https://catalogo.performancetriade.com.br/c/[hash]` é compartilhado com
   o cliente daquele vendedor.
3. Ao acessar o link, o `hash` é validado no banco e salvo em cookie
   (`vendedor_hash`), persistindo o vendedor durante a navegação.
4. O cliente monta o carrinho (salvo em `localStorage`) e finaliza o pedido: o
   sistema monta a mensagem e redireciona para `wa.me/[whatsapp_do_vendedor]`.

## Deploy no EasyPanel

1. Configure as variáveis de ambiente do serviço (ver `.env.example`):
   `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `JWT_SECRET` e
   `NEXT_PUBLIC_BASE_URL=https://catalogo.performancetriade.com.br`.
2. Aponte o EasyPanel para este repositório — ele usará `Dockerfile` e
   `docker-compose.yml` (serviços `app` + `db`).
3. No primeiro deploy, as migrations do Prisma rodam automaticamente
   (`docker-entrypoint.sh` executa `prisma migrate deploy` antes de subir o
   servidor).
4. Crie o admin inicial rodando uma vez:
   ```bash
   docker compose exec app node prisma/seed.mjs
   ```
   (usa `ADMIN_EMAIL` / `ADMIN_PASSWORD` definidos no ambiente).

## Estrutura relevante

```
prisma/schema.prisma          modelagem do banco
Dockerfile, docker-compose.yml infraestrutura de deploy
src/app/c/[slug]/route.ts     captura o hash do vendedor e salva em cookie
src/app/page.tsx              catálogo renderizado conforme o cookie do vendedor
src/hooks/useCart.tsx         carrinho (localStorage) + montagem da mensagem WhatsApp
src/lib/whatsapp.ts           geração da mensagem e do link wa.me
src/app/admin/**              painel administrativo (produtos, vendedores, login)
```

## Guardrails do projeto

- Sem gateway de pagamento: o sistema apenas gera o link `wa.me` com o pedido.
- Sem subpastas físicas por vendedor: tudo passa pela rota dinâmica `/c/[slug]`.
- Sem controle de estoque: produto sempre disponível (modelo dropshipping).
- O domínio de produção é sempre lido de `NEXT_PUBLIC_BASE_URL`.
