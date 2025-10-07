
const User=require("../models/users")
const Movie=require("../models/movies")



const languages=["none","telugu","tamil","english","hindi"];
const genres=["none","love","suspence","comedy","horror","action"];



module.exports.accountdetails=async(req,res)=>{
    const user=req.user;
    const movies=await Movie.find({genre:`${user.favgenre}`})
    res.render("user/show.ejs",{user,movies})
}
module.exports.accountcomments=async(req,res)=>{
    const data=req.user; 
    const user=await data.populate("comments");
    res.render("user/comments.ejs",{user})
 }
 module.exports.accountwatchlist=async(req,res)=>{
    const data=req.user; 
    const user=await data.populate("watchlists");
    res.render("user/watchlist.ejs",{user})
 }
 module.exports.accountedit=async(req,res)=>{
    const user=req.user;
    res.render("user/edit.ejs",{user,languages,genres})
}






module.exports.deleteaccountcomments=async(req,res)=>{
    const {commentid}=req.params;
    const data=req.user;
    const comment=await data.updateOne({$pull:{comments:commentid}})
    req.flash("success","removed a comment")
   res.redirect(`/account/comments`)
}
module.exports.deleteaccountwatchlist=async(req,res)=>{ 
    const {id}=req.params;
    const data=req.user;
    const movie=await data.updateOne({$pull:{watchlists:id}})
    req.flash("success","removed from watchlist")
   res.redirect(`/account/watchlist`)
}


module.exports.accountupdate=async(req,res)=>{
    const account=req.user;
    const data=req.user._id;
     const user= await User.findByIdAndUpdate(data,req.body,{runValidators:true,new:true})
     res.redirect(`/account`)
 }