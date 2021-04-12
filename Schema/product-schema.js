const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchemma = new Schema({
    title: {type: String, required: true},
    text: String,
    price: {type: Number, required: true},
    url: String
});


module.exports = mongoose.model('Product', productSchemma);