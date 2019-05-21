const express = require('express');
const bodyParser = require("body-parser");

const usuarioRoutes = require('./routes/usuarioRoutes')
const mascotaRoutes = require('./routes/mascotaRoutes')

const db = require('./config/database');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
  res.send('Hello World!');
});


//Rutas 
app.use('/usuarios', usuarioRoutes);
app.use('/mascotas', mascotaRoutes);


//Configuración del puerto
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});

module.exports = app;