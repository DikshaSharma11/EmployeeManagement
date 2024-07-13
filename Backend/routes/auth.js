const express = require("express");
const { body } = require("express-validator");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

router.post(
  "/signup",
  [
    body("name"),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["Employee", "Manager"]),
  ],
  signup
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  login
);

module.exports = router;
