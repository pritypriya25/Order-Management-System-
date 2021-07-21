const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adminSchema = new Schema({
  name: { type: String, unique: true, required: true },
  email : { type: String, unique: true , required: true},
  password : {type : String , required : true },
  role: { type: String, default: "admin", enum: ["admin" , "dealer" , "shopkeeper" , "representative"]}
});


module.exports = mongoose.model("Admin", adminSchema, "Admin");