const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.user = require('./user.model');
db.role = require('./role.model');
db.products = require('./product.model');
db.shoppingcart = require('./shoppingcart.model');
db.cupon = require('./cupon.model');

db.ROLES = ["admin", "moderator", "user"];

module.exports = db;