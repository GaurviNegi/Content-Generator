const asyncHandler  = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../model/User");


const isAuthenticated = asyncHandler(async(req, res, next)=>{
   if(req.cookies.token){
    //verifying the jwt token 
    const decoded = jwt.verify(req.cookies.token , process.env.JWT_SECRET);

    //storing the data in the req.user 
    req.user = await User.findById(decoded?.id).select("-password");
    return next();
   }
    else{
    return res.status(401).json({
          message:"user not authenticated to view this page."
        });
    }
});

module.exports = isAuthenticated ;