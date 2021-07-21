const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const CartModel = require("../models/cart.model");
const ShopkeeperModel = require("../models/shopkeepers.model");
const OrderModel = require("../models/order.model");
const MenuModel = require("../models/menu.model");

//LOGIN
async function login(req, res) {
  const body = req.body;
  const shopkeeper = await ShopkeeperModel.findOne({
    email: body.email,
    password: body.password,
  });
  if (shopkeeper == null) {
    return res.status(400).json({ message: "Incorrect id and password" });
  }
  var token = jwt.sign(
    { _id: shopkeeper._id, email: shopkeeper.email },
    "Sasha"
  );
  console.log(token);
  return res.status(200).json({ token });
}

//PLACING ORDER
async function placeOrder(req, res) {
  const cart = await CartModel.findOne({ userID: req.user._id });
  //check if cart is empty or not
  if (cart == null) {
    return res.status(400).json({ message: "You cart is empty" });
  }
  //order placement for shopkeeper
  const shopkeeper = await ShopkeeperModel.findOne({ _id: req.user._id });
  if (shopkeeper != null) {
    const doc = new OrderModel({
      userID: req.user._id,
      order: cart.orders,
      shopNo: shopkeeper.shop_number,
      role : "shopkeeper" ,
      amount: cart.amount,
    });
    return res.status(201).json(await doc.save());
  }
}

//EMPTY CART
async function emptyCart(req, res) {
  try {
    const user = await CartModel.findById(req.user._id);
    const result = await user.remove();
    if (result._id) {
      return res.status(200).json({ message: `Your cart is empty now` });
    } else {
      return res.status(400).json({ message: `Something went wrong.` });
    }
  } catch (e) {
    return res.status(400).json({ message: `Something went wrong.` });
  }
}

//TRACK ORDER
async function orders(req, res) {
  const shop = await ShopkeeperModel.findById(req.user._id);
  const orders = await OrderModel.find({ shopNo: shop.shop_number });
  if (orders == null) {
    return res.status(400).json({
      message: "You don't haave any order placed by you or your representative",
    });
  }
  return res.status(200).json(orders);
}

//APPROVE REPRESENTATIVE ORDER
async function approveOrder(req, res) {
  const shop = await ShopkeeperModel.findById(req.user._id);   console.log(shop.shop_number)
  const orders = await OrderModel.find({ shopNo: shop.shop_number , userID : req.body.representativeID});  console.log(orders)
  if (orders == null) {
    return res.status(400).json({
      "message" : "You don't haave any order placed by you or your representative",
    });
  }
  if (orders.status == "orderPlaced") {
    return res.status(400).json({
      "message" : "You have updated the order of the following representative"
    });
  }
  const result = await OrderModel.findOneAndUpdate(
    { shopNo: shop.shop_number , userID : req.body.representativeID },
    { status : "orderPlaced" } 
  ).exec();
  return res.status(200).json({ message: "status updated" });
}

module.exports = {
  login,
  placeOrder,
  emptyCart,
  orders,
  approveOrder,
};
