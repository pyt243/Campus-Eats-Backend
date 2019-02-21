var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var outletScheme = new mongoose.Schema({
  name:String,
  location:String,
  rating:Number,
  description:String,
  owner:{
    id:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"User"
   },
   username:String
  },
  user:String,
  image:String
});
module.exports = mongoose.model("Outlet",outletScheme);
