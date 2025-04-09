const mongoose= require('mongoose');
const product = mongoose.model(
    "product",
    new mongoose.Schema({
        id: String,
        nombre: String,
        descripcion: String,
        precio: Number,
        categoria: String,
        stock: Number
    })
);
module.exports = product;