const express = require('express');
const app = express();
const Categoria = require('../models/Categoria');
const { verificaToken } = require('../middleware/autenticacion');
//verifica token
//modelo categoria
//mostrar todas categorias get
app.get('/categoria',verificaToken, (req,res) => {
    Categoria.find({}, (err, categorias) => {
        if(err){
            return res.status(500).json({
                err
            });
        }
        res.status(200).json({
            ok:true,
            categorias
        })
    });
}); 

//mostrar categoria especifica por id findbyid
app.get('/categoria/:id', verificaToken,(req, res) => {
    let id = req.params.id;
    let usuarioid = req.usuario._id;
    let body = req.body;

    let categoria = new Categoria(body);




    Categoria.findById(id, (err, categoriaID) => {
        if (err) {
            return res.status(500).json({
                err
            })
        }

        if (!categoriaID) {
            return res.status(400).json({
                ok: false,
                err: {
                    msj: "Categoria no encontrada"
                }
            })
        }

        res.status(200).json({
            ok: true,
            categoriaID
        })
    });
});

//crear categoria
app.post('/categoria',verificaToken,(req, res) => {
    let body = req.body;
    let usuarioid = req.usuario._id;
    let categoria = new Categoria(body);
    categoria.creador = usuarioid;

    categoria.save((err, categoriadb) => {
        if (err) {
            return res.status(500).json({
                err
            })
        }
        res.status(200).json({
            ok: true,
            categoriadb
        })
        //console.log(categoriadb);
    })
});

//elimnar categoria
app.delete('/categoria/:id', verificaToken, (req, res) => {
    let usuarioid = req.usuario._id;
    let id = req.params.id;

    Categoria.findOne({ _id: id }, (err, categoriaDB) => {
        if (!(categoriaDB.creador.toString() === usuarioid.toString())) {
            return res.status(400).json({
                msj: 'No tienes permitido eliminar la categoria'
            })
        } 

        Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {
            if (err) {
                return res.status(500).json({
                    err
                })
            }
    
            if (!categoriaBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        msj: "categoria no encontrada"
                    }
                })
            }
    
            res.status(200).json({
                ok: true,
                categoriaBorrado
            })
        });
    });  
});

module.exports= app;