const User = require("../models/users");
const Movie = require("../models/movies");
const Comment = require("../models/comments");

const languages = ["none", "telugu", "tamil", "english", "hindi"];
const genres = ["none", "love", "suspence", "comedy", "horror", "action"];

module.exports.accountdetails = async (req, res) => {
  const user = req.user;
  const movies = user.favgenre && user.favgenre !== "none"
    ? await Movie.find({ genre: user.favgenre })
    : [];
  res.render("user/show.ejs", { user, movies });
};

module.exports.accountcomments = async (req, res) => {
  const user = await req.user.populate("comments");
  res.render("user/comments.ejs", { user });
};

module.exports.accountwatchlist = async (req, res) => {
  const user = await req.user.populate("watchlists");
  res.render("user/watchlist.ejs", { user });
};

module.exports.accountedit = (req, res) => {
  res.render("user/edit.ejs", { user: req.user, languages, genres });
};

module.exports.accountupdate = async (req, res) => {
  const { username, email, image, favgenre, preflang } = req.body;
  await User.findByIdAndUpdate(
    req.user._id,
    { username, email, image, favgenre, preflang },
    { runValidators: true, new: true }
  );
  req.flash("success", "Profile updated");
  res.redirect("/account");
};

module.exports.deleteaccountcomments = async (req, res) => {
  const { commentid } = req.params;
  await req.user.updateOne({ $pull: { comments: commentid } });
  await Comment.findByIdAndDelete(commentid);
  req.flash("success", "Comment removed");
  res.redirect("/account/comments");
};

module.exports.deleteaccountwatchlist = async (req, res) => {
  const { id } = req.params;
  await req.user.updateOne({ $pull: { watchlists: id } });
  req.flash("success", "Removed from watchlist");
  res.redirect("/account/watchlist");
};
