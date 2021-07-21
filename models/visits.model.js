const mongoose = require('mongoose')
const Schema = mongoose.Schema

const visit = new Schema({
 shopNo : { type : Number , required : true , required : true },
 shopkeeperId : {type: mongoose.Schema.Types.ObjectId, ref: 'Shopkeeper', required : true} ,
date : { type: Date , default : new Date()} 
}) 

const visitSchema = new Schema({
  representative_id: { type: String, unique: true },
  visiting_details : [ visit ] 
});


module.exports = mongoose.model("Visit", visitSchema, "Visit");