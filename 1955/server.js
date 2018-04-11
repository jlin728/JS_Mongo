var express     = require("express"),           // Require the Express Module
    app         = express(),                    // Create an Express App
    path        = require("path"),              // Require path
    bodyParser  = require("body-parser"),       // Require body-parser (to receive post data from clients)
    mongoose    = require("mongoose"),          // Require mongoose. Define after the app variable.
    port        = 8000,
    root        = __dirname;
    
app.use(bodyParser.json());     // step 1 - configure to use json
app.use(express.static(path.join(root, './static')));       
app.set('views', path.join(root, './views'));               
                            
// CONNECT Mongoose to MongoDB
// "basic_mongoose" is the name of our db in mongodb -- this should match the name of the db you are going to use for your project. If db does not exist, this will make one for you.
mongoose.connect("mongodb://localhost/1955");

// CREATE Mongoose schemas -- put below connect

var Schema = mongoose.Schema;           // required: define Schema variable

// define User Schema (collection)
var UserSchema = new mongoose.Schema({
    name: {type: String, required: true },
}, {timestamps: true });

// set our models by passing them their respective Schemas
mongoose.model('User', UserSchema);

// store our models in variables
var User = mongoose.model('User');

// ROUTES
// Root Request

// Respond with json data
app.get('/', function(req, res){
    User.find({}, function(err, users){
        if(err){
           console.log("Returned error", err);
            // respond with JSON
           res.json({message: "Error show all", error: err})
        }
        else {
            // respond with JSON
           res.json({message: "Success show all", data: users})
        }
     })
})

app.get('/new/:name/', function(req, res){
    let user = new User({name: req.params.name});
    user.save({}, function(err, users){
        if(err){
           //console.log("Returned error", err);
            // respond with JSON
           res.json({message: "Error save", error: err})
        }
        else {
            // respond with JSON
           res.json({message: "Success save", data: users})
        }
     })
})

app.get('/remove/:name', function(req, res){
    User.remove({name: req.params.name}, function(err, users){
        if(err){
           console.log("Returned error", err);
            // respond with JSON
           res.json({message: "Error remove", error: err})
        }
        else {
            // respond with JSON
           res.json({message: "Success remove", data: users})
        }
     })
})

app.get('/:name', function(req, res){
    User.findOne({name: req.params.name}, function(err, users){
        
        if(err){
           console.log("Returned error", err);
            // respond with JSON
           res.json({message: "Error findOne", error: err})
        }
        else {
            // respond with JSON
           res.json({message: "Success findOne", data: users})
        }
     })
})




// Setting our Server to Listen on Port: 8000
app.listen(port, function() {
    console.log(`server running on port ${ port }`);
    });
