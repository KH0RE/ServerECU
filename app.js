const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const dotenv = require('dotenv');
const user = require('./routes/user')
const url = 'mongodb://localhost/GuiEcu'

const app =  express()

dotenv.config();

app.use(bodyParser.urlencoded({ extended: false })),
app.use(bodyParser.json()),

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
const con =  mongoose.connection

con.on('open', function(){
    console.log('turned on....')

})

app.use('/api', user)
app.use(express.json())



app.listen(9000, ()=>{
    console.log('Server started....')
})