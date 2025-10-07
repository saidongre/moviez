
const Movie=require("../models/movies");
const Comment=require("../models/comments");
const {cloudinary}=require("../cloudinary");


const languages=["none","telugu","tamil","english","hindi"];
const genres=["none","love","suspence","comedy","horror","action"];



module.exports.showmovies=async(req,res)=>{
        const movies=await Movie.find({})
    res.render("movies/show.ejs",{movies,languages,genres})
}
module.exports.newmovie=async(req,res)=>{
   res.render("movies/new.ejs",{languages,genres})
}
module.exports.moviesearch=async(req,res)=>{
    
    const movies=await Movie.find({$or:[{name:{$regex:req.query.dsearch}},{hero:{$regex:req.query.dsearch}},{heroine:{$regex:req.query.dsearch}},{ott:{$regex:req.query.dsearch}},{year:{$regex:req.query.dsearch}},{language:{$regex:req.query.dsearch}},{genre:{$regex:req.query.dsearch}},{rating:{$regex:req.query.dsearch}}]});
    res.render("movies/show.ejs",{movies,languages,genres})
}

module.exports.movieselected=async(req,res)=>{
    const {id}=req.params;
   const movie=await Movie.findById(id).populate("comments")
   const results=await Movie.find({genre:`${movie.genre}`})
   
   if(results){
    res.render("movies/info.ejs",{movie,results});
   }else{
    res.render("movies/info.js",{movie})
   }
}
module.exports.movieedit=async(req,res)=>{
    const {id}=req.params;
    const movie=await Movie.findById(id);
    res.render("movies/edit.ejs",{movie,languages,genres})
}






module.exports.movieaddtowatchlist=async(req,res)=>{
    const {id}=req.params;
    const user=req.user;
    const movies=await Movie.findById(id);
    user.watchlists.push(movies);
    await movies.save();
    await user.save();
    req.flash("success","added to watchlist")
    res.redirect("/movies")  
  }
  module.exports.movieadd=async(req,res)=>{
   
    const movie=new Movie(req.body.movie);
    // console.log(req.body.movie);
    movie.images=req.files.map(f=>({url:f.path,filename:f.filename}))
    await movie.save();
    // console.log(movie)
    req.flash("success","added a movie successfully");
    res.redirect("/movies")
  }
  module.exports.addcomments=async(req,res)=>{
    const{id}=req.params;
    const movie=await Movie.findById(id);
    const comment=new Comment(req.body.comment);
   movie.comments.push(comment);
   const user=req.user;
   user.comments.push(comment)
    await comment.save();
    await movie.save();
     await user.save();
    //  console.log(req.user)
    req.flash("success","posted a comment")
    res.redirect(`/movies/${movie._id}`)
}






module.exports.deletecomment=async(req,res)=>{
   
    const {id,commentid}=req.params;
    const movie=await Movie.findByIdAndUpdate(id,{$pull:{comments:commentid}});
    const comment=await Comment.findById(commentid)
    req.flash("success","removed a comment")
    res.redirect(`/movies/${movie._id}`)
}
module.exports.deletemovie=async(req,res)=>{
    const {id}=req.params;
    const movie=await Movie.findById(id);
   // console.log(movie)
    const result=await Movie.deleteOne(movie);
    req.flash("success","successfully deleted a movie")
    res.redirect(`/movies`)

}




module.exports.movieupdate=async(req,res)=>{
    const {id}=req.params;
    // console.log(req.body.movie)
   const movie= await Movie.findByIdAndUpdate(id,req.body.movie,{runValidators:true,new:true})
   const images=req.files.map(f=>({url:f.path,filename:f.filename}))
   movie.images.push(...images);
   
   if(req.body.deleteimages)
   {
    for(let filename of req.body.deleteimages){
       await cloudinary.uploader.destroy(filename)
    }
    await movie.updateOne({$pull:{images:{filename:{$in:req.body.deleteimages}}}})
   }
   await movie.save();
   req.flash("success","successfully updated")
    res.redirect(`/movies/${id}`)
}