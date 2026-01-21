const express = require('express');// comon js
const path = require('path');
require('dotenv').config();


const app = express() // app express
const port = process.env.PORT //port
const hostname = process.env.HOST_NAME;

// config template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// config static files: image/css/js
app.use(express.static(path.join(__dirname,'public')));

// khai báo route
app.get('/', (req, res) => {
  res.send('Hello World!nodemon')
})

app.get('/abc', (req, res) => {
  res.send('Check abc')
})

app.get('/hoidanit', (req, res) => {
  // res.send('<h1> hoi dan it<h1>')
  res.render('sample.ejs')
})

app.listen(port,hostname, () => {
  console.log(`Example app listening on port ${port}`)
})
