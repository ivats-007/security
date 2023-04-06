import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import encrypt from 'mongoose-encryption';
import * as dotenv from 'dotenv';

dotenv.config();
const app = express();
const dirname = path.resolve();
app.set("view engine","ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static(dirname+"/public/"));
mongoose.connect("mongodb://localhost:27017/userDB");

console.log(process.env.MAILCHIMP_API_KEY);

const userSchema = new mongoose.Schema({
    userName: String,
    userPassword: String
})

const secret = process.env.SECRET_KEY_FOR_ENCRYPTION_IN_MONGOOSE;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['userPassword']  });

const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",async function(req,res){
    const email = req.body.username;
    const password = req.body.password;
    const newUser = new User({
        userName: email,
        userPassword: password
    });
    try{
        await newUser.save();
        res.render("secrets");
    }catch(err){
        res.redirect("/register");
    }
});

app.post("/login",async function(req,res){
    const user = req.body.username;
    const password = req.body.password;
    console.log(user);
    console.log(password);
    try{
        const foundUser = await User.findOne({userName: user});
        console.log(foundUser);
        if(foundUser){
            if(foundUser.userPassword===password){
                console.log("Successfull logged in");
                res.render("secrets");
            }else{
                console.log("Password is wrong");
                res.render("register");
            }
        }else{
            console.log("Some error ocurred");
            res.render("register");
        }
    }catch(err){res.send(err)};
})

app.listen(3000,function(){
    console.log("Server started on port 3000");
})