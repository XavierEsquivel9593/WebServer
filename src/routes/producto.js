const express = require('express');
const app = express();

const {verificaToken} = require('../middleware/autenticacion');
//Modelos 
let Producto = require('../models/Producto');

app.get('/producto',verificaToken, function (req, res) {

    let pagina = req.query.pagina || 0 ;  
    pagina= Number(pagina);
  

    //Cantidad a imprimir
    let cantidad = req.query.cantidad || 4;
    cantidad= Number(cantidad);

    Producto.find({cantidad:3}, 'nombre precio cantidad')
        .skip(pagina) 
        .limit(cantidad)
        .exec((err, productos)=> {
            if(err){
                return res.status(500).json({
                    err
                })
            }
            Producto.countDocuments({}, (err, conteo) => {
                res.status(200).json({
                    ok:true,
                    productos,
                    conteo
                })
            });
        });
});

app.post('/producto', function (req, res) {
    let body = req.body;

    //Guardar en DB 
    let producto =  new Producto(body);
    producto.save((err, producto) => {
        if(err){
            return res.status(500).json({
                err
            })
        }
        res.status(200).json({
            ok:true,
            producto
        })
    }); 
});

app.put('/producto/:id', function(req, res)  {
    let id = req.params.id;
    let body =_.pick(req.body, ['nombre', 'precio']);

    Producto.findByIdAndUpdate(id, body, {new:true, runValidators:true  }, (err, productoDB) => {
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

app.delete('/producto/:id', function(req, res)  {
    let id = req.params.id;

    Producto.findByIdAndRemove(id , (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                err
            })
        }

        if(!productoBorrado){
            return res.status(400).json({
                ok:false,
                err:{
                    msj:"Producto no encontrado"
                }
            })
        }

        res.status(200).json({
            ok:true,
            productoBorrado
        })
    })
});

module.exports=app;
