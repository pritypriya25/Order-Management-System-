const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const CartModel = require("../models/cart.model");
const OrderModel = require("../models/order.model");
const MenuModel = require("../models/menu.model");

//ADD TO CART
async function addToCart(req, res) {
    const item = await MenuModel.findOne({ _id: req.body.productId });
    const user = await CartModel.findOne({ userID: req.user._id });

    //check if the product id feed is availiable in menu or not
    if (item == null) {
      return res
        .status(400)
        .json({ message: "We do not sell this product. Please refer to menu" });
    }
  
    //check if the user cart is empty or not
    if (user == null) {
      const order = new CartModel({
        _id: mongoose.Types.ObjectId(),
        userID: req.user._id,
        "orders.0.quantity": req.body.quantity,
        "orders.0.product": req.body.productId,
        amount: item.price * req.body.quantity,
      });
      return res.status(201).json(await order.save());
    }

    //increase the quantity of the product if it already exist in the cart
    const query = {
      userID: req.user._id,
      "orders.product": req.body.productId,
    };
    const updatedDocument = {
      $inc: {
        "orders.$.quantity": req.body.quantity,
        amount: item.price * req.body.quantity,
      },
    };
    const result = await CartModel.updateOne(query, updatedDocument);
    console.log(result);
    
    //push the req body in the  following user's cart if it does not exist then
    if (result.n == 0) {
      const update = await CartModel.updateOne(
        { userID: req.user._id },
        {
          $addToSet: {
            orders: { product: req.body.productId, quantity: req.body.quantity },
          },
          $inc: { amount: item.price * req.body.quantity },
        }
      ).exec();
    }
    return res.status(200).json(user);
  }
  
  //EMPTY CART
async function emptyCart(req, res) {
    const user = await CartModel.findOneAndRemove({userID : req.user._id}).exec()
    if(user == null){
      return res.status(400).json({ "message" : "Your cart is already empty"})
    }
      return res.status(200).json({ message: `Your cart is empty now` });
  
}

//Get Menu
async function getMenu(req, res) {
  const menu = await MenuModel.find();
  return res.status(200).json(menu);
}

  module.exports = {
      addToCart ,
      emptyCart ,
      getMenu
  }