//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Database connection
mongoose.connect("mongodb://localhost:27017/usersDB", {useNewUrlParser: true});

// Create Database Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// need to add plugin to the schema before model

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});


// Create Database Model
const User = new mongoose.model("User", userSchema);



app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", function(req, res){
  let userEmail = req.body.useremail;
  let userPassword = req.body.password;

  User.findOne({email: userEmail}, function(err, userFound){
    if(!err){
      if(userFound.password === userPassword){
        res.render("secrets");
      }else{
        res.send("incorrect password");
      }
    }else{
      console.log(err);
    }
  });
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  let userEmail = req.body.useremail;
  let userPassword = req.body.password;

  const user = new User({
    email: userEmail,
    password: userPassword,
  });

  user.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });


});


app.listen(3000 || process.env.PORT, function(){
  console.log("The server is running on port 3000");
});
