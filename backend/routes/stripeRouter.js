const express = require("express");
const {handleStripePayment, handleFreeSubscription , verifyPayment} = require("../controller/stripePaymentController");
const isAuthenticated  = require("../middlewares/isAuthenticated");
const stripeRouter = express.Router();


//!--userProfile---
stripeRouter.post("/checkout", isAuthenticated , handleStripePayment);
stripeRouter.post("/free-plan", isAuthenticated , handleFreeSubscription);
stripeRouter.post("/verify-payment/:paymentId", isAuthenticated , verifyPayment);
//exporting  
module.exports = stripeRouter
