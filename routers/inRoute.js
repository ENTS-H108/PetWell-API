const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController.js");
const PetController = require("../controllers/petController.js");


const validate = require("../middleware/validator");
const validateRequest = require("../middleware/validateRequest");
const authenticateJWT = require("../middleware/authenticateJWT.js");


// router login dan regis
router.post("/signup", validate.validateSignup, validateRequest, UserController.signup);
router.post("/login", validate.validateLogin, validateRequest, UserController.login);
router.post("/forgot-password", validate.validateForgot,  UserController.forgotPassword);
router.post("/reset-password", validate.validateReset, UserController.resetPassword);
router.get("/verify/:token", UserController.verify);

// router add pet
router.post("/add-pet", authenticateJWT, validateRequest, PetController.addPet);


module.exports = router;
