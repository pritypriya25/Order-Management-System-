const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = mongoose.Schema({
  product : { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required : true},
  quantity: { type: Number,  default : 1 }
})

const CartSchema = new Schema({
  _id : mongoose.Schema.Types.ObjectId , 
  userID : {type : String } ,
  orders : [itemSchema],
  amount : {type : Number }
});

module.exports = mongoose.model("Cart", CartSchema, "Cart");