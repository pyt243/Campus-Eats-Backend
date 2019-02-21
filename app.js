var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var cors=require("cors");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
const multer = require('multer');
var User = require("./models/user");
var Outlet = require("./models/outlet");
const path = require('path');
const port = process.env.PORT || 3050;

//Static file declaration
app.use(express.static(path.join(__dirname, 'client/build')));

//production mode
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  //
  app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname = 'client/build/index.html'));
  })
}
//build mode
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/public/index.html'));
})

mongoose.connect("mongodb://localhost/trailusers2");
app.use(require("express-session")({
  secret:"secret",
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(User.deserializeUser());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname)
    }
});
const upload = multer({
    storage
});

app.listen(3050,"127.0.0.1",function(){
  console.log("listeneing on port 3050")
});
app.get("/",function(req,res){
  var todos=["Hiii","Byee","Good night"];
  console.log(todos);
  console.log(req.user);
  res.send({todos:todos,user:req.user});
  //res.render("index.ejs");
});
app.post("/signup",function(req,res){
  User.register(new User({username:req.body.username}),req.body.password,function(err,user){
    if(err){
      console.log(err);
      res.redirect("/signup");
    }else {
      user.flag="student";
      user.mobno=req.body.mobno;
      user.name=req.body.name;
      user.bitsid=req.body.bitsid;
      user.save();
      passport.authenticate("local")(req,res,function(){
        res.send({status:true});
        //res.redirect("/")
      });
    }
  });
});
app.post("/createoutletacc",function(req,res){
  User.register(new User({username:req.body.username}),req.body.password,function(err,user){
    if(err){
      console.log(err);
      res.redirect("/signup");
    }else {
      user.flag="outlet";
      user.mobno=req.body.mobno;
      user.name=req.body.name;
    //  user.bitsid=req.body.bitsid;
      user.save();
      passport.authenticate("local")(req,res,function(){
        res.send({user:user});
        //res.redirect("/")
      });
    }
  });
});
app.post("/createoutlet",function(req,res){
  Outlet.create({name:req.body.name},function(err,out){
    if(err){
      console.log("error");
    }else {
      out.location=req.body.location;
      out.description=req.body.description;
      out.owner.id=req.body.user.id;
      out.owner.username=req.body.username;
      out.user=req.body.user.username;
      out.image=req.body.image;
      out.save();
      res.send({outlet:out});
    }
  });
});
app.post("/login",passport.authenticate("local"),function(req,res){
  console.log("user logged in");
  console.log(req.user.flag);
  var user = req.user;
  user.idiot = "I'am a idiot";
  res.send({user:user});
//res.redirect("/");
});
app.get("/logout",function(req,res){
  req.logout();
  //res.redirect("/");
});
app.get("/getuser",function(req,res){
  console.log(req.user);
  res.send({
    idiot:"I'm a idiot"
  });
});
app.post('/upload', upload.single('image'), (req, res) => {
    if (req.file)
        res.json({
            imageUrl: `images/${req.file.filename}`
        });
    else
        res.status("409").json("No Files to Upload.");
});
