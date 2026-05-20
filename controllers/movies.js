const Movie = require("../models/movies");
const Comment = require("../models/comments");
const { cloudinary } = require("../cloudinary");

const languages = ["none", "telugu", "tamil", "english", "hindi"];
const genres = ["none", "love", "suspence", "comedy", "horror", "action"];

module.exports.showmovies = async (req, res) => {
  const movies = await Movie.find({});
  res.render("movies/show.ejs", { movies, languages, genres });
};

module.exports.newmovie = (req, res) => {
  res.render("movies/new.ejs", { languages, genres });
};

module.exports.moviesearch = async (req, res) => {
  const q = req.query.dsearch || "";
  const movies = await Movie.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { hero: { $regex: q, $options: "i" } },
      { heroine: { $regex: q, $options: "i" } },
      { ott: { $regex: q, $options: "i" } },
      { year: { $regex: q, $options: "i" } },
      { language: { $regex: q, $options: "i" } },
      { genre: { $regex: q, $options: "i" } },
    ],
  });
  res.render("movies/show.ejs", { movies, languages, genres });
};

module.exports.movieselected = async (req, res) => {
  const { id } = req.params;
  const movie = await Movie.findById(id).populate("comments");
  const results = await Movie.find({ genre: movie.genre, _id: { $ne: movie._id } });
  res.render("movies/info.ejs", { movie, results });
};

module.exports.movieedit = async (req, res) => {
  const { id } = req.params;
  const movie = await Movie.findById(id);
  res.render("movies/edit.ejs", { movie, languages, genres });
};

module.exports.movieadd = async (req, res) => {
  const movie = new Movie(req.body.movie);
  movie.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  await movie.save();
  req.flash("success", "Movie added successfully");
  res.redirect("/movies");
};

module.exports.movieupdate = async (req, res) => {
  const { id } = req.params;
  const movie = await Movie.findByIdAndUpdate(id, req.body.movie, { runValidators: true, new: true });
  const images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  movie.images.push(...images);
  if (req.body.deleteimages) {
    for (let filename of req.body.deleteimages) {
      await cloudinary.uploader.destroy(filename);
    }
    await movie.updateOne({ $pull: { images: { filename: { $in: req.body.deleteimages } } } });
  }
  await movie.save();
  req.flash("success", "Movie updated successfully");
  res.redirect(`/movies/${id}`);
};

module.exports.deletemovie = async (req, res) => {
  const { id } = req.params;
  await Movie.findByIdAndDelete(id);
  req.flash("success", "Movie deleted");
  res.redirect("/movies");
};

module.exports.movieaddtowatchlist = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const alreadyAdded = user.watchlists.some((wid) => wid.toString() === id);
  if (alreadyAdded) {
    req.flash("error", "Already in your watchlist");
  } else {
    user.watchlists.push(id);
    await user.save();
    req.flash("success", "Added to watchlist");
  }
  res.redirect(`/movies/${id}`);
};

module.exports.addcomments = async (req, res) => {
  const { id } = req.params;
  const movie = await Movie.findById(id);
  const comment = new Comment({
    ...req.body.comment,
    movies: movie._id,
    users: req.user._id,
  });
  movie.comments.push(comment);
  req.user.comments.push(comment);
  await comment.save();
  await movie.save();
  await req.user.save();
  req.flash("success", "Comment posted");
  res.redirect(`/movies/${movie._id}`);
};

module.exports.deletecomment = async (req, res) => {
  const { id, commentid } = req.params;
  await Movie.findByIdAndUpdate(id, { $pull: { comments: commentid } });
  await Comment.findByIdAndDelete(commentid);
  req.flash("success", "Comment removed");
  res.redirect(`/movies/${id}`);
};
