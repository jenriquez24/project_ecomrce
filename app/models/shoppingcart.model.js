const mongoose = require('mongoose');
const shoppingcart = mongoose.model(
    "shoppingcart",
    new mongoose.Schema({
        id: String,
        precio: Number,
        cantidad:Number,
        total: Number,
        userId : { type: mongoose.Schema.Types.ObjectId, ref: 'users', requierd:true},
       
    })
);

module.exports = shoppingcart;


