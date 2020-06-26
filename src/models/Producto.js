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
    cantidad:{
        type: Number,
        required: [true, "La cantidad es obligatoria" ]
    },
    creador:{
        type: mongoose.Schema.Types.ObjectId
    },
    creacion:{
        type:Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('Producto', ProductoSchema);