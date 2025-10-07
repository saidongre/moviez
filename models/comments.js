const mongoose=require("mongoose");

const commentSchema=new mongoose.Schema({
    name:String,
    moviename:String,
    comment:{
        type:String,
        
    },
    movies:{type:mongoose.Schema.Types.ObjectId,ref:"Movie"},
    users:{type:mongoose.Schema.Types.ObjectId,ref:"User"}

})


module.exports=mongoose.model("Comment",commentSchema)
