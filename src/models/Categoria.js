const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CategoriaSchema = new Schema({
    descripcion:{
        type: String,
        required: [true, "Es necesaria la descripcion" ],
        unique: true
    },
    creador:{
        type: mongoose.Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('Categoria', CategoriaSchema);