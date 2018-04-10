//CONNECTS TO OUR DATABASE

let mongoose  = require("mongoose");
let fs        = require("fs");
let path      = require("path");
let modelPath = path.join(__dirname,"./../models");

mongoose.connect("mongodb://localhost/login_registration");
mongoose.Promise = global.Promise;

fs.readdirSync(modelPath).forEach(function(file){
    if(file.indexOf(".js") >= 0){
        console.log(file);
        require(modelPath+"/"+file);
    }
})