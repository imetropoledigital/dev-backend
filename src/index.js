const express = require('express');
const rotaUsuario = require('./rotas/usuario.rota')
const rotaPost = require('./rotas/post.rota')
const expressLayouts = require('express-ejs-layouts')
const logMiddleware = require('./middleware/log.mid')
const indexRoute = require('./rotas/index.rota')
const logger = require('./utils/logger')


const PORT = 8080

const app = express()
app.use(express.json())

app.use(logMiddleware)

app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)

app.use('/static', express.static('public'))

app.use('/', indexRoute);
app.use('/api/usuarios', rotaUsuario)
app.use('/api/posts', rotaPost)

app.get('/api', (req, res) => {
    res.json({msg: "Hello from Express!"})
})

app.use((err, req, res, next) => {
    const { statusCode, msg } = err
    res.status(statusCode).json({msg: msg})
})


const server = app.listen(PORT)

server.on('listening', () => {
    logger.info(`Iniciando no ambiente ${process.env.NODE_ENV}`)
    logger.info(`Servidor pronto na porta ${PORT}`)
})

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        logger.error(`Erro: a porta ${PORT} já está em uso. Use outra porta ou encerre o processo que a está usando.`)
    } else {
        logger.error('Erro ao iniciar o servidor:', err.message)
    }
    process.exit(1)
})