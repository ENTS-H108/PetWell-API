const { body, param } = require("express-validator");

const validateLogin = [body("email").not().isEmpty().trim().escape(), body("password").not().isEmpty().trim().escape()];

const validateSignup = [body("username").not().isEmpty().trim().escape(), body("password").not().isEmpty().trim().escape(), body("email").not().isEmpty().trim().escape()];


const validateForgot = [body("email").not().isEmpty().trim().escape()];

const validateReset =  [body("token").not().isEmpty().trim().escape(), body("newPassword").not().isEmpty().trim().escape()];

module.exports = {
  validateLogin,
  validateSignup,
  validateForgot,
  validateReset,
};
