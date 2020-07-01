const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const { verificaToken } = require('../middleware/autenticacion');

app.get('/imagen/:tipo/:img',verificaToken, (req, res) => {
    //sacar el tipo de url
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${img}`);
    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    }else{
        let pathImagen = path.resolve(__dirname,'../../assets/nd.png');
        res.sendFile(pathImagen);
    }

});

module.exports = app;