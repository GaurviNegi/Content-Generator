const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../model/Payment");
const shouldRenewSubscriptionPlan = require("../utils/shouldRenewSubscriptionPlan");
const calculateNextBillingDate = require("../utils/calculateNextBillingDate");
const User = require("../model/User");


//!stripe payments 
const handleStripePayment = asyncHandler(async(req , res)=>{
   const {amount , subscriptionPlan} = req.body;
   const user = req?.user
   try{
      const paymentIntent = await stripe.paymentIntents.create({
        amount:Number(amount)*100,
        currency:'usd',
        //add data to metha object
        metadata:{
          userId:user?._id.toString(),
          userEmail:user?.email,
          subscriptionPlan,
        }
      });

    //   console.log(paymentIntent);

      //sending the reposne 
      res.json({
        clientSecret:paymentIntent.client_secret,
        paymentId: paymentIntent.id,
        metadata: paymentIntent.metadata
      });
   }catch(error){
      res.status(500).json({error:error.message});
   }
});

//! verify payment to make the changes and updates on the user and payment db 
const verifyPayment = asyncHandler(async(req, res)=>{
 const {paymentId} = req.params;
 try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId)
    if(paymentIntent.status==="succeeded"){
    const metadata = paymentIntent?.metadata;
    const subscriptionPlan  = metadata?.subscriptionPlan;
    const userEmail = metadata?.userEmail;
    const userId = metadata?.userId;

    //finding the user from teh db 
    const userFound = await User.findById(userId);
    if(!userFound){
        return res.status().json({
            status:false,
            error:"User not found"
        });

    }

    //if userfound 
    const amount = paymentIntent?.amount/100;
    const currency = paymentIntent?.currency;
    const payId = paymentIntent?.id;

    //create the payment history 
    const newPayment = await Payment.create({
        user:userId,
        subscriptionPlan,
        amount,
        currency,
        status:"success",
        reference:payId
    });

    //updating the user 
    if(subscriptionPlan === "Basic"){
      
       const updatedUser = await User.findByIdAndUpdate(userId,{
        subscriptionPlan,
        apiRequestCount:0,
        monthlyRequestCount:50,
        trialPeriod:0,
        nextBillingDate:calculateNextBillingDate(),
        $addToSet:{
            payments:newPayment?._id
        }
       },{new:true}).select("-password");

       //sending the response 
       return res.json({
        status:true,
        message:"Payment verified , User updated",
        updatedUser
       });
    }

    if(subscriptionPlan === "Premium"){
        const updatedUser = await User.findByIdAndUpdate(userId,{
            subscriptionPlan,
            apiRequestCount:0,
            monthlyRequestCount:100,
            trialPeriod:0,
            nextBillingDate:calculateNextBillingDate(),
            $addToSet:{
                payments:newPayment?._id
            }
           },{new:true}).select("-password");
    
           //sending the response 
           return res.json({
            status:true,
            message:"Payment verified , User updated",
            updatedUser
           });
    }
}
 } catch (error) {
    console.log(error)
     return res.status(500).json({
      error:error.message,
     });
 }
});

//! handle free subscription 
//!it is required bcz for amount 0 payment for free plan stripe would give error
const handleFreeSubscription = asyncHandler(async(req , res)=>{
    //get the login user 
    const user = req?.user

    try {
        if(shouldRenewSubscriptionPlan(user)){
          //make changes according to the new plan
           user.subscriptionPlan = "Free",
           user.monthlyRequestCount = 5,
           user.apiRequestCount = 0 ;
           user.nextBillingDate = calculateNextBillingDate(); 
          
           //make playment and save it into the db 
           const newPayment  = await Payment.create({
            user:user?._id,
            amount:0,
            subscriptionPlan:"Free",
            status:"success",
            monthlyRequestCount: 5,
            reference : Math.random().toString(36).substring(7),
            currency:'usd'
           });

           user.payments.push(newPayment?._id);
           //saving all updated data 
           await user.save();

           //sending the reponse 
           res.json({
            status :"successfull",
            message:"subscription plan changed successfully",
            user,
           });
        }
        else{
            return res.status(403).json({message:"subscription renewal not due yet"});
        }
    } catch (error) {
            return res.status(500).json({message:error.message});
    }
    
});


module.exports = {handleStripePayment, handleFreeSubscription , verifyPayment};