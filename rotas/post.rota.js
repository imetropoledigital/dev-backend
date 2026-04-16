const express = require('express')
const router = express.Router()
const postMid = require('../middlewares/validarPost.middleware')
const { Posts } = require('../models')

router.post('/', postMid)
router.put('/', postMid)

router.get('/', async (req, res) => {
    const posts = await Posts.findAll()
    res.json({posts: posts})
})

router.get('/:id', async (req, res) => {
    const post = await Posts.findByPk(req.params.id)
    res.json({posts: post})
})

router.post('/', async (req, res) => {
    const post = await Posts.create(req.body)
    res.json({msg: "Post adicionado com sucesso!"})
})

router.delete('/', async (req, res) => {
    const id = req.query.id
    const post = await Posts.findByPk(id)
    if (post){
        await post.destroy()
        res.json({msg: "Post deletado com sucesso!"})
    }else{
        res.status(400).json({msg: "Post não encontrado!"})
    }
})

router.put('/', async (req, res) => {
    const id = req.query.id
    const post = await Posts.findByPk(id)
    if (post){
        post.titulo = req.body.titulo
        post.texto = req.body.texto
        await post.save()
        res.json({msg: "Post atualizado com sucesso!"})
    }else{
        res.status(400).json({msg: "Post não encontrado!"})
    }
})

module.exports = router