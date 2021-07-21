const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
  userID : { type : String } ,
  shopNo : { type : Number } ,
  order  : [ ] ,
  amount : { type : Number }, 
  role : { type : String } ,
  status: { type: String, default: 'orderPlaced', enum: ["pending" ,"orderPlaced" , "shipped" , "dispatched" , "delivered" ]} ,
},{timestamps: true});

orderSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.role;
  return obj;
};

module.exports = mongoose.model("Order", orderSchema, "Order");