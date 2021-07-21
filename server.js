const express = require("express");
const app = express();
const morgan = require('morgan')
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");

const adminRoute = require('./routes/adminRoutes')
const dealerRoute = require('./routes/dealerRoutes')
const shopkeeperRoute = require('./routes/shopkeeperRoutes')
const representativeRoute = require('./routes/representativeRoutes')

require("./utils/database");
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/admin' , adminRoute)
app.use('/dealer' , dealerRoute)
app.use('/shopkeeper' , shopkeeperRoute)
app.use('/representative' , representativeRoute)

//ERROR HANDLING FOR UNKNOWN ROUTES
app.use((req, res, next) => {
  const error = new Error("Not Found");
  errror.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
