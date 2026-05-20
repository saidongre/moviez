const User = require("../models/users");

module.exports.home = (req, res) => res.render("openpage/home.ejs");
module.exports.signup = (req, res) => res.render("openpage/signup.ejs");
module.exports.signin = (req, res) => res.render("openpage/login.ejs");
module.exports.about = (req, res) => res.render("openpage/about.ejs");

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully");
    res.redirect("/movies");
  });
};

module.exports.signingin = (req, res) => {
  req.flash("success", `Welcome back, ${req.user.username}`);
  res.redirect("/movies");
};

module.exports.registeringin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registered = await User.register(user, password);
    req.login(registered, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome to Moviez, ${registered.username}`);
      res.redirect("/movies");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};
