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

    Producto.find({creador:usuarioid}, 'nombre precio cantidad')
        .skip(pagina)
        .limit(cantidad)
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

app.delete('/producto/:id', verificaToken, (req, res) => {

    //solo puede eliminar el producto el usuario si corresponde con el usuario autenticado
    let usuarioid = req.usuario._id;
    
    let id = req.params.id;

    Producto.findByIdAndRemove(id, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                err
            })
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    msj: "Producto no encontrado"
                }
            })
        }

        res.status(200).json({
            ok: true,
            productoBorrado
        })
    })
});

module.exports = app;
