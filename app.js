require('./src/config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname, './public/')));

//Conexion a la bd de mongo
mongoose.connect(process.env.URLDB, {
  useCreateIndex:true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
}, (err, res) => {
    if(err) throw err;
    console.log('Conectado a la BD')
});


//Configuracion de rutas Globales
app.use(require('./src/routes/index'));

//Puerto Corriendo
app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto", process.env.PORT);
});