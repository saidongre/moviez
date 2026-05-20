const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });
const catchasync = require("../utils/catchasync");
const isloggedin = require("../middleware");
const Movie = require("../models/movies");
const Review = require("../models/reviews");
const movies = require("../controllers/movies");

const languages = ["none", "telugu", "tamil", "english", "hindi"];
const genres = ["none", "love", "suspence", "comedy", "horror", "action"];

// ── List & Search ─────────────────────────────────────────────────────────────
router.get("/", catchasync(movies.showmovies));
router.get("/search", catchasync(movies.moviesearch));

// ── Filter ────────────────────────────────────────────────────────────────────
router.get("/filter", catchasync(async (req, res) => {
  const query = {};
  if (req.query.genre && req.query.genre !== "none") query.genre = req.query.genre;
  if (req.query.language && req.query.language !== "none") query.language = req.query.language;
  const movieList = await Movie.find(query);
  res.render("movies/filter.ejs", { movies: movieList, languages, genres });
}));

// ── New / Create ──────────────────────────────────────────────────────────────
router.get("/new", isloggedin, catchasync(movies.newmovie));
router.post("/", isloggedin, upload.array("images"), catchasync(movies.movieadd));

// ── Show / Edit / Update / Delete ─────────────────────────────────────────────
router.get("/:id", catchasync(movies.movieselected));
router.get("/:id/edit", isloggedin, catchasync(movies.movieedit));
router.put("/:id", isloggedin, upload.array("images"), catchasync(movies.movieupdate));
router.delete("/:id", isloggedin, catchasync(movies.deletemovie));

// ── Watchlist ─────────────────────────────────────────────────────────────────
router.post("/:id/watchlist", isloggedin, catchasync(movies.movieaddtowatchlist));

// ── Comments ──────────────────────────────────────────────────────────────────
router.post("/:id/comments", isloggedin, catchasync(movies.addcomments));
router.delete("/:id/comments/:commentid", isloggedin, catchasync(movies.deletecomment));

// ── Reviews ───────────────────────────────────────────────────────────────────
router.get("/:id/addreview", isloggedin, catchasync(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  res.render("reviews/new.ejs", { movie });
}));

router.post("/:id/reviews", isloggedin, catchasync(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  const review = new Review({ review: req.body.review, movies: movie._id, users: req.user._id });
  movie.reviews.push(req.body.review);
  await review.save();
  await movie.save();
  req.flash("success", "Review posted");
  res.redirect(`/movies/${movie._id}`);
}));

module.exports = router;
