const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User= require("../model/User");


//!--register controller --- 
const register = asyncHandler(async(req, res)=>{
      const {username , email , password} = req.body;
      //validating fields
      if(!username || !email || !password){
          res.status(400);
          throw new Error("Please provide all fields for registration");
      }
      
      //check for email availability 
      const userExists = await User.findOne({email});
 
      if(userExists){
          res.status(400);
          throw new Error("User already exists");
      }
  
      //hashing the password 
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      //creating the new user in the database 
      const newUser = await User.create({
          username,
          email, 
          password:hashedPassword
      });
      
      //changing the trialRxpires of new user
      newUser.trialExpires = new Date(
          new Date().getTime() + newUser.trialPeriod * 24 * 60 *60 * 1000
      );
      await newUser.save();
  
      //sending the json response back 
      res.json({
          status:"successfulll",
          message:"user successfully registered",
          user: {
              username, 
              email,
          }
      })
  }
  )

//!--- Login Controller ---
const login = asyncHandler(async(req, res)=>{
    const {email , password} = req.body;
    
    //validating the fields 
    if(!email || !password){
        res.status(400);
        throw new Error("Please provide all fields for login")
    }

    //finding the user 
    const user = await User.findOne({email});
    if(!user){
        res.status(401);
        throw new Error("Invalid Credentials");
    }

    //checking if password matches
    const isMatched = await bcrypt.compare(password , user?.password);
    if(!isMatched) {
        res.status(401);
        throw new Error("Invalid Credentials");
    }

    //creating the jwt 
    const token = jwt.sign({id:user?._id},process.env.JWT_SECRET ,{
        expiresIn:"3d" //3 days 
    })
    // console.log(token);
    // storing the token in cookie 
    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge:24*60*60*1000 //1 day
    })

    //respond with json 
    res.json({
        status:"successfull",
        message:"successfully logged in",
        user:{
            username:user?.username,
            email:user?.email
        }
    })

})

//!---Logout Controller ---
const logout = asyncHandler(async(req, res)=>{
    res.cookie("token","",{maxAge:1});
    res.status(200).json({
        status:"successfull",
        message:"user logged out successfully"
    });
});

//!---userProfile---
const userProfile = asyncHandler(async(req,res)=>{
     const user = await User.findById(req?.user?._id).select("-password").populate("payments").populate("contentHistory");
     if(user){
        res.status(200).json({
            status:"successful",
            user
        });
     }
     else{
        res.status(404);
        throw new Error("User Not Found");
     }
})


//!-- checkAuthentictaion 
const checkAuth = asyncHandler(async(req , res)=>{
   const decoded = jwt.verify(req.cookies.token , process.env.JWT_SECRET);
   if(decoded){
    return res.json({
        isAuthenticated:true
    });
   }
   else{
    return res.json({
        isAuthenticated:false
    });
   }
});

//exporting the functions 
module.exports = {
   register ,
   login, 
   logout,
   userProfile,
   checkAuth,
}
