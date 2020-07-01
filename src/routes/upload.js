const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
  //sacar el tipo de url
  let tipo = req.params.tipo;
  //sacar el id de la url
  let id = req.params.id;
  let tipoPermitidas = ['usuarios', 'productos'];

  if (!req.files) {
    return res.status(404).json({
      ok: false,
      msj: 'no se subio nada'
    });
  }
  //solo validar usuarios y prodcutos
  if (tipoPermitidas.indexOf(tipo) < 0) {//indexof recorre la cadena
    return res.status(400).json({
      ok: false,
      err: {
        msj: `las extensiones permitidas son ${tipoPermitidas.join('.')}`,
        ext: tipo
      }

    });

  }


  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split('.');
  let extension = nombreCortado[nombreCortado.length - 1];
  //verifica una extension permitida
  let extensionesPermitidas = ['png', 'jpeg', 'gif', 'jpg'];
  if (extensionesPermitidas.indexOf(extension) < 0) {//indexof recorre la cadena
    return res.status(400).json({
      ok: false,
      err: {
        msj: `las extensiones permitidas son ${extensionesPermitidas.join('.')}`,
        ext: extension
      }
    });
  }
  //cambiar el nombre de la imagen
  let nuevoNombre = `${tipo}-${id}-${new Date().getMilliseconds()}.${extension}`;
  //almacenar en la carpeta uploads/ de una carpeta del tipo permitido y la imagen con  nuevo nombre
  archivo.mv(`uploads/${tipo}/${nuevoNombre}`, (err) => {
    if (err){
      borrarArchivo(nuevoNombre,tipo);
      return res.status(500).send(err);
    }
      

    if (tipo === 'usuarios') {
      //usuarios
      imagenUsuario(id, res, nuevoNombre,tipo)

    } else {
      //productoss
      imagenProducto(id, res, nuevoNombre,tipo)
    }
  });
});

const imagenUsuario = (id, res, nuevoNombre,tipo) => {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borrarArchivo(nuevoNombre,tipo);
      return res.status(500).json({
        err
      })
    }
    if (!usuarioDB) {
      borrarArchivo(nuevoNombre,tipo);
      return res.status(404).json({
        ok: false,
        msj: 'ID no valido'
      });
    }
    borrarArchivo(usuarioDB.img,'usuarios');
    usuarioDB.img = nuevoNombre;
    usuarioDB.save((err, usuarioGuardado) => {
      res.status(200).json({
        ok: true,
        usuarioGuardado
      })
    })
  });
}

const imagenProducto = (id, res, nuevoNombre,tipo) => {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borrarArchivo(nuevoNombre,tipo);
      return res.status(500).json({
        err
      })
    }
    if (!productoDB) {
      borrarArchivo(nuevoNombre,tipo);
      return res.status(404).json({
        ok: false,
        msj: 'ID no valido'
      });
    }
    borrarArchivo(productoDB.img,'productos');
    productoDB.img = nuevoNombre;
    productoDB.save((err, productoGuardado) => {
      res.status(200).json({
        ok: true,
        productoGuardado
      })
    })
  });
}

const borrarArchivo =(nuevoNombre,tipo)=>{
  let pathImage= path.resolve(__dirname,`../../uploads/${tipo}/${nuevoNombre}`);
  if(fs.existsSync(pathImage)){
    fs.unlinkSync(pathImage);
  }

}


module.exports = app;