require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/usersDB",{useNewUrlParser:true,useUnifiedTopology:true});

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});



 userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

const User = mongoose.model("User",userSchema);

app.route("/")
.get(function(req,res){
  res.render("home");
});

app.route("/register")
.get(function(req,res){
  res.render("register");
})
.post(function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
      console.log("Successfully Saved User");
    }else{
      console.log(err);
    }
  });
});

app.route("/login")
.get(function(req,res){
  res.render("login");
})
.post(function(req,res){
  const userName = req.body.username;
  const userPassword = req.body.password;

  User.findOne({email:userName},function(err,foundUser){
    if(!err){
      if(foundUser){
        if(foundUser.password === userPassword ){
          res.render("secrets");
        }
      }
    }else{
      console.log(err);
    }
  });

});
app.get("/logout",function(req,res){
  res.redirect("/");
});

app.listen(3000,function(){
  console.log("Listening at port 3000");
});
