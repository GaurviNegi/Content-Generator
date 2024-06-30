const asyncHandler = require("express-async-handler");
const User = require("../model/User");

const checkAPIRequestLimit = asyncHandler(async(req, res , next)=>{
 if(!req.user){
   return res.status(401).json({message:"user not authorized"});
 }

 const user = await User.findById(req?.user?._id);
 if(!user){
   return res.status(404).json({message:"user not found"});
 }

 
 let requestLimit = 0;
 //checking if users apirequest limit 
 if(user?.trialActive){requestLimit = user?.monthlyRequestCount;} 
 

 //checking if request limit exceeds or not 
 if(user?.apiRequestCount >= user?.requestLimit){
  throw new Error("API request Limit has been reached ... ");
 }

 
 next();
});



module.exports = checkAPIRequestLimit;