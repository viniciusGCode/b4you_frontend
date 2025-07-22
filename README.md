# Sumário
- [Link do Deploy da Aplicação](#link-do-deploy-da-aplicação)
- [Descrição do Projeto](#descrição-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Execução da Aplicação](#execução-da-aplicação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Autenticação JWT](#autenticação-jwt)
- [Integração com o Backend](#integração-com-o-backend)

# Link do Deploy da Aplicação

```url
https://b4you-frontend-web.vercel.app/
```

# Descrição do Projeto
Este é o frontend de uma aplicação web para gerenciamento de produtos, desenvolvido em **Next.js** com **TypeScript**. A interface permite listar, criar, editar e excluir produtos, além de realizar compras simuladas. A autenticação é feita via **JWT**, armazenado no `sessionStorage`, e a aplicação consome uma API REST hospedada em `https://b4youbackend-production.up.railway.app/`. O design utiliza o tema `purple-heart` com suporte a modo claro e escuro, implementado com Tailwind CSS e shadcn/ui.

# Tecnologias Utilizadas
- **Next.js** (v13+ com App Router)
- **TypeScript**
- **React** (com Hooks)
- **Tailwind CSS** (com tema `purple-heart`)
- **shadcn/ui** (componentes UI customizáveis)
- **Axios** (para requisições HTTP ao backend)
- **lucide-react** (ícones)
- **sonner** (notificações toast)
- **jwt-decode** (decodificação de tokens JWT)
- **next-themes** (suporte a temas claro/escuro)

# Pré-requisitos
- **Node.js** (v18+ recomendado)
- **npm** ou **yarn**
- Um navegador moderno (Chrome, Firefox, etc.)
- Acesso ao backend em `https://b4youbackend-production.up.railway.app/` (ou localmente configurado)

# Configuração do Ambiente
1. Clone o repositório:
```bash
git clone <repo-url>
cd viniciusgcode-b4you_frontend/apps/web
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env.local` na raiz de `apps/web` com a URL do backend:
```env
NEXT_PUBLIC_API_URL=https://b4youbackend-production.up.railway.app
```

4. (Opcional) Configure o backend localmente, conforme o [README do backend](https://github.com/viniciusGCode/b4you_backend).

# Execução da Aplicação
- Rodar em modo desenvolvimento com reload automático:
```bash
npm run dev
```

- Build da aplicação:
```bash
npm run build
```

- Iniciar aplicação em produção:
```bash
npm start
```

Acesse a aplicação em `http://localhost:3000` (ou a porta configurada).

# Estrutura do Projeto
```
viniciusgcode-b4you_frontend/
└── apps/
    └── web/
        ├── components.json           # Configuração de componentes shadcn/ui
        ├── next.config.ts           # Configurações do Next.js
        ├── package.json             # Dependências e scripts
        ├── postcss.config.mjs       # Configurações do PostCSS/Tailwind
        ├── tsconfig.json            # Configurações do TypeScript
        ├── .env.example             # Exemplo de variáveis de ambiente
        └── src/
            ├── index.css            # Estilização global (tema purple-heart)
            ├── app/
            │   ├── layout.tsx       # Layout global com header (login/logout, tema)
            │   ├── page.tsx         # Página inicial
            │   ├── dashboard/       # Página de gerenciamento de produtos
            │   │   └── page.tsx
            │   └── login/           # Página de login
            │       └── page.tsx
            ├── components/
            │   ├── deleteModal.tsx  # Modal de confirmação de exclusão
            │   ├── header.tsx       # Componente de cabeçalho
            │   ├── loader.tsx       # Componente de loading
            │   ├── modal.tsx        # Modal para criar/editar produtos
            │   ├── mode-toggle.tsx  # Alternador de tema claro/escuro
            │   ├── providers.tsx    # Provedores de contexto
            │   ├── theme-provider.tsx # Provedor de temas
            │   └── ui/              # Componentes shadcn/ui
            │       ├── button.tsx
            │       ├── card.tsx
            │       ├── checkbox.tsx
            │       ├── dropdown-menu.tsx
            │       ├── input.tsx
            │       ├── label.tsx
            │       ├── money-input.tsx # Input personalizado para preços
            │       ├── skeleton.tsx
            │       └── sonner.tsx   # Componente de notificações
            └── lib/
                ├── api.ts           # Funções para chamadas à API
                └── utils.ts         # Utilitários gerais
```

# Funcionalidades
- **Autenticação**:
  - Login via `/login` com geração de token JWT.
  - Botão de login/logout no header (`layout.tsx`) que alterna com base no token no `sessionStorage`.
- **Gerenciamento de Produtos**:
  - Listagem de produtos com detalhes (nome, descrição, preço, quantidade).
  - Criação de produtos via modal com validação de campos.
  - Edição de produtos com preenchimento automático dos dados existentes.
  - Exclusão de produtos com confirmação via modal.
  - Compra simulada de produtos (com notificação de sucesso/erro).
- **UI/UX**:
  - Tema `purple-heart` com suporte a modo claro/escuro (via `next-themes`).
  - Componentes estilizados com Tailwind CSS e shadcn/ui.
  - Notificações toast para feedback de ações (via `sonner`).
  - Input de preço personalizado (`MoneyInput`) com formatação em reais (ex.: `R$ 5,90`).

# Autenticação JWT
- O frontend utiliza tokens JWT armazenados no `sessionStorage` como `authToken` no formato `{ token: string, expiresAt: number }`.
- O token é validado em todas as chamadas à API protegidas (criar, atualizar, excluir produtos).
- Se o token estiver ausente ou expirado, o usuário é redirecionado para `/login`.
- O botão de logout no header remove o token sem redirecionar.

# Integração com o Backend
O frontend consome a API REST em `https://b4youbackend-production.up.railway.app/` (ou configurada via `NEXT_PUBLIC_API_URL`). As chamadas são feitas com **Axios** e incluem o header `Authorization: Bearer <token>` para rotas protegidas.

| Método | Endpoint           | Descrição                     | Protegido |
|--------|--------------------|-------------------------------|-----------|
| POST   | /login             | Login do usuário e geração JWT| Não       |
| POST   | /products          | Criar produto                 | Sim       |
| GET    | /products/:id      | Buscar produto por ID         | Não       |
| GET    | /products          | Listar todos os produtos      | Não       |
| PUT    | /products/:id      | Atualizar produto             | Sim       |
| DELETE | /products/:id      | Deletar produto               | Sim       |
