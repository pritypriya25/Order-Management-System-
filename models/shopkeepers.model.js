const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shopkeeperSchema = new Schema({
  shop_name: { type: String, unique: true, required: true },
  shop_number : { type : Number, unique : true, required : true},
  owner_name : { type: String, unique: true, required: true },
  email : { type: String, unique: true , required: true},
  address : { type: String, unique: true, required: true },
  password : {type : String , required : true },
  role: { type: String, default: "shopkeeper", enum: ["admin" , "dealer" , "shopkeeper" , "representative"]}
});


//preventing others to see the password in response
shopkeeperSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("Shopkeeper", shopkeeperSchema, "Shopkeeper");