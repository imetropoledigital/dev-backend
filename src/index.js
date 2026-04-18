const express = require('express');
const rotaUsuario = require('./rotas/usuario.rota')
const rotaPost = require('./rotas/post.rota')
const expressLayouts = require('express-ejs-layouts')

const PORT = 8080

const app = express()
app.use(express.json())
app.set('view engine', 'ejs')

app.set('layout', 'layouts/layout')
app.use(expressLayouts)

app.use('/static', express.static('public'))

app.use('/usuarios', rotaUsuario)
app.use('/posts', rotaPost)

app.get('/', (req, res) => {
    res.json({msg: "Hello from Express!"})
})

app.get('/home', (req, res) => {
    const number = Math.random()
    res.render('pages/index', {variavel: number})
})

 app.get('/cursos', (req, res) => {
    const cursos = [
            {nome: "Programação frontend", ch: 280}, 
            {nome: "Programação backend", ch: 330},
            {nome: "Programação concorrente", ch: 300},
            {nome: "Programação distribuída", ch: 400}
    ]
    res.render('pages/cursos/index', {cursos: cursos})
})

 app.get('/alunos', (req, res) => {
    const alunos = [
            {nome: "João Pedro"},
            {nome: "Fernanda"},
            {nome: "Francisco"}
    ]
    res.render('pages/alunos/index', {alunos: alunos})
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