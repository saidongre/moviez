const mongoose=require("mongoose");

const reviewSchema=new mongoose.Schema({
    
    review:{
        type:String,
        
    },
    movies:{type:mongoose.Schema.Types.ObjectId,ref:"Movie"},
    users:{type:mongoose.Schema.Types.ObjectId,ref:"Credential"}

})


module.exports=mongoose.model("Review",reviewSchema)