const express = require("express");
const router = express.Router();
const catchasync = require("../utils/catchasync");
const isloggedin = require("../middleware");
const accounts = require("../controllers/accounts");

router.get("/", isloggedin, catchasync(accounts.accountdetails));
router.get("/edit", isloggedin, catchasync(accounts.accountedit));
router.put("/", isloggedin, catchasync(accounts.accountupdate));

router.get("/comments", isloggedin, catchasync(accounts.accountcomments));
router.delete("/comments/:commentid", isloggedin, catchasync(accounts.deleteaccountcomments));

router.get("/watchlist", isloggedin, catchasync(accounts.accountwatchlist));
router.delete("/watchlist/:id", isloggedin, catchasync(accounts.deleteaccountwatchlist));

module.exports = router;
