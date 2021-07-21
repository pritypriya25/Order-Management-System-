const jwt = require("jsonwebtoken");

const AdminModel = require('../models/admin.model')
const DealerModel = require('../models/dealer.model')
const ShopkeeperModel = require('../models/shopkeepers.model')
const RepresentativeModel = require('../models/representative.model')
const MenuModel = require('../models/menu.model')
const OrderModel = require('../models/order.model') 

//LOGIN
async function login(req, res) {
  const body = req.body;
  const admin = await AdminModel.findOne({
    email: body.email,
    password: body.password,
  });
  if (admin == null) {
    return res.status(400).json({ message: "Incorrect id and password" });
  }
  var token = jwt.sign({ _id: admin._id, email: admin.email }, "Prity");
  console.log(token);
  return res.status(200).json({ token });
}

//ADDING DEALER TO DB
async function addDealer(req, res) {
  const body = req.body;
  const doc = new DealerModel(body);
  return res.status(200).json(await doc.save());
}

//ADDING SHOPKEEPER TO DB
async function addShopkeeper(req, res) {
  const body = req.body;
  const doc = new ShopkeeperModel(body);
  return res.status(200).json(await doc.save());
}

//ADDING REPRESENTATIVE TO DB
function addRepresentative(req, res) {
  const body = req.body;
  const doc = new RepresentativeModel(body);
  console.log(doc)
  return res.status(200).json(doc.save());
}

//ADDING PRODUCTS TO THE MENU
async function addMenu(req, res , next ){
  const file = req.file    
  console.log(file)
  if (!file) {      
  const error = new Error('Please upload a file')     
  error.httpStatusCode = 400      
  return next("hey error")    
  }                  
  const menu = new MenuModel({   
    name : req.body.name ,
    price : req.body.price ,     
  image: file.originalname
  })
  console.log(file)
  return res.status(201).json(await menu.save())
  }

//CHECK FOR UNDELIVERED DEALER ORDER OF DEALER
async function undeliveredOrder( req , res){ 
const orders = await OrderModel.find({ role : 'dealer' , status : "orderPlaced" || "shipped" || "dispatched"}) 
console.log(orders)
if('orders.0.role' == null ){
  return res.status(200).json({"message" : "There is no undelivered orders"})
}
return res.status(200).json(orders)
}

//UPDATE ORDER STATUS FOR DEALER
async function updateStatus( req , res ){
  //choose status between "order placed" , "shipped" , "dispatched" , "deliver"
  const result = await OrderModel.findById( req.body.orderId )
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
  const order = await OrderModel.findOneAndUpdate(
    { _id: req.body.orderId },
    { status: req.body.status }
  ).exec();
  return res.status(201).json({ message: "Status Updated" });
}

module.exports = {
  login,
  addDealer,
  addShopkeeper,
  addRepresentative,
  addMenu,
  undeliveredOrder,
  updateStatus
};
