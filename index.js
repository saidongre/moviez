if(process.env.NODE_ENV!=="production"){
    require("dotenv").config()
}


const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const ejsmate=require("ejs-mate");
// const bcrypt=require("bcrypt");
const User=require("./models/users")
const Admin=require("./models/admin")
const methodOverride=require("method-override");
const Movie=require("./models/movies");
const expresserror=require("./utils/expresserror");
const session=require("express-session");
// const { find } = require("./models/credentials");
const Review=require("./models/reviews");
const Comment=require("./models/comments");
const catchasync=require("./utils/catchasync")
const opens=require("./routes/opens")
const users=require("./routes/users")
const movies=require("./routes/movies")
const accounts=require("./routes/accounts")
const passport=require("passport");
const localstrategy=require("passport-local")
const flash=require("connect-flash")






app.engine("ejs",ejsmate)
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))


const sessionconfiguration={
    secret:"oooh boy",
    resave:false,
    saveUnitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"));
app.use(session(sessionconfiguration));
app.use(express.static(path.join(__dirname,"public")))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.currentuser=req.user;
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
 })



app.use("/movies",movies)
app.use("/",opens)
app.use("/account",accounts)
app.use("/:userid",users)


const requirelogin=(req,res,next)=>{
    if(!req.session.user_id){
        res.redirect("/login")
    }
    next();
}




const languages=["none","telugu","tamil","english","hindi"];
const genres=["none","love","suspence","comedy","horror","action"];

mongoose.connect('mongodb+srv://gudlasreeman:21je0369@cluster0.3kcgr7f.mongodb.net/?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true})

 .then(()=>{
    console.log("mongo connection open");
})
.catch(err=>{
    console.log("error");
    console.log(err);
})


 app.all("*",(req,res,next)=>{
    next(new expresserror("page not found",404))
})
app.use((err,req,res,next)=>{
    const {statuscode=500}=err;
    if(!err.message)err.message="oh its wrong"
    const{status=500,message="something went wrong"}=err;
    res.status(status).render("error",{err});
})


app.listen(5500,()=>{
    console.log("moviez activated on 5500")
})
