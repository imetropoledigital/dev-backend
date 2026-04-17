# dev-backend

Projeto de exemplo para a disciplina de **Desenvolvimento Backend** do IMD/UFRN.

A aplicação é uma API REST simples construída com **Node.js** e **Express**, com armazenamento em memória (sem banco de dados). O objetivo é ilustrar conceitos como roteamento, middlewares, validação de dados e organização de projetos backend.

> **Atenção:** por ser um projeto didático, os dados são armazenados apenas em memória. Ao reiniciar o servidor todos os registros são perdidos.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v14+
- npm
- [Sequelize CLI](https://github.com/sequelize/cli) (opcional, para rodar migrations manualmente)

```bash
npm install -g sequelize-cli
```

## Instalação

```bash
npm install
```

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

## Testando a API com o arquivo `api.http`

O arquivo [api.http](api.http) na raiz do projeto contém exemplos prontos de todas as requisições. Para usá-lo você precisa da extensão **REST Client** no VS Code:

1. Instale a extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) no VS Code.
2. Abra o arquivo `api.http`.
3. Clique em **"Send Request"** acima de cada bloco para executar a chamada.

> Você também pode importar o arquivo em ferramentas como **Insomnia** ou **Postman** (via importação de coleção HTTP).

---

## Estrutura do projeto

```
dev-backend/
├── index.js                          # Ponto de entrada — configura e sobe o Express
├── rotas/
│   ├── usuario.rota.js               # Rotas de /usuarios
│   └── post.rota.js                  # Rotas de /posts
├── middleware/
│   ├── validarUsuario.middleware.js  # Valida o corpo das requisições de usuário
│   └── validarPost.middleware.js     # Valida o corpo das requisições de post
├── schema/
│   ├── usuario.schema.js             # Schema JSON do usuário (AJV)
│   └── post.schema.js                # Schema JSON do post (AJV)
├── api.http                          # Exemplos de requisições para teste
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

| Método | Rota                | Descrição                           |
|--------|---------------------|-------------------------------------|
| GET    | `/posts`            | Lista todos os posts cadastrados    |
| GET    | `/posts/:id`        | Busca um post pelo ID (path param)  |
| POST   | `/posts`            | Cria um novo post                   |
| PUT    | `/posts/?id=[ID]`   | Atualiza um post existente pelo ID  |
| DELETE | `/posts/?id=[ID]`   | Remove um post pelo ID              |

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
| [uuid](https://github.com/uuidjs/uuid) | Geração de IDs únicos (UUIDv4) |
| [ajv](https://ajv.js.org/) + [ajv-formats](https://github.com/ajv-validator/ajv-formats) | Validação de schemas JSON |
| [nodemon](https://nodemon.io/) *(dev)* | Hot-reload no desenvolvimento |