const routes = require('express').Router()
const dealerAUTH = require('../middleware/dealerAuth');
const DealerController = require('../controller/dealer.controller')
const CommonController = require('../controller/common.controller')

routes.post('/login', DealerController.login)
routes.get('/getMenu' , dealerAUTH , CommonController.getMenu)
routes.post('/addToCart' , dealerAUTH , DealerController.addToCart)
routes.get('/orders', dealerAUTH, DealerController.trackOrder)
routes.post('/updateStatus', dealerAUTH, DealerController.updateStatus)
routes.post('/placeOrder' , dealerAUTH , DealerController.placeOrder)
routes.delete('/emptyCart' , dealerAUTH , CommonController.emptyCart)
routes.get('/yetToBeDelivered' , dealerAUTH , DealerController.undelivered)

module.exports = routes;
