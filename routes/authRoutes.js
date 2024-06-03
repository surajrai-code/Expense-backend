const express = require("express");
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
} = require("../controller/authController");

const router = express.Router();

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

// Forget password route
router.post("/forget-password", forgetPassword);

// Reset password route
router.route("/reset-password/:token")
  // GET request to render reset password form
  .get((req, res) => {
    // Render a form for users to input their new password
    res.render('reset-password-form', { token: req.params.token });
  })
  // POST request to handle password reset
  .post(resetPassword);

module.exports = router;
