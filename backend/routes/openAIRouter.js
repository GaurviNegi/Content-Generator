const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const checkAPIRequestLimit = require("../middlewares/checkAPIRequestLimit");
const {openAIController} = require("../controller/openAIController");
const openAIRouter = express.Router();

openAIRouter.post("/generate-content", isAuthenticated ,checkAPIRequestLimit, openAIController);

module.exports = openAIRouter;