const mongoose=require("mongoose");
const passportlocalmongoose=require("passport-local-mongoose");


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
        
    },
    favgenre:{
        type:String,
        enum:["none","love","suspence","comedy","horror","action"],
    },
    image:{
        type:String,
    },
    preflang:{
        type:String,
        enum:["none","tamil","telugu","english","hindi"],
    }, 
    watchlists:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Movie",
        }
    ] ,  
  comments:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Comment",
            }
        ]
    
    
})

userSchema.plugin(passportlocalmongoose)

module.exports=mongoose.model("User",userSchema)

