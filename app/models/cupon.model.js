const mongoose = require('mongoose');
const cupon = mongoose.model(
    "cupon",
    new mongoose.Schema({
        id: String,
        Name:String,
        descuento:Number,
        estado: Boolean
        },
    )
);

module.exports = cupon;
