const { body } = require("express-validator");

const validateLogin = [
  body("email").not().isEmpty().trim().escape(),
  body("password").not().isEmpty().trim().escape()
];

const validateSignup = [
  body("username").not().isEmpty().trim().escape(),
  body("password").not().isEmpty().trim().escape(),
  body("email").not().isEmpty().trim().escape()
];

const validateForgotPassword = [
  body("email").not().isEmpty().trim().escape()
];

const validateResetPassword = [
  body("newPassword").not().isEmpty().trim().escape(),
  body("token").not().isEmpty().trim().escape()
];

const validateChangePassword = [
  body("currPassword").not().isEmpty().trim().escape(),
  body("newPassword").not().isEmpty().trim().escape(),
];

module.exports = {
  validateLogin,
  validateSignup,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
};