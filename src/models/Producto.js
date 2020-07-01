const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ProductoSchema = new Schema({
    nombre:{
        type: String,
        required: [true, "Es necesario" ]
    },
    precio:{
        type: Number,
        required: [true, "El precio es obligatorio"]
    },
    descripcion:{
        type: String,
        required: false
    },
    categoria:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [true, 'Es obligatoria una categoria']
    },
    creador:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    disponible:{
        type: Boolean,
        default: true
    },
    creacion:{
        type:Date,
        default: Date.now()
    },
    img:{
        type: String,
        require: false
    }

});
module.exports = mongoose.model('Producto', ProductoSchema);