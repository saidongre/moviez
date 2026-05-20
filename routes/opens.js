const express = require("express");
const router = express.Router();
const passport = require("passport");
const opens = require("../controllers/opens");

router.get("/", opens.home);
router.get("/signup", opens.signup);
router.get("/login", opens.signin);
router.get("/about", opens.about);
router.get("/logout", opens.logout);

router.post(
  "/login",
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
  opens.signingin
);
router.post("/signup", opens.registeringin);

module.exports = router;
