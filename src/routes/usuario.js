const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
//Modelos 
let Usuario = require('../models/Usuario');


app.post('/usuario', (req, res) => {

    let body = req.body;
    const {password} = body;
    body.password= bcrypt.hashSync(password, 2);
    let usuario = new Usuario(body);
    usuario.save((err, usuariodb) => {
        if (err) {
            return res.status(500).json({
                err
            })
        }
        res.status(200).json({
            ok: true,
            usuariodb
        })
    })
});

app.get('/usuario', (req,res) => {

    Usuario.find({}, (err, usuarios) => {
        if(err){
            return res.status(500).json({
                err
            });
        }
        res.status(200).json({
            ok:true,
            usuarios
        })
    });
}); 

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body =_.pick(req.body, ['nombre', 'telefono']) ;

/* 
    delete body.password;
    delete body.correo; */

    Usuario.findByIdAndUpdate(id, body, {new:true, runValidators:true  }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                err
            })
        }
        res.status(200).json({
            ok: true,
            usuarioDB
        })
    })
});


app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;

    Usuario.findByIdAndRemove(id , (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                err
            })
        }

        if(!usuarioBorrado){
             return res.status(400).json({
                ok:false,
                err:{
                    msj:"Usuario no encontrado"
                }
            }); 
        }  

        res.status(200).json({
            ok:true,
            usuarioBorrado
        })
    })
});

module.exports = app;
