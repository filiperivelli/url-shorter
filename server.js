const express = require('express')
const mongoose = require('mongoose')
const shortUrl = require('./models/shortUrl')
require('dotenv').config()
const dbUrl = process.env.DB_URL
const app = express()

mongoose.connect(dbUrl, {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine','ejs')
app.use(express.urlencoded({ extended: false}))

app.get('/', async (req,res) => {
    const shortUrls = await shortUrl.find()
    res.render('index',{ shortUrls: shortUrls})
})

app.post('/shortUrl', async (req,res)=>{
    await shortUrl.create({full: req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrl', async (req,res) => {
    const ShortUrl = await shortUrl.findOne({ short: req.params.shortUrl })
    if (ShortUrl == null) return res.sendStatus(404)
    ShortUrl.clicks++
    ShortUrl.save()
    res.redirect(ShortUrl.full)
})

app.get('/delete/:shortUrl', async (req,res) => {
    const ShortUrl = await shortUrl.findOne({ short: req.params.shortUrl })
    ShortUrl.delete()  
    res.redirect('/')     
})

app.listen(process.env.PORT || 5000);