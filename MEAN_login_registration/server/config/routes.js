// ALL ROUTING
// CONTROLLERS

let mongoose = require("mongoose");
let userController = require("../controllers/userController.js");

module.exports = function(app){
    app.get("/", userController.index);
    app.post("/register", userController.register);
    app.post("/login", userController.login);


};