const express=require("express")
const router=express.Router({mergeParams:true});
const User=require("../models/users")
const expresserror=require("../utils/expresserror");
const catchasync=require("../utils/catchasync")
const methodOverride=require("method-override");
const Comment=require("../models/comments");
const Movie=require("../models/movies");
const Review=require("../models/reviews");
const isloggedin=require("../middleware");
const comments = require("../models/comments");
const movies=require("../controllers/movies")
const multer=require("multer");
const storage=require("../cloudinary/index");
const upload=multer(storage);

 
const requirelogin=(req,res,next)=>{
    if(!req.session.user_id){
        res.redirect("/login")
    }
    next();
}



const languages=["none","telugu","tamil","english","hindi"];
const genres=["none","love","suspence","comedy","horror","action"];




router.get("/",catchasync(movies.showmovies))



router.delete("/:id/comments/:commentid",isloggedin,catchasync(movies.deletecomment))
router.delete("/:id",catchasync(movies.deletemovie))



router.get("/filter",async(req,res)=>{
    if(req.query){
        const movies=await Movie.find(req.query);
        res.render("movies/filter.ejs",{movies,languages,genres})
    }else{
        const movies=await Movie.find({})
    res.render("movies/filter.ejs",{movies,languages,genres})
    }
})

router.get("/search",catchasync(movies.moviesearch))

router.get("/new",isloggedin,catchasync(movies.newmovie))

router.get("/:id",catchasync(movies.movieselected))
router.get("/:id/edit",isloggedin,catchasync(movies.movieedit))

router.get("/:id/addreview",catchasync(async(req,res)=>{
    const {id}=req.params;
    const movie=await Movie.findById(id);

    res.render("reviews/new.ejs",{movie})
}))
router.post("/:id/watchlist",isloggedin,catchasync(movies.movieaddtowatchlist))

 router.post("/",isloggedin,upload.array("images"),catchasync(movies.movieadd))
// router.post("/",upload.array("image"),(req,res)=>{
//     console.log(req.body,req.files)
//     res.send("worked")
// })


router.post("/:id/comments",isloggedin,catchasync(movies.addcomments))

  

router.post("/:id/reviews",catchasync(async(req,res)=>{
    const{id}=req.params;
    const movie=await Movie.findById(id)
    const data=req.body
    console.log(data)
    const review=new Review(data)
    // const review=new Review(req.body.review);
    // console.log(review)
    
    movie.reviews.push(data.review);
     await review.save();
    await movie.save();
    req.flash("success","posted a comment")
    res.redirect(`/movies/${movie._id}`)
}))


  
router.post("/sortbylanguage",async(req,res)=>{
   
    const movies=await Movie.find(req.body)
    console.log(movies)
    
 
 })

 


router.put("/:id",isloggedin,upload.array("images"),catchasync(movies.movieupdate))

module.exports=router