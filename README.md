# dev-backend

Projeto de exemplo para a disciplina de **Desenvolvimento Backend** do IMD/UFRN.

A aplicação é uma API REST simples construída com **Node.js**, **Express** e **Sequelize** (ORM), usando **SQLite** como banco de dados. O objetivo é ilustrar conceitos como roteamento, middlewares, validação de dados, ORM e organização de projetos backend.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v14+
- npm

## Instalação

```bash
npm install
```

## Banco de dados

O projeto usa **Sequelize** com **SQLite**. Siga a ordem abaixo na primeira execução:

**1. Rodar as migrações** (cria as tabelas no banco):

```bash
npx sequelize-cli db:migrate
```

**2. Rodar as seeds** (popula o banco com dados iniciais):

```bash
npx sequelize-cli db:seed:all
```

Para desfazer:

```bash
# Desfaz a última migração
npx sequelize-cli db:migrate:undo

# Desfaz todas as seeds
npx sequelize-cli db:seed:undo:all
```

> O arquivo do banco SQLite (`dbend.sqlite`) é gerado automaticamente na pasta `src/db/` após rodar as migrações.

## Execução

```bash
# Execução direta
npm start

# Modo desenvolvimento com hot-reload (nodemon)
npm run dev
```

O servidor sobe na porta **8080**. Ao iniciar, você verá a mensagem:

```
Servidor pronto na porta 8080
```

---

## Testando a API

Os exemplos de requisições estão separados por recurso na raiz do projeto:

- [`.usuario.http`](.usuario.http) — rotas de `/usuarios`
- [`.post.http`](.post.http) — rotas de `/posts`

Para usá-los você precisa da extensão **REST Client** no VS Code:

1. Instale a extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) no VS Code.
2. Abra um dos arquivos `.http`.
3. Clique em **"Send Request"** acima de cada bloco para executar a chamada.

> Você também pode importar os arquivos em ferramentas como **Insomnia** ou **Postman**.

---

## Estrutura do projeto

```
dev-backend/
├── src/
│   ├── index.js                          # Ponto de entrada — configura e sobe o Express
│   ├── rotas/
│   │   ├── usuario.rota.js               # Rotas de /usuarios
│   │   └── post.rota.js                  # Rotas de /posts
│   ├── middleware/
│   │   ├── validarUsuario.middleware.js  # Valida o corpo das requisições de usuário
│   │   └── validarPost.middleware.js     # Valida o corpo das requisições de post
│   ├── schema/
│   │   ├── usuario.schema.js             # Schema JSON do usuário (AJV)
│   │   └── post.schema.js                # Schema JSON do post (AJV)
│   └── db/
│       ├── config/
│       │   └── config.json               # Configuração do banco por ambiente
│       ├── models/
│       │   ├── index.js                  # Inicializa o Sequelize e carrega os models
│       │   ├── usuario.js                # Model Sequelize de usuário
│       │   └── post.js                   # Model Sequelize de post (belongsTo Usuario)
│       ├── migrations/
│       │   ├── ...-create-usuario.js     # Cria a tabela Usuarios
│       │   ├── ...-create-post.js        # Cria a tabela Posts
│       │   └── ...-add-post-belongs-user.js  # Adiciona userId (FK) na tabela Posts
│       ├── seeders/
│       │   └── ...-root-user.js          # Seed do usuário root inicial
│       └── dbend.sqlite                  # Banco SQLite (gerado após db:migrate)
├── .usuario.http                         # Exemplos de requisições de usuários
├── .post.http                            # Exemplos de requisições de posts
└── package.json
```

---

## Rotas disponíveis

### Raiz

| Método | Rota | Descrição |
|--------|------|-----------|
| GET    | `/`  | Verifica se a API está no ar |

**Resposta:**
```json
{ "msg": "Hello from Express!" }
```

---

### Usuários — `/usuarios`

Os dados de usuário são validados pelo middleware antes de serem persistidos. O campo `email` deve ser um e-mail válido e `senha` é obrigatória.

| Método | Rota                   | Descrição                              |
|--------|------------------------|----------------------------------------|
| GET    | `/usuarios`            | Lista todos os usuários cadastrados    |
| GET    | `/usuarios/:id`        | Busca um usuário pelo ID (path param)  |
| POST   | `/usuarios`            | Cria um novo usuário                   |
| PUT    | `/usuarios/?id=[ID]`   | Atualiza um usuário existente pelo ID  |
| DELETE | `/usuarios/?id=[ID]`   | Remove um usuário pelo ID              |

**Corpo esperado no POST e PUT:**
```json
{
  "email": "someuser@gmail.com",
  "senha": "changeit"
}
```

**Exemplos de resposta:**

- Criação bem-sucedida (`POST`): `{ "msg": "Usuário adicionado com sucesso!" }`
- Atualização bem-sucedida (`PUT`): `{ "msg": "Usuário atualizado com sucesso!" }`
- Remoção bem-sucedida (`DELETE`): `{ "msg": "Usuário deletado com sucesso!" }`
- Dados inválidos (400): `{ "msg": "Dados inválidos", "erros": [...] }`
- ID não encontrado (400): `{ "msg": "Usuário não encontrado!" }`

---

### Posts — `/posts`

Cada post pertence a um usuário (`userId`). O campo `userId` deve corresponder ao `id` de um usuário existente.

| Método | Rota                | Descrição                           |
|--------|---------------------|-------------------------------------|
| GET    | `/posts`            | Lista todos os posts cadastrados    |
| GET    | `/posts/:id`        | Busca um post pelo ID (path param)  |
| POST   | `/posts`            | Cria um novo post                   |
| PUT    | `/posts/?id=[ID]`   | Atualiza um post existente pelo ID  |
| DELETE | `/posts/?id=[ID]`   | Remove um post pelo ID              |

**Corpo esperado no POST e PUT:**
```json
{
  "titulo": "Meu primeiro post",
  "texto": "Conteúdo do post aqui.",
  "userId": 1
}
```

**Exemplos de resposta:**

- Criação bem-sucedida (`POST`): `{ "msg": "Post adicionado com sucesso!" }`
- Atualização bem-sucedida (`PUT`): `{ "msg": "Post atualizado com sucesso!" }`
- Remoção bem-sucedida (`DELETE`): `{ "msg": "Post deletado com sucesso!" }`
- ID não encontrado (400): `{ "msg": "Post não encontrado!" }`

---

## Validação

A validação é feita via middleware usando a biblioteca [AJV](https://ajv.js.org/), com schemas definidos na pasta `schema/`.

**Usuários** (`schema/usuario.schema.js`):
- `email`: obrigatório, formato de e-mail válido
- `senha`: obrigatório, string
- Campos extras não são permitidos (`additionalProperties: false`)

**Posts** (`schema/post.schema.js`):
- `titulo`: obrigatório, string entre 5 e 100 caracteres
- `texto`: obrigatório, string
- Campos extras não são permitidos (`additionalProperties: false`)

---

## Dependências principais

| Pacote | Uso |
|--------|-----|
| [express](https://expressjs.com/) | Framework web |
| [sequelize](https://sequelize.org/) | ORM para acesso ao banco de dados |
| [sqlite3](https://github.com/TryGhost/node-sqlite3) | Driver SQLite usado pelo Sequelize |
| [uuid](https://github.com/uuidjs/uuid) | Geração de IDs únicos (UUIDv4) |
| [ajv](https://ajv.js.org/) + [ajv-formats](https://github.com/ajv-validator/ajv-formats) | Validação de schemas JSON |
| [nodemon](https://nodemon.io/) *(dev)* | Hot-reload no desenvolvimento |