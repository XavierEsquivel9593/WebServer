const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let Usuario = require('../models/Usuario');

app.post('/login',(req, res)=> {
    let {correo, password} = req.body;

    Usuario.findOne({correo:correo}, (err, usuarioDB)=>{
       
        //Validar 
        //Validar El error 
        if(err){
            return res.status(500).json({
                err
            })
        }

        //Validar Si el usuario existe 
         if(!usuarioDB){
            return res.status(400).json({
               ok:false,
               err:{
                   msj:"Usuario no encontrado"
               }
           }); 
       }  

         //Validar Si la contraseña coicide 
         if(!bcrypt.compareSync(password, usuarioDB.password)){
            return res.status(401).json({
                ok:false,
                err:{
                    msj:"Contraseña erronea"
                }
            }); 
         } 
        
         let token = jwt.sign({
            usuarioDB
          }, process.env.SECRETO , { expiresIn: process.env.TIEMPO });

         res.status(200).json({
             ok:true,
             usuario:usuarioDB,
             token
         })
         

    });

})


module.exports= app;