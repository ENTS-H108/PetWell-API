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
  body("confirmPassword").not().isEmpty().trim().escape().custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password baru dan konfirmasi password tidak sesuai');
    }
    return true;
  })
];

module.exports = {
  validateLogin,
  validateSignup,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
};