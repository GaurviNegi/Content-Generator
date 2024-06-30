const express = require("express");
const {register, login, logout, userProfile, checkAuth} = require("../controller/userController");
const isAuthenticated  = require("../middlewares/isAuthenticated");
const { historyController, deleteHistory } = require("../controller/historyController");
const userRouter = express.Router();

//!---registration route ----
userRouter.post("/register",register);
//!---Login route ---
userRouter.post("/login",login);
//!---Logout ---
userRouter.post("/logout",logout);

//!--userProfile---
userRouter.get("/user-profile", isAuthenticated , userProfile);

userRouter.get("/auth/check", isAuthenticated , checkAuth);

//!delete 
userRouter.delete("/history/delete/:id", isAuthenticated , deleteHistory);

//!--fetch history details 
userRouter.get("/history/:id", isAuthenticated , historyController);



//exporting  
module.exports = userRouter
