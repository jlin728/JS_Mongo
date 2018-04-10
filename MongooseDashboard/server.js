// Require the Express Module
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/animals');

var AnimalSchema = new mongoose.Schema({
  name:  { type: String, required: true, minlength: 1},
  about: { type: String, min: 1, max: 150 },
}, {timestamps: true })

mongoose.model('Animal', AnimalSchema); 

var Animal = mongoose.model('Animal') 



app.get('/', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    Animal.find({}, function(err, animals) {
        if(err){
          res.render("index","Error dude");
        }else{
        res.render('index',{animals: animals});  
        }
    })
})

app.get("/newAnimal", function(req, res) {
    res.render("newAnimal")         //render to newAnimal.ejs
})

app.post("/new", function(req, res) {
    console.log("POST DATA", req.body);
    var animal = new Animal({name: req.body.name, about: req.body.about});
    animal.save(function(err) {
        if(err) {                                 
            console.log("Something went wrong");
            res.redirect("newAnimal");
        } else {                                  
            console.log("Successfully added a comments!");
            res.redirect("/");
        }
    })
})

app.get("/edit/:id", function(req, res) {
    Animal.findOne({_id:req.params.id}, (err, animals)=>{
        if(err){
            res.redirect("/");
        }
        else{
            res.render("edit" , {animals : animals});
        }
    });
})

app.post("/edit/:id", function(req, res) {
    Animal.findById({_id:req.params.id}, (err, animals)=>{
        animals.name = req.body.name;
        animals.about = req.body.about;
        animals.save((err)=>{
            if (err){

                res.redirect("/edit/" + animals._id);
            }
            else {
                res.redirect("/");
            }
        })

    })
})

app.get("/animal/:id", function(req, res) {
    Animal.findOne({_id:req.params.id}, (err, animals)=>{
        if(err){
            res.redirect("/");
        }
        else{
            res.render("animal" , {animals : animals});
        }
    });
})

app.get("/destroy/:id", function(req, res) {
    Animal.remove({_id:req.params.id}, (err, animals)=>{
        if(err){
            res.redirect("/");
        }
        else{
            res.redirect("/");
        }
    });
})


  
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})