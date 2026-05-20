if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsmate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/users");
const expresserror = require("./utils/expresserror");

const opensRouter = require("./routes/opens");
const moviesRouter = require("./routes/movies");
const accountsRouter = require("./routes/accounts");

// ── DB ──────────────────────────────────────────────────────────────────────
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ── App setup ────────────────────────────────────────────────────────────────
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ── Session ──────────────────────────────────────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET || "moviez_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// ── Passport ─────────────────────────────────────────────────────────────────
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ── Locals ───────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.locals.currentuser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/movies", moviesRouter);
app.use("/account", accountsRouter);
app.use("/", opensRouter);

// ── 404 & Error handler ──────────────────────────────────────────────────────
app.all("*", (req, res, next) => {
  next(new expresserror("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statuscode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statuscode).render("error", { err });
});

app.listen(5500, () => console.log("Moviez running on port 5500"));
