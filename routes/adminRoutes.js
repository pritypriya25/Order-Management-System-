const express = require('express')
const routes = express.Router()
const multer = require('multer');
const path= require('path')
const adminAUTH = require('../middleware/adminAuth');
const AdminController = require('../controller/admin.controller')


routes.post('/login', AdminController.login);
routes.post('/addDealer', adminAUTH , AdminController.addDealer)
routes.post('/addShopkeeper', adminAUTH, AdminController.addShopkeeper)
routes.post('/addRepresentative', adminAUTH, AdminController.addRepresentative)
routes.get('/undeliveredOrder' , adminAUTH, AdminController.undeliveredOrder)
routes.post('/updateStatus' , adminAUTH , AdminController.updateStatus)
routes.use('/addMenu' , express.static(__dirname+'../uploads'))
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../uploads/'))
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  })
  var upload = multer({ storage: storage })
routes.post('/addMenu', upload.single('image') , AdminController.addMenu)

module.exports = routes;