
const express=require("express")
const router=express.Router();
const expresserror=require("../utils/expresserror");
const catchasync=require("../utils/catchasync")
const User=require("../models/users")
const Admin=require("../models/admin")
const Movie=require("../models/movies");
//const bcrypt=require("bcrypt");
const passport=require("passport")
const opens=require("../controllers/opens")

const languages=["none","telugu","tamil","english","hindi"];
const genres=["none","love","suspence","comedy","horror","action"];


router.get("/",opens.home)
 router.get("/signup",opens.signup)
 router.get("/login",opens.signin)
 router.get("/about",opens.about)
 router.get("/logout",opens.logout)
 
 router.post("/login",passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),opens.signingin)
 router.post("/signup",opens.registeringin)

 


module.exports=router;