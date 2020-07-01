const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let UsuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, "Es necesario" ]
    },
    correo:{
        type: String,
        required: [true, "El Obligatorio"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Es Obligatorio"],
    },
    telefono:{
        type:Number,
        required: false
    },
    google : {
        type:Boolean,
        default:false
    },
    img:{
        type: String,
        require: false
    }

});



UsuarioSchema.methods.toJSON = function (){
    let user = this;
    let userObj = user.toObject();
    delete userObj.password;
    return userObj;
}

UsuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'});

module.exports = mongoose.model('Usuario',UsuarioSchema )