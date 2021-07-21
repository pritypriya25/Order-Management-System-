const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dealerSchema = new Schema({
  name : { type : String, unique : true, required : true },
  email : { type : String, unique : true, required : true },
  password : { type : String, required : true },
  role: {
    type : String,
    default : "dealer",
    enum : ["admin", "dealer", "shopkeeper", "representative"],
  },
});

//preventing others to see the password in response
dealerSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("Dealer", dealerSchema, "Dealer");
