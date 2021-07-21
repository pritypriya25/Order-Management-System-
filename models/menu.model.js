const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuSchema = new Schema({
  name: { type: String, unique: true, require: true },
  image: { type: String, require: true },
  price: { type: Number, require: true },
});

module.exports = mongoose.model("Menu", menuSchema, "Menu");
