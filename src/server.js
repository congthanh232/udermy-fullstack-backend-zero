require('dotenv').config();
const express = require('express');// comon js
const path = require('path');
const configViewEngine = require('./config/viewEngine')
const webRoutes = require('./routes/web')


const app = express() // app express
const port = process.env.PORT //port
const hostname = process.env.HOST_NAME;

// config template engine
configViewEngine(app);

// khai báo route
app.use('/test',webRoutes)

app.listen(port,hostname, () => {
  console.log(`Example app listening on port ${port}`)
})
