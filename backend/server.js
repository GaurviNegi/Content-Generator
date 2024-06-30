require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const connectDB = require("./utils/connectDB");
const errorHandler = require('./middlewares/errorHandler');
const openAIRouter = require('./routes/openAIRouter');
const stripeRouter = require("./routes/stripeRouter");
const User = require("./model/User");
connectDB();

const PORT = process.env.PORT || 5000;
const app = express();


//!---cron for ending trial plan ---
cron.schedule("0 0 * * * * " ,async()=>{
    const today = new Date();
    console.log(today);
    try {
        const updatedUser = await User.updateMany({
            trialActive:true,
            trialExpires:{$lt:today}
             },{
             
               trialActive:false,
               subscriptionPlan:"Free" ,
               monthlyRequestCount:5
             });

             console.log(updatedUser);
    } catch (error) {
        console.log(error);
    }
})
//!---cron for ending the paid plan 
//?for free plan  checking every day of month 
cron.schedule("0 0 1 * * * " ,async()=>{
    const today = new Date();1
    try {
        const updatedUser = await User.updateMany({
            subscriptionPlan:"Free",
            nextBillingDate:{$lt:today}
             },{
               monthlyRequestCount:0
             });

             console.log(updatedUser);
    } catch (error) {
        console.log(error);
    }
})

//?for Basic checking every day of month 
cron.schedule("0 0 1 * * * " ,async()=>{
    const today = new Date();1
    try {
        const updatedUser = await User.updateMany({
            subscriptionPlan:"Basic",
            nextBillingDate:{$lt:today}
             },{
               monthlyRequestCount:0
             });

             console.log(updatedUser);
    } catch (error) {
        console.log(error);
    }
})

//?for premium checking every day of month
cron.schedule("0 0 1 * * * " ,async()=>{
    const today = new Date();1
    try {
        const updatedUser = await User.updateMany({
            subscriptionPlan:"Basic",
            nextBillingDate:{$lt:today}
             },{
               monthlyRequestCount:0
             });

             console.log(updatedUser);
    } catch (error) {
        console.log(error);
    }
})


//!----middlewares---
app.use(express.json()); 
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))

//!---Routes---
app.use("/api/v1/users",userRouter);
app.use("/api/v1/openai",openAIRouter);
app.use("/api/v1/stripe",stripeRouter);

//!---errorHandler
app.use(errorHandler);


//listening to the serve 
app.listen(PORT, ()=>{
    console.log(`server running on PORT ${PORT}`);
});
