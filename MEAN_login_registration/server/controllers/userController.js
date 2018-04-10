let mongoose = require("mongoose");
let user = mongoose.model("User");
//let bcrypt = require("bcrypt-as-promised");
let session = require("express-session");

class userController {
    index(req, res){
        user.find({}, (err, users)=>{
            if(err){
                console.log(err);
            }else{
                res.render("index", {users:users});
            }
        });
    }


    register(req, res) {
        user.find({email: req.body.email}, (err, user)=>{
            user = user[0];
            
            if(err){
                console.log(err);
            }else{
                if (user.length > 0){           // if this person exists, don't let them register. Email already in D
                    console.log(req.body.email + "already in use");
                    res.redirect("/");
                }

                let newUser = new User(req.body);

                bcrypt.hash(req.body.password, 10)      //10 is strength of randomization
                .then(hash => {
                    newUser.password = hash;
                })
                newUser.save(err=>{
                    if(err){
                        console.log();
                        request.session.user_id = newUser._id;
                        res.redirect("/");
                    }
                    res.redirect("/");
                })
                .catch(error =>{
                    console.log("Bcrypt error:" + error);
                    res.redirect("/");
                    
                });
            }
        });

    }



    login(req, res){

        User.find({email: req.body.email}, (err, users)=>{
            if(err){
                console.log(err);
                res.redirect("/");
            } else {
                if(user[0]){
                    bcrypt.compare(req.body.password, user[0].password)
                    .then((valid)=>{
                        request.session.user_id = user[0]._id;
                        res.redirect("/dashboard")
                    })
                    .catch(err);
                }else{
                    console.log("User:"+ req.body.email + "doesn't exist");
                    res.redirect("/");
                }
            }
        });
    }
















}

module.exports = new userController();