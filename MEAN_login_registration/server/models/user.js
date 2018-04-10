let mongoose = require ("mongoose");

let User = mongoose.model("User", new mongoose.Schema({
    name: {type: String, required: true, minlength: 2, maxlength: 100},
    email: {type: String, required: true, minlength: 2, maxlength: 100},
    password: {type: String, required: true, minlength: 8, maxlength: 1024},
}, {timestamps: true} ));

