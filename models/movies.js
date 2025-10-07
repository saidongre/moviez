const mongoose=require("mongoose");
//const Review=require("reviews")

const imageSchema=new mongoose.Schema({
            url:String,
            filename:String
})
 imageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload","/upload/w-200")
 })

const movieSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    year:{
        type:String,
        
    },
    language:{
        type:String,
        enum:["none","tamil","telugu","english","hindi"],
         required:true
    },
    genre:{
        type:String,
        enum:["none","love","suspence","comedy","horror","action"],
         required:true

    },
    hero:{
        type:String,
    },
    heroine:{
        type:String
    },
    rating:{
        type:String,
    },
    storyline:{
        type:String
    },
    ott:{
        type:String,

    },
    images:[imageSchema],
    reviews:[String],
    commenter:{
        
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment",
        }
    ]
        

    
 })

module.exports=mongoose.model("Movie",movieSchema)