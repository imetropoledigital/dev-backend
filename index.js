const express = require('express')
const { v4: uuidv4 } = require('uuid');
const app = express()
app.use(express.json())

const alunos = {}
const PORT = 8080

app.get('/', (req, res) => {
    res.json({msg: "Hello from Express!"})
})

app.get('/alunos/:id', (req, res) => {
    res.json({aluno: alunos[req.params.id]})
})

app.put('/alunos', (req, res) => {
    const id = req.query.id
    if (id && alunos[id]){
        const aluno = req.body
        aluno.id = id
        alunos[id] = aluno
        res.json({msg: "Aluno atualizado com sucesso!"})
    }else{
        res.status(400).json({msg: "Aluno não encontrado!"})
    }

})

app.delete('/alunos', (req, res) => {
    const id = req.query.id
    if (id && alunos[id]){
        delete alunos[id]
        res.json({msg: "Aluno deletado com sucesso!"})
    }else{
        res.status(400).json({msg: "Aluno não encontrado!"})
    }
})

app.post('/alunos', (req, res) => {
    const aluno = req.body
    const idAluno = uuidv4()
    aluno.id = idAluno
    alunos[idAluno] = aluno
    res.json({msg: "Aluno adicionado com sucesso!"})
})

app.get('/alunos', (req, res) => {
    res.json({alunos: Object.values(alunos)})
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