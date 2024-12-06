const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const userModel = require("./models/user")


app.set("view engine" , "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: ture}));
app.use(cookieParser());


app.get('/' , function(req ,res){
    res.render("index");
})

app.post('/register' ,async function(req, res){
    let {username , name , email , age , password } = req.body;
    let user = await userModel.findOne({email});
    if(user) return res.status(500).send("Email Already Registered")

    bcrypt.genSalt(10 , )
})
app.listen(3000);