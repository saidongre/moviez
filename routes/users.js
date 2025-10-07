const express=require("express")
const router=express.Router({mergeParams:true});
const User=require("../models/users")
const Admin=require("../models/admin")
const expresserror=require("../utils/expresserror");
const catchasync=require("../utils/catchasync");






const requirelogin=(req,res,next)=>{
    if(!req.session.user_id){
        res.redirect("/login")
    }
    next();
}


const languages=["none","telugu","tamil","english","hindi"];
const genres=["none","love","suspence","comedy","horror","action"];





module.exports=router;