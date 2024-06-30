const asyncHandler = require("express-async-handler");
const ContentHistory = require("../model/ContentHistory");
const mongoose = require("mongoose");

const historyController = asyncHandler(async(req,res)=>{
   const id = req?.params;
   
   const historyItem = await ContentHistory.findById(new mongoose.Types.ObjectId(id));

   if(!historyItem){
    throw new Error("history not found");
   }

  if(req?.user?._id.toString() === historyItem?.user.toString() ){
   res.json({   
    status: "success",
    message:"history successfully fetched",
    historyItem
   });
}
   else{
    throw new Error("not authorized to view this history");
   }
})





const deleteHistory = asyncHandler(async(req,res)=>{
    const id = req?.params;
    
    const historyItem = await ContentHistory.findById(new mongoose.Types.ObjectId(id));

 
   if(req?.user?._id.toString() === historyItem?.user.toString() ){
   const deleted = await ContentHistory.deleteOne(historyItem);
   console.log(deleted);
   if(deleted){
    res.json({   
     status: "success",
     message:"successfull delete operation",
    });}
    else{
        throw new Error("Failed delete operation");
    }
 }
    else{
     throw new Error("not authorized to view this history");
    }
 })

module.exports = {historyController , deleteHistory}