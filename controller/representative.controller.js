const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')
const RepresentativeModel = require("../models/representative.model");
const VisitModel = require("../models/visits.model");
const ShopkeeperModel = require("../models/shopkeepers.model");
const OrderModel = require("../models/order.model");
const CartModel = require("../models/cart.model");

//LOGIN
async function login(req, res) {
  const body = req.body;
  const representative = await RepresentativeModel.findOne({
    email: body.email,
    password: body.password,
  });
  if (representative == null) {
    return res.status(400).json({ message: "Incorrect id and password" });
  }

  var token = jwt.sign(
    { _id: representative._id, email: representative.email },
    "Alexis"
  );
  console.log(token);
  return res.status(200).json({ token });
}

//ADD HIS DAILY VISITS
async function addVisits(req, res) {
  const visit = await VisitModel.findOne({ representative_id: req.user._id });
  const shop = await ShopkeeperModel.findOne({ shop_number: req.body.shopNo });
  if (shop == null) {
    return res.status(400).json({
      message: "The shop number provided is not registered under our services",
    });
  }
  if (shop._id != req.body.shopkeeperId) {
    return res.status(400).json({
      message: "The following shop number does'nt match the shopkeeperId",
    });
  }
  if (visit == null) {
    const visit = new VisitModel({
      representative_id: req.user._id,
      "visiting_details.0.shopNo": req.body.shopNo,
      "visiting_details.0.shopkeeperId": req.body.shopkeeperId,
    });
    return res.status(201).json(await visit.save());
  } else {
    const result = await VisitModel.findOneAndUpdate(
      {
        representative_id: req.user._id,
      },
      {
        $push: {
          visiting_details: { shopNo : req.body.shopNo , shopkeeperId: req.body.shopkeeperId }
        },
      }
    ).exec();  
    console.log(result)
    return res.status(200).json({ visit });
  }
}

//PLACE ORDER
async function placeOrder(req,res) { 
  const cart = await CartModel.findOne({ userID: req.user._id })
  //check if cart is empty or not
  if (cart == null) {
    return res.status(400).json({ message: "You cart is empty" });
  }
  //checking if representative have visited the shop or not
  const result = await VisitModel.findOne({
    "visiting_details.shopkeeperId": req.body.shopkeeperId,
    "visiting_details.shopNo": req.body.shopNo,
  }).exec();
  if (result == null) {
    return res
      .status(400)
      .json({ message: "You can only place order for shops you have visited" });
  }
  //placing order for representative
  const doc = new OrderModel({
    userID: req.user._id,
    order: cart.orders,
    shopNo: req.body.shopNo,
    amount: cart.amount,
    role : "representative" ,
    status: "pending",
  });
  return res.status(201).json(await doc.save());
}

//SHOWS ORDERSS
async function orders(req , res ){
const orders = await OrderModel.find({ userID : req.user._id })
if(orders == null ){
  return res.status(400).json({"message" : "You have not placed any orders yet"})
}
return res.status(200).json(orders)
}

module.exports = {
  login,
  addVisits ,
  orders , 
  placeOrder
};
