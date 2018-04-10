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
mongoose.connect("mongodb://localhost/msgBoard");

// CREATE Mongoose schemas -- put below connect
// define Schema variable
var Schema = mongoose.Schema;

// define Post Schema (collection)
var PostSchema = new mongoose.Schema({
    name: {type: String, required: true }, 
    post: {type: String, required: true }, 
    _comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
}, {timestamps: true });

// define Comment Schema
var CommentSchema = new mongoose.Schema({
 _post: {type: Schema.Types.ObjectId, ref: 'Post'},     //Foreign key
 name: {type: String, required: true }, 
 comment: {type: String, required: true }
}, {timestamps: true });
// set our models by passing them their respective Schemas
mongoose.model('Post', PostSchema);
mongoose.model('Comment', CommentSchema);

// store our models in variables
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

// ROUTES
// Root Request
app.get("/", function(req, res) {
    console.log("In root route");
    Post.find({})
    .populate('_comments')
    .exec(function(err, posts) {
        if (err) {
            console.log("Error");
            res.render("index", {errors:users.errors});
        } else {
            console.log("whataever");
            res.render("index", {posts: posts});
        }
    });
})

app.post("/newmsg", function(req, res) {
    console.log("POST DATA", req.body);
        // This is where we would add the user from req.body to the database.
        // create a new User with data corresponding to those from req.body
    var post = new Post({name: req.body.name, post: req.body.post});
    // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    post.save(function(err) {
        if(err) {                                
            console.log("Something went wrong in newmsg");
            res.redirect("/");
        } else {                                 
            console.log("Successfully added a post!");
            res.redirect("/");
        }
    })
})

// route for creating one comment with the parent post id
app.post('/newcomm/:id', function (req, res){
    Post.findOne({_id: req.params.id}, function(err, post){
           var comment = new Comment(req.body);
           console.log("POST DATA", req.body);
           comment._post = post._id;
           post._comments.push(comment);
           comment.save(function(err){
                  post.save(function(err){
                      if(err) { console.log('Error'); } 
                      else { console.log("Success: added comment", comment); res.redirect('/'); }
                  });
           });
     });
   });




// Setting our Server to Listen on Port: 8000
app.listen(port, function() {
    console.log(`server running on port ${ port }`);
    });






