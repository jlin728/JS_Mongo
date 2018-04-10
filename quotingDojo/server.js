var express     = require("express"),           // Require the Express Module
    app         = express(),                    // Create an Express App
    path        = require("path"),              // Require path
    bodyParser  = require("body-parser"),       // Require body-parser (to receive post data from clients)
    mongoose    = require("mongoose"),          // Require mongoose. Define after the app variable.  
//    session     = require("express-session"),
    port        = 8000,
    root        = __dirname;
    

app.use(bodyParser.urlencoded({ extended: true }));         
app.use(express.static(path.join(root, './static')));       
app.set('views', path.join(root, './views'));               
app.set('view engine', 'ejs');                              

// CONNECT Mongoose to MongoDB
// "basic_mongoose" is the name of our db in mongodb -- this should match the name of the db you are going to use for your project. If db does not exist, this will make one for you.
mongoose.connect("mongodb://localhost/quotingDojo");

// CREATE Mongoose schemas -- put below connect
var UserSchema = new mongoose.Schema({                      
    name: { type: String, required: true, minlength: 3},    
    comment:  { type: String, min: 1, max: 256},                       
    },
    {timestamps: true},
);
mongoose.model("User", UserSchema);  // Setting this Schema in our Models as 'User' -- mongoose.model() takes bluerint object and creates db collection out of the model.
var User = mongoose.model("User")    // Retrieving this Schema from our Models, named 'User'


// ROUTES
// Root Request
app.get("/", function(req, res) {
    
    res.render("index");
})

// ADD USER REQUEST

// When the user presses the submit button on index.ejs, it should send a post request to '/users'.  In this route we should add the user to the database and then redirect to the root route (index view).
app.post("/quotes", function(req, res) {
    console.log("POST DATA", req.body);
        // This is where we would add the user from req.body to the database.
        // create a new User with data corresponding to those from req.body
    var user = new User({name: req.body.name, comment: req.body.comment});
    // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    user.save(function(err) {
        if(err) {                                 // if there is an error, console.log that something went wrong!
            console.log("Something went wrong");
            res.redirect("/");
        } else {                                  // else, console.log success, then redirect to the root
            console.log("Successfully added a comments!");
            res.redirect("/");
        }
    })
})

app.get("/quotes", function(req, res) {
    User.find({}, function(err, users) {                // NOT SURE WHAT THE ERR WOULD BE ; {} will return all data.
        if (err) {
            console.log("No User");
            res.render("index", {errors:users.errors});
        } else {
            res.render("quotes", {users: users});     // HOW TO PASS INFO TO HTML???
        }
    })
})




// Setting our Server to Listen on Port: 8000
app.listen(port, function() {
    console.log(`server running on port ${ port }`);
    });






