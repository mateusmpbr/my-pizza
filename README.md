# My Pizza API

API RESTful para sistema de vendas de pizzaria, desenvolvida com **Node.js 24**, **TypeScript**, **Express**, **Sequelize** e arquitetura **Clean Architecture**.

## Pré-requisitos

- Node.js >= 24
- Docker & Docker Compose
- MySQL 8 (ou via Docker)

## Setup Local (Docker)

```bash
# Copiar variáveis de ambiente
cp .env.example .env

# Subir todos os serviços (API + MySQL + phpMyAdmin)
docker-compose up --build

# Acessos:
# API:         http://localhost:3000
# Swagger:     http://localhost:3000/api/v1/docs
# phpMyAdmin:  http://localhost:8080
```

## Setup Local (sem Docker)

```bash
# Instalar dependências
npm install

# Configurar .env com suas credenciais MySQL
cp .env.example .env

# Rodar migrations e seeders
npm run db:migrate
npm run db:seed

# Iniciar em modo desenvolvimento
npm run start:dev
```

## Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run build` | Compila TypeScript para `dist/` |
| `npm run start` | Inicia a partir do build compilado |
| `npm run start:dev` | Inicia com hot-reload (ts-node-dev) |
| `npm run start:pm2` | Inicia via PM2 em cluster mode |
| `npm run typecheck` | Valida tipos TypeScript sem compilar |
| `npm run lint` | Roda ESLint |
| `npm run lint:fix` | Corrige issues ESLint automaticamente |
| `npm run format` | Formata código com Prettier |
| `npm run format:check` | Verifica formatação Prettier |
| `npm run test` | Roda todos os testes |
| `npm run test:unit` | Roda apenas testes unitários |
| `npm run test:integration` | Roda apenas testes de integração |
| `npm run test:coverage` | Roda testes com relatório de cobertura |
| `npm run db:migrate` | Roda migrations pendentes |
| `npm run db:migrate:undo` | Desfaz a última migration |
| `npm run db:seed` | Popula o banco com dados iniciais |
| `npm run db:reset` | Recria e re-popula o banco |

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NODE_ENV` | Ambiente (`development`, `test`, `production`) | `development` |
| `PORT` | Porta da API | `3000` |
| `DB_HOST` | Host do MySQL | `localhost` |
| `DB_PORT` | Porta do MySQL | `3306` |
| `DB_NAME` | Nome do banco de dados | `mypizza_dev` |
| `DB_USER` | Usuário do MySQL | `root` |
| `DB_PASSWORD` | Senha do MySQL | — |
| `DB_POOL_MAX` | Tamanho máximo do pool | `10` |
| `DB_POOL_MIN` | Tamanho mínimo do pool | `2` |
| `TEST_DB_NAME` | Banco para testes | `mypizza_test` |

## Estrutura do Projeto

```
src/
├── domain/              # Entidades e interfaces (zero dependências externas)
│   ├── entities/
│   └── repositories/
├── application/
│   └── use-cases/       # Lógica de negócio (injetada via interfaces)
├── infrastructure/
│   ├── config/          # Validação de env + configuração Sequelize
│   ├── database/
│   │   ├── models/      # Models Sequelize com decorators
│   │   ├── migrations/  # Versioned + reversíveis
│   │   └── seeders/
│   └── repositories/    # Implementações concretas dos contratos
├── interface/
│   ├── http/
│   │   ├── controllers/
│   │   ├── routes/      # Composition root
│   │   ├── middlewares/
│   │   └── validators/  # Schemas Ajv (msgs em português)
│   └── swagger/
└── shared/
    ├── errors/          # AppError + hierarquia de erros
    └── utils/           # Envelope de resposta + paginação
```

## Endpoints

### Health
- `GET /api/v1/health`

### Clientes
- `GET /api/v1/customers` — listar (paginado, filtros: `page`, `limit`)
- `GET /api/v1/customers/:id` — detalhar
- `POST /api/v1/customers` — criar
- `PUT /api/v1/customers/:id` — atualizar

### Produtos
- `GET /api/v1/products` — listar (filtros: `categoryId`, `isAvailable`, `page`, `limit`)
- `GET /api/v1/products/:id` — detalhar
- `POST /api/v1/products` — criar
- `PUT /api/v1/products/:id` — atualizar
- `DELETE /api/v1/products/:id` — remover

### Pedidos
- `GET /api/v1/orders` — listar (filtros: `status`, `customerId`, `page`, `limit`)
- `GET /api/v1/orders/:id` — detalhar
- `POST /api/v1/orders` — criar
- `PATCH /api/v1/orders/:id/status` — atualizar status
- `DELETE /api/v1/orders/:id` — cancelar/remover

### Documentação Swagger
- `GET /api/v1/docs`

## Fluxo de CI/CD

```
PR → main/develop
  └─ ci.yml: typecheck → lint → format:check → tests + coverage

push → main
  └─ cd.yml: build Docker image → push para ghcr.io

push tag v*.*.*
  └─ release.yml: gerar changelog → criar GitHub Release
```

## Stack

| Categoria | Tecnologia |
|-----------|-----------|
| Runtime | Node.js 24 LTS |
| Linguagem | TypeScript (strict) |
| Framework | Express.js |
| ORM | Sequelize + sequelize-typescript |
| Banco | MySQL 8 |
| Testes | Jest + Supertest |
| Documentação | Swagger (OpenAPI 3.0) |
| Validação | Ajv (JSON Schema) |
| Linting | ESLint + @typescript-eslint |
| Formatação | Prettier |
| Process Manager | PM2 (cluster mode) |
| Containerização | Docker + Docker Compose |
| CI/CD | GitHub Actions + ghcr.io |
