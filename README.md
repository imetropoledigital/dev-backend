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

O projeto usa **Sequelize** como ORM e suporta dois ambientes com bancos diferentes:

| Ambiente | Banco | Configuração |
|----------|-------|--------------|
| `development` | SQLite (arquivo local) | `src/db/dbend.sqlite` — criado automaticamente |
| `production`  | MySQL | Edite `src/db/config/config.json` com usuário, senha e host |

### Desenvolvimento (SQLite)

**1. Rodar as migrações** (cria as tabelas):

```bash
npm run migrate-dev
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

> O arquivo `dbend.sqlite` é gerado automaticamente na pasta `src/db/` após rodar as migrações.

### Produção (MySQL)

Antes de rodar, certifique-se de que o banco MySQL está criado e atualize as credenciais em `src/db/config/config.json`:

```json
"production": {
  "username": "root",
  "password": "changeme",
  "database": "dbend",
  "host": "127.0.0.1",
  "dialect": "mysql"
}
```

Em seguida, rode as migrações no ambiente de produção:

```bash
npm run migrate-prod
```

## Execução

```bash
# Modo desenvolvimento — SQLite + hot-reload (nodemon)
npm start

# Modo produção — MySQL
npm run production
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
│   ├── index.js          # Ponto de entrada — configura e sobe o Express
│   ├── rotas/            # Definição das rotas por recurso
│   ├── middleware/       # Middlewares de validação de entrada
│   ├── schema/           # Schemas JSON para validação com AJV
│   ├── utils/            # Utilitários (ex: configuração do logger Winston)
│   └── db/
│       ├── config/       # Configuração do banco por ambiente (SQLite/MySQL)
│       ├── models/       # Models Sequelize
│       ├── migrations/   # Migrações do banco de dados
│       └── seeders/      # Seeds com dados iniciais
├── views/
│   ├── layouts/          # Layout base das páginas (express-ejs-layouts)
│   └── pages/            # Templates EJS de cada página
├── public/
│   └── uploads/          # Arquivos enviados via upload
├── .usuario.http         # Exemplos de requisições de usuários
└── .post.http            # Exemplos de requisições de posts
```

---

## Rotas disponíveis

O projeto expõe duas interfaces distintas:

- **Interface web** — rotas na raiz (`/`), renderizam páginas HTML com EJS
- **API REST** — rotas sob o prefixo `/api`, retornam JSON

### Interface web

| Método | Rota            | Descrição                                    |
|--------|-----------------|----------------------------------------------|
| GET    | `/`             | Lista os 10 posts mais recentes              |
| GET    | `/post/:id`     | Exibe o conteúdo completo de um post         |

### API — Raiz

| Método | Rota   | Descrição                    |
|--------|--------|------------------------------|
| GET    | `/api` | Verifica se a API está no ar |

**Resposta:**
```json
{ "msg": "Hello from Express!" }
```

---

### API — Usuários — `/api/usuarios`

Os dados de usuário são validados pelo middleware antes de serem persistidos. O campo `email` deve ser um e-mail válido e `senha` é obrigatória.

| Método | Rota                       | Descrição                              |
|--------|----------------------------|----------------------------------------|
| GET    | `/api/usuarios`            | Lista todos os usuários cadastrados    |
| GET    | `/api/usuarios/:id`        | Busca um usuário pelo ID (path param)  |
| POST   | `/api/usuarios`            | Cria um novo usuário                   |
| PUT    | `/api/usuarios/?id=[ID]`   | Atualiza um usuário existente pelo ID  |
| DELETE | `/api/usuarios/?id=[ID]`   | Remove um usuário pelo ID              |

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

### API — Posts — `/api/posts`

Cada post pertence a um usuário (`userId`). O campo `userId` deve corresponder ao `id` de um usuário existente.

| Método | Rota                    | Descrição                           |
|--------|-------------------------|-------------------------------------|
| GET    | `/api/posts`            | Lista todos os posts cadastrados    |
| GET    | `/api/posts/:id`        | Busca um post pelo ID (path param)  |
| POST   | `/api/posts`            | Cria um novo post                   |
| PUT    | `/api/posts/?id=[ID]`   | Atualiza um post existente pelo ID  |
| DELETE | `/api/posts/?id=[ID]`   | Remove um post pelo ID              |

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

#### Upload de foto

| Método | Rota                        | Descrição                                  |
|--------|-----------------------------|--------------------------------------------|
| POST   | `/api/posts/:id/upload`     | Faz upload de uma foto e associa ao post   |

O upload é feito via `multipart/form-data` com o campo `foto`. Apenas arquivos `.jpg` e `.jpeg` são aceitos. O arquivo é salvo em `public/uploads/` e o caminho é armazenado no campo `foto` do post.

**Exemplo de requisição (REST Client / curl):**
```
POST http://localhost:8080/posts/1/upload
Content-Type: multipart/form-data; boundary=boundary

--boundary
Content-Disposition: form-data; name="foto"; filename="imagem.jpg"
Content-Type: image/jpeg

< ./imagem.jpg
--boundary--
```

**Exemplos de resposta:**

- Upload bem-sucedido: `{ "msg": "Upload realizado com sucesso!" }`
- Post não encontrado (400): `{ "msg": "Post não encontrado!" }`
- Formato inválido: `Arquivo não suportado. Apenas jpg e jpeg são suportados.`

> Os arquivos enviados ficam acessíveis via `/static/uploads/<nome-do-arquivo>`.

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
| [multer](https://github.com/expressjs/multer) | Upload de arquivos via multipart/form-data |
| [ejs](https://ejs.co/) + [express-ejs-layouts](https://github.com/Soarez/express-ejs-layouts) | Renderização de templates HTML no servidor |
| [moment](https://momentjs.com/) | Formatação de datas em português |
| [winston](https://github.com/winstonjs/winston) | Logging estruturado da aplicação |
| [nodemon](https://nodemon.io/) *(dev)* | Hot-reload no desenvolvimento |