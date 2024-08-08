const express = require("express");
const {
  handlegetAllUSers,
  handleUserSignup,
  handleUSerSignin,
} = require("../controller/user.controller");

const router = express.Router();

router.get("/", handlegetAllUSers);

router.post("/signup", handleUserSignup);
router.post("/Signin", handleUSerSignin);

module.exports = router;
