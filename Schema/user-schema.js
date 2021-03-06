const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    productcart: [
      {
        title : {type: String},
        number: {type: Number},
        price: {type: Number},
        url: {type: String},
        checked: {type: Boolean}
     }
    ],
    productordering: [
      {
        title : {type: String},
        number: {type: Number},
        price: {type: Number},
        url: {type: String},
        date: {type: Date, default: Date.now()}
     }
     ],
     productfinished:[
      {
        title : {type: String},
        number: {type: Number},
        price: {type: Number},
        url: {type: String},
        date: {type: Date, default: Date.now()}
     }
     ]
  });
  
  module.exports = mongoose.model('User', userSchema);