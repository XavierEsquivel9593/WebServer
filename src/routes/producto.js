const express = require('express');
const app = express();
const _ = require('underscore');
const { verificaToken } = require('../middleware/autenticacion');
//Modelos 
let Producto = require('../models/Producto');

app.get('/producto', verificaToken, (req, res) => {

    let pagina = req.query.pagina || 0;
    pagina = Number(pagina);
    let usuarioid = req.usuario._id;


    //Cantidad a imprimir
    let cantidad = req.query.cantidad || 4;
    cantidad = Number(cantidad);

    Producto.find({ disponible: true })
        .skip(pagina)
        .limit(cantidad)
        .populate('creador', 'nombre correo')//jala datos del creador
        .populate('categoria', 'descripcion')//jala datos de categoria
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    err
                })
            }
            Producto.countDocuments({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    productos,
                    conteo
                })
            });
        });
});

app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    let id = (req.usuario._id);

    //Guardar en DB 
    let producto = new Producto(body);
    producto.creador = id;
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                err
            })
        }
        res.status(200).json({
            ok: true,
            productoDB
        })
    });
});

app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Producto.findById(id)
        .populate('creador', 'nombre correo')//jala datos del creador
        .populate('categoria', 'descripcion')//jala datos de categoria
        .exec((err, productoID) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        msj: "producto no encontrado"
                    }
                })
            }
            if (!productoID) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        msj: "producto no encontrado"
                    }
                })
            }
            res.status(200).json({
                ok: true,
                productoID
            })
        });
});

app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precio']);
    let usuarioid = req.usuario._id;

    Producto.findOne({ _id: id }, (err, productoDB) => {
        if (!(productoDB.creador.toString() === usuarioid.toString())) {
            return res.status(400).json({
                msj: 'No tienes permitido modificar el producto'
            })
        }
        Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    err
                })
            }

            res.status(200).json({
                ok: true,
                productoDB
            })

        })
    });

});

//|---------------------|
//|buscador de productos|
//|---------------------|
app.get('/produtctos/buscar/:p', verificaToken, (req, res) => {
    let palabra = req.params.p;
    let buscar = new RegExp(palabra, 'i'); //constructor

    Producto.findOne({ nombre: buscar })
        .populate()
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    err
                })
            }
            res.status(200).json({
                ok: true,
                productoDB
            })
        })
});
//|---------------------|
//|borrar un de producto|
//|---------------------|
//buscar por id
//solo el usuario creado puede borrar
//Cambiar disponible a flase
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let usuarioid = req.usuario._id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                err
            })
        }
        productoDB.disponible = false;
        Producto.findByIdAndUpdate(id, productoDB, {new:true}, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    err
                })
            }
            res.status(200).json({
                ok: true,
                productoDB
            })
        });
    });
});



module.exports = app;
