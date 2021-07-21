const mongoose = require('mongoose')
const Schema = mongoose.Schema

const representativeSchema = new Schema({
  representative_name: { type: String, unique: true, required: true },
  email : { type: String, unique: true , required: true},
  password : {type : String , required : true },
  role: { type: String, default: "representative", enum: ["admin" , "dealer" , "shopkeeper" , "representative"]}
});


//preventing others to see the password in response
representativeSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("Representative", representativeSchema, "Representative");