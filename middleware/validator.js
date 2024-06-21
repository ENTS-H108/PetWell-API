const { body } = require("express-validator");
const { check } = require("express-validator");

const validateLogin = [body("email").not().isEmpty().trim().escape(), body("password").not().isEmpty().trim().escape()];

const validateSignup = [body("username").not().isEmpty().trim().escape(), body("password").not().isEmpty().trim().escape(), body("email").not().isEmpty().trim().escape()];

const validateForgotPassword = [body("email").not().isEmpty().trim().escape()];

const validateResetPassword = [body("newPassword").not().isEmpty().trim().escape(), body("token").not().isEmpty().trim().escape()];

const validateChangePassword = [
  body("currPassword").not().isEmpty().trim().escape(),
  body("newPassword").not().isEmpty().trim().escape(),
];

const anKucValidator = [
  // Check if input is an array
  check("input").isArray().withMessage("Input must be an array"),

  // Check if the array length is exactly 10
  check("input").custom((value) => {
    if (value.length !== 10) {
      throw new Error("Array length must be exactly 10");
    }
    return true;
  }),

  // Check if each element in the array is an integer and one of the allowed values
  check("input.*").isInt({ min: 0, max: 3 }).withMessage("Each element in the array must be an integer between 0 and 3"),
];

module.exports = {
  validateLogin,
  validateSignup,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
  anKucValidator,
};