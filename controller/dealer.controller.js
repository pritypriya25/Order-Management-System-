const jwt = require("jsonwebtoken")
var mongoose = require("mongoose")
const MenuModel = require('../models/menu.model')
const CartModel = require('../models/cart.model')
const DealerModel = require("../models/dealer.model")
const OrderModel = require("../models/order.model")

//LOGIN
async function login(req, res) {
  const body = req.body;
  const dealer = await DealerModel.findOne({
    email: body.email,
    password: body.password,
  });

  if (dealer == null) {
    return res.status(400).json({ message: "Incorrect id and password" });
  }

  var token = jwt.sign({ _id: dealer._id, email: dealer.email }, "Harry");
  console.log(token);
  return res.status(200).json({ token });
}

//TRACK ORDERS DONE BY SHOPKEEPERS AND REPRESENTATTIVE
async function trackOrder(req, res) {
  const order = await OrderModel.find();
  return res.status(200).json(order);
}

//UPDATE STATUS OF ORDERS OF REPRESENTATIVE AND SHOPKEEPERS
async function updateStatus(req, res) {
  //choose status between "order placed" , "shipped" , "dispatched" , "deliver"
  const result = await OrderModel.findById( req.body.orderId ); 
  if (result.status == null) {
    return res
      .status(400)
      .json({ message: "The provided order does'nt exist" });
  }
  if (result.status == "delivered") {
    return res
      .status(400)
      .json({
        message: "The order has been delivered. You cannot change the status",
      });
  }
  if (result.status == "pending") {
    return res
      .status(400)
      .json({
        message: "The order has to be first confirmed by the shopkeeper",
      });
  }
  const order = await OrderModel.findOneAndUpdate(
    { _id: req.body.orderId },
    { status: req.body.status }
  );
  return res.status(201).json({ message: "Status Updated" });
}

//ADD TO CART
async function addToCart(req, res) {
  const item = await MenuModel.findOne({ _id: req.body.productId });
  const user = await CartModel.findOne({ userID: req.user._id });
  const dealer = await DealerModel.findOne({ _id: req.user._id });
  //check if the product id feed is availiable in menu or not
  if (item == null) {
    return res
      .status(400)
      .json({ message: "We do not sell this product. Please refer to menu" });
  }
  //dealer will get product at 30% discount from admin
  var price =  item.price * req.body.quantity
  const discount = price - (price * 0.3)
  //check if the user has any item in cart // if not then create one
  if (user == null) {
    const order = new CartModel({
      _id: mongoose.Types.ObjectId(),
      userID: req.user._id,
      "orders.0.quantity": req.body.quantity,
      "orders.0.product": req.body.productId,
      amount: discount,
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
      amount: discount,
    },  };
  const result = await CartModel.updateOne(query, updatedDocument);
  console.log(result);
  //push the req body in the  following shopkeeper's cart if it does not exist then
  if (result.n == 0) {
    const update = await CartModel.updateOne(
      { userID: req.user._id },
      {
        $addToSet: {
          orders: { product: req.body.productId, quantity: req.body.quantity },
        },
        $inc: { amount: discount },
      }
    ).exec();
  }
  return res.status(200).json(user);
}

//PLACE ORDER
async function placeOrder(req, res) {
  const cart = await CartModel.findOne({ userID: req.user._id });
  //check if cart is empty or not
  if (cart == null) {
    return res.status(400).json({ message: "You cart is empty" });
  }
  //order placement for shopkeeper
    const doc = new OrderModel({
      userID: req.user._id,
      order: cart.orders,
      role : "dealer" ,
      amount: cart.amount,
    });
    return res.status(201).json(await doc.save());
  }

  // UNDELIVERED ORDERS OF REPRESENTATIVES AND SHOPKEEPERS
  async function undelivered( req, res ){
    const orders = await OrderModel.find({ role : "representative" || "shopkeeper"})
    console.log(orders)
    return res.status(200).json(orders)
  }


module.exports = {
  login,
  trackOrder,
  updateStatus,
  addToCart,
  placeOrder,
  undelivered
};
