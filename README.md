# CRUD Lista de Pessoas

Sistema full-stack de cadastro, consulta, edição e exclusão de pessoas e seus endereços. Projeto pessoal desenvolvido para praticar consumo de API, formulários reativos em Angular e persistência de dados em banco relacional.

## Funcionalidades

- Cadastro de pessoas (nome, identificação, data de nascimento, e-mail, telefone)
- Cada pessoa pode ter múltiplos endereços associados
- Listagem, busca por ID, edição e exclusão (CRUD completo)
- Operações de escrita protegidas por transação no banco (`BEGIN` / `COMMIT` / `ROLLBACK`), garantindo que pessoa e endereços sejam salvos de forma atômica

## Stack

**Front-end** — pasta `crud-pessoas/`
- Angular 21
- TypeScript
- RxJS
- Formulários reativos (`@angular/forms`)

**Back-end** — pasta `crud-backend/`
- Node.js + Express 5
- PostgreSQL via [`pg`](https://www.npmjs.com/package/pg)
- CORS habilitado

## Como rodar localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL 16+

### 1. Banco de dados
Crie um banco no PostgreSQL e execute o script [`CRIARTABELAS.sql`](./CRIARTABELAS.sql) (raiz do projeto) para criar as tabelas `pessoas` e `enderecos`.

### 2. Back-end
```bash
cd crud-backend
npm install
node server.js
```
Configure a conexão com o banco em `crud-backend/database/database.js` (usuário, senha, host e nome do banco). O servidor sobe em `http://localhost:3000`.

### 3. Front-end
```bash
cd crud-pessoas
npm install
npm start
```
A aplicação sobe em `http://localhost:4200` e consome a API em `http://localhost:3000`.

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/pessoas` | Lista todas as pessoas |
| `GET` | `/api/pessoas/:id` | Busca uma pessoa e seus endereços |
| `POST` | `/api/pessoas` | Cria uma pessoa (com endereços opcionais) |
| `PUT` | `/api/pessoas/:id` | Atualiza uma pessoa e substitui seus endereços |
| `DELETE` | `/api/pessoas/:id` | Remove uma pessoa e seus endereços |
