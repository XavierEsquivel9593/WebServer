const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENTE_ID);

const {verify} = require('../middleware/autenticacion');
let Usuario = require('../models/Usuario');

app.post('/login', (req, res) => {
    let { correo, password } = req.body;

    Usuario.findOne({ correo: correo }, (err, usuarioDB) => {

        //Validar 
        //Validar El error 
        if (err) {
            return res.status(500).json({
                err
            })
        }

        //Validar Si el usuario existe 
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    msj: "Usuario no encontrado"
                }
            });
        }

        //Validar Si la contraseña coicide 
        if (!bcrypt.compareSync(password, usuarioDB.password)) {
            return res.status(401).json({
                ok: false,
                err: {
                    msj: "Contraseña erronea"
                }
            });
        }

        let token = jwt.sign({
            usuarioDB
        }, process.env.SECRETO, { expiresIn: process.env.TIEMPO });

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});

//


app.post('/login2', async (req, res) => {
    let token = req.body.idtoken;
    if (!token) return;
    let googleUsuario = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })

        });
    //Verificar si existe el correo o no 
    Usuario.findOne({ correo: googleUsuario.correo }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: e
            })
        }
        if (!usuarioDB) {
            //Si el usuario no existe 
            let usuario = new Usuario();
            usuario.nombre = googleUsuario.nombre
            usuario.correo = googleUsuario.correo
            usuario.password = "=)"
            usuario.google = true;
            usuario.save((err, usuariodb) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign({
                    usuariodb
                }, process.env.SECRETO, { expiresIn: process.env.TIEMPO });

                console.log('Token ', token);
                console.log('DB', usuariodb)
                return res.status(200).json({
                    ok: true,
                    usuario: usuariodb,
                    token
                });
            })
        } else if (usuarioDB.google === false) {
            return res.status(400).json({
                ok: false,
                msj: "Debe Iniciar Sesion Normal"
            })
        } else {
            console.log('Ya tenia Session ')
            let token = jwt.sign({
                usuarioDB
            }, process.env.SECRETO, { expiresIn: process.env.TIEMPO });

            return res.status(200).json({
                ok: true,
                usuario: usuarioDB,
                token
            });
        }
    });
});


module.exports = app;