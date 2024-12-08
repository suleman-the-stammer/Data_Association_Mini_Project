const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const userModel = require("./models/user")


app.set("view engine" , "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.get('/' , function(req ,res){
    res.render("index");
})

app.get('/login' , function(req ,res){
  res.render("login");
})

app.get('/logout' , function(req, res){
  res.cookie("token" , "");
  res.redirect('/login');
})

app.post('/register' ,async function(req, res){
    let {username , name , email , age , password } = req.body;
    let user = await userModel.findOne({email});
    if(user) return res.status(500).send("Email Already Registered")

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(password , salt , function(err, hash){
        let user = userModel.create({
            username, 
            name,
            email,
            age,
            password: hash
            //Post is By Default an Blank Array So wo don't need to Create it there.
        });

        let token = jwt.sign({email: email , userid: user._id}, "secret-key");
        res.cookie("token" , token);
        res.send("Registered");
      })
    })
   
})

app.post('/login' ,async function(req, res){
  let { email , password } = req.body;
  let user = await userModel.findOne({email});
  if(!user) return res.status(500).send("Something Went Wrong");

  bcrypt.compare(password , user.password ,function(err, result){
    if(result) res.status(200).send("You Can Login")
      else res.redirect('/login');
  })
})

// Use as a MiddleWare for Our Routes Protection
function isLoggedIn(req, res, next){
  if(req.cookies.token === "") res.send("You Must Loggin First")
    else{
  let data = jwt.verify(req.cookies.token , "secret-key");
  req.user = data;
}
next()
}
app.listen(3000);