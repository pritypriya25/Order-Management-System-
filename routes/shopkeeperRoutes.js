const routes = require('express').Router()
const shopkeeperAUTH = require("../middleware/shopkeeperAuth")
const ShopkeeperController = require("../controller/shopkepper.controller")
const CommonController = require('../controller/common.controller')

routes.post('/login', ShopkeeperController.login)
routes.get('/getMenu' , shopkeeperAUTH , CommonController.getMenu)
routes.post('/addToCart', shopkeeperAUTH, CommonController.addToCart)
routes.post('/placeOrder', shopkeeperAUTH, ShopkeeperController.placeOrder)
routes.delete('/emptyCart', shopkeeperAUTH, CommonController.emptyCart)
routes.get('/orders', shopkeeperAUTH, ShopkeeperController.orders)
routes.post('/approveRepresentative', shopkeeperAUTH, ShopkeeperController.approveOrder)

module.exports = routes;