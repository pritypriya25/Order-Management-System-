const routes = require('express').Router()
const representativeAUTH = require("../middleware/representativeAuth");
const RepresentativeController = require("../controller/representative.controller");
const CommonController = require("../controller/common.controller")

routes.post('/login' , RepresentativeController.login)
routes.get('/getMenu' , representativeAUTH , CommonController.getMenu)
routes.post( '/addToCart', representativeAUTH, CommonController.addToCart);
routes.post( '/placeOrder', representativeAUTH, RepresentativeController.placeOrder);
routes.post('/addVisit', representativeAUTH, RepresentativeController.addVisits);
routes.get( '/orders', representativeAUTH, RepresentativeController.orders);
routes.delete( '/emptyCart',  representativeAUTH, CommonController.emptyCart);

module.exports = routes;