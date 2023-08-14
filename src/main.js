const express = require('express')
const app = express()
const postsModel = require('./repo/models/posts.js')

app.get('/',function(req,res){
    res.send('hi')
})

app.get('/posts',async function(req,res){
    try{
        const filter = {
            order: req.query.order,
            page: req.query.page ? parseInt(req.query.page) : 1,
            limit: req.query.limit ? parseInt(req.query.limit) : 5
        } 
        const result = await postsModel.findAll(filter)
        res.send(result)
    } catch(err){
    res.send(500)
    }
})

module.exports = app