# Contribuindo

## Fluxo de Trabalho

1. Crie uma branch a partir de `develop`:
   ```bash
   git checkout -b feat/nome-da-feature
   ```

2. Faça suas alterações seguindo os padrões do projeto.

3. Certifique-se que os checks passam:
   ```bash
   npm run typecheck
   npm run lint
   npm run format:check
   npm run test
   ```

4. Abra um Pull Request para `develop`.

## Nomenclatura de Branches

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Feature | `feat/<descricao>` | `feat/adicionar-cupom` |
| Correção | `fix/<descricao>` | `fix/calculo-total` |
| Chore | `chore/<descricao>` | `chore/atualizar-deps` |

## Conventional Commits

Todos os commits devem seguir o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]
```

**Tipos aceitos:**
- `feat` — nova funcionalidade
- `fix` — correção de bug
- `refactor` — refatoração sem mudança de comportamento
- `test` — adição ou correção de testes
- `chore` — manutenção, dependências
- `docs` — documentação
- `ci` — configuração de CI/CD
- `perf` — melhoria de performance

**Exemplos:**
```
feat(orders): adicionar endpoint de cancelamento
fix(customers): corrigir validação de e-mail duplicado
test(use-cases): adicionar testes para CreateOrderUseCase
```

## Arquitetura

Respeite as regras de camada:

- **Domain** — zero importações externas (sem Express, Sequelize, etc.)
- **Application** — importa apenas de `@domain` e `@shared`
- **Infrastructure** — implementa contratos de `@domain`; usa Sequelize
- **Interface** — importa de `@application`, `@shared`, `@infrastructure` (apenas nos routes)
- **Shared** — zero dependências de outras camadas do projeto

## Adicionando um Novo Endpoint

1. Defina a entidade/DTO em `src/domain/entities/`
2. Adicione método ao contrato em `src/domain/repositories/`
3. Implemente o Use Case em `src/application/use-cases/`
4. Implemente o método no Sequelize repository em `src/infrastructure/repositories/`
5. Crie o schema Ajv em `src/interface/http/validators/`
6. Adicione o método no controller em `src/interface/http/controllers/`
7. Registre a rota em `src/interface/http/routes/`
8. Documente com `@swagger` JSDoc no arquivo de rota
9. Escreva testes unitários e de integração
