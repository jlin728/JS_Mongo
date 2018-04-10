var express     = require("express"),           // Require the Express Module
    app         = express(),                    // Create an Express App
    path        = require("path"),              // Require path
    bodyParser  = require("body-parser"),       // Require body-parser (to receive post data from clients)
    mongoose    = require("mongoose"),          // Require mongoose. Define after the app variable.  
//    session     = require("express-session"),
    port        = 8000,
    root        = __dirname;
    

app.use(bodyParser.urlencoded({ extended: true }));         // Integrate body-parser with our App
app.use(express.static(path.join(root, './static')));       // Setting our Static Folder Directory
app.set('views', path.join(root, './views'));               // Setting our Views Folder Directory
app.set('view engine', 'ejs');                              // Setting our View Engine set to EJS -- make sure not to have "index.html" file bc Express will read that before index.ejs

// CONNECT Mongoose to MongoDB
// "basic_mongoose" is the name of our db in mongodb -- this should match the name of the db you are going to use for your project. If db does not exist, this will make one for you.
mongoose.connect("mongodb://localhost/basic_mongoose");

// CREATE Mongoose schemas -- put below connect
var UserSchema = new mongoose.Schema({                      // Takes JSON object as parameter
    name: { type: String, required: true, minlength: 6},    // Structure of each new document will be formatted
    age:  { type: Number, min: 1, max: 150},                // Validations
    },  {timestamps: true}
);
mongoose.model("User", UserSchema);  // Setting this Schema in our Models as 'User' -- mongoose.model() takes bluerint object and creates db collection out of the model.
var User = mongoose.model("User")    // Retrieving this Schema from our Models, named 'User'


// ROUTES
// Root Request
app.get("/", function(req, res) {
    User.find({}, function(err, users) {                // NOT SURE WHAT THE ERR WOULD BE ; {} will return all data.
        if (err) {
            console.log("No User");
            res.render("index", {errors:users.errors});
        } else {
            res.render("index", {users: users});     // HOW TO PASS INFO TO HTML???
        }
    })
})

// ADD USER REQUEST

// When the user presses the submit button on index.ejs, it should send a post request to '/users'.  In this route we should add the user to the database and then redirect to the root route (index view).
app.post("/users", function(req, res) {
    console.log("POST DATA", req.body);
        // This is where we would add the user from req.body to the database.
        // create a new User with data corresponding to those from req.body
    var user = new User({name: req.body.name, age: req.body.age});
    // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    user.save(function(err) {
        if(err) {                                 // if there is an error, console.log that something went wrong!
            console.log("Something went wrong");
            res.redirect("/");
        } else {                                  // else, console.log success, then redirect to the root
            console.log("Successfully added a user!");
            res.redirect("/");
        }
    })
})



// Setting our Server to Listen on Port: 8000
app.listen(port, function() {
    console.log(`server running on port ${ port }`);
    });




//Sessions:

//app.use(session({secret: "12346"}));

// app.post('/submit', function(req, res) {
//     req.session.name = req.body.name;
//     req.session.location = req.body.location;
//     req.session.language = req.body.language;
//     req.session.comment = req.body.comment;
//     console.log("Post data", req.body)
//     res.redirect("result");
// });

// app.get("/result", function(req, res){
//     res.render("result", {user: req.session});
// });




