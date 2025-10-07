const express=require("express")
const router=express.Router({mergeParams:true});
const User=require("../models/users")
const Admin=require("../models/admin")
const comments = require("../models/comments");
const expresserror=require("../utils/expresserror");
const catchasync=require("../utils/catchasync");
const isloggedin=require("../middleware");
const methodOverride=require("method-override");
const accounts=require("../controllers/accounts")



const languages=["none","telugu","tamil","english","hindi"];
const genres=["none","love","suspence","comedy","horror","action"];




router.delete("/comments/:commentid",isloggedin,catchasync(accounts.deleteaccountcomments))
router.delete("/watchlist/:id",isloggedin,catchasync(accounts.deleteaccountwatchlist))
router.put("/",catchasync(accounts.accountupdate))
 router.get("/",isloggedin,catchasync(accounts.accountdetails))

router.get("/comments",isloggedin,catchasync(accounts.accountcomments))

 
 router.get("/watchlist",isloggedin,catchasync(accounts.accountwatchlist))
 router.get("/edit",isloggedin,catchasync(accounts.accountedit))
module.exports=router;