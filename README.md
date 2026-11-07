This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## CRUD de Usuários

```bash
npm install
npm run api     # terminal 1 – JSON Server em http://localhost:3001 (usa db.json)
npm run dev     # terminal 2 – Next.js em http://localhost:3000
```

Acesse `/usuarios` (listagem), `/usuarios/novo` (cadastro) e `/usuarios/[id]/editar` (edição).

## Autenticação e rotas protegidas

- `POST /api/login` confere e-mail/senha na API (json-server), gera um token JWT (HS256, validade de 1h) e o grava em cookie `httpOnly`.
- `src/proxy.ts` roda antes de cada página: sem token válido, qualquer rota interna (`/dashboard`, `/produtos`, `/usuarios/...`) redireciona para o login (`/`).
- `POST /api/logout` apaga o cookie (botão **Sair** na sidebar).
- Defina `AUTH_SECRET` em `.env.local` para produção.

Como rodar: `npm install`, depois `npm run api` (porta 3001) e `npm run dev` (porta 3000).
Login de teste: `ana.souza@email.com` / `123456`.
