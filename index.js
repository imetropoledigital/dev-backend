const express = require('express');
const rotaUsuario = require('./rotas/usuario.rota')
const rotaPost = require('./rotas/post.rota')

const app = express()
app.use(express.json())

const PORT = 8080

app.use('/usuarios', rotaUsuario)
app.use('/posts', rotaPost)

app.get('/', (req, res) => {
    res.json({msg: "Hello from Express!"})
})

const server = app.listen(PORT)

server.on('listening', () => {
    console.log(`Servidor pronto na porta ${PORT}`)
})

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Erro: a porta ${PORT} já está em uso. Use outra porta ou encerre o processo que a está usando.`)
    } else {
        console.error('Erro ao iniciar o servidor:', err.message)
    }
    process.exit(1)
})