# Anime News

Aplicação web para acompanhamento de lançamentos de animes. O usuário cria uma conta, pesquisa títulos, marca os que quer seguir e recebe notificações push no celular sempre que um novo episódio, temporada ou estreia for detectado.

## Funcionalidades

- Autenticação via Google OAuth ou email e senha
- Busca de animes com autocomplete em tempo real via Jikan API
- Lista de acompanhamento por usuário
- Notificações push entregues no dispositivo mesmo com o navegador fechado
- Job em background que verifica novos episódios e temporadas a cada hora
- Interface mobile-first

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS v4 |
| Autenticação | NextAuth v5 |
| ORM | Prisma 6 |
| Banco de dados | PostgreSQL |
| Notificações | web-push (VAPID) |
| Agendamento | node-cron |
| Dados de anime | Jikan API (MyAnimeList) |

## Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Projeto no Google Cloud com credenciais OAuth 2.0

## Como rodar

**1. Clone o repositório**

```bash
git clone https://github.com/seu-usuario/anime-news.git
cd anime-news
```

**2. Instale as dependências**

```bash
npm install
```

**3. Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto com os seguintes valores:

```env
DATABASE_URL="postgresql://admin:admin@localhost:5432/animenews"

AUTH_SECRET=""                    # gere com: npx auth secret
AUTH_GOOGLE_ID=""                 # Google Cloud Console
AUTH_GOOGLE_SECRET=""             # Google Cloud Console

NEXT_PUBLIC_VAPID_PUBLIC_KEY=""   # gere com: npx web-push generate-vapid-keys
VAPID_PRIVATE_KEY=""
VAPID_EMAIL="mailto:seu@email.com"
```

**4. Suba o banco de dados**

```bash
docker compose up -d
```

**5. Rode as migrations**

```bash
npx prisma migrate dev
```

**6. Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Configuração do Google OAuth

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto e vá em **APIs e Serviços > Credenciais**
3. Crie um **ID do cliente OAuth 2.0** do tipo **Aplicativo da Web**
4. Adicione `http://localhost:3000/api/auth/callback/google` nas URIs de redirecionamento autorizadas
5. Copie o Client ID e o Client Secret para o `.env`

## Estrutura do projeto

```
anime-news/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   └── sw.js                     # Service worker para notificações push
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── animes/           # POST e DELETE da lista de acompanhamento
│   │   │   ├── push/subscribe/   # Salva subscription do dispositivo
│   │   │   └── register/         # Criação de conta
│   │   ├── anime/[id]/           # Página de detalhes do anime
│   │   ├── login/
│   │   ├── register/
│   │   ├── search/
│   │   └── page.tsx              # Página inicial com animes em lançamento
│   ├── components/
│   │   ├── AnimeGrid.tsx
│   │   ├── MarkButton.tsx
│   │   ├── PushSubscriber.tsx
│   │   └── SearchBar.tsx
│   └── lib/
│       ├── auth.ts
│       ├── cron.ts               # Job de verificação de novidades
│       └── prisma.ts
├── docker-compose.yml
└── .env
```

## Status do projeto

Em desenvolvimento ativo. Funcionalidades pendentes:

- Página de perfil do usuário
- Lista de animes marcados visível na página inicial
- Verificação de email no cadastro

## Licença

MIT