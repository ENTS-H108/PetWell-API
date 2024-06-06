const express = require("express");
const passport = require("passport");
const router = express.Router();

const UserController = require("../controllers/userController");
const ArticleController = require("../controllers/articleController");
const PetController = require("../controllers/petController");

const validate = require("../middleware/validator");
const validateRequest = require("../middleware/validateRequest");
const authenticateJWT = require("../middleware/authenticateJWT");

// router login dan regis
router.post("/signup", validate.validateSignup, validateRequest, UserController.signup);
router.post("/login", validate.validateLogin, validateRequest, UserController.login);
router.post("/forgot-password", validate.validateForgot,  UserController.forgotPassword);
router.post("/reset-password", validate.validateReset, UserController.resetPassword);
router.get("/verify/:token", UserController.verify);

// router fitur artikel
router.post("/articles", authenticateJWT, ArticleController.createArticle);
router.get("/articles", authenticateJWT, ArticleController.getArticles);
router.get("/articles/:id", authenticateJWT, ArticleController.getArticleById);
router.put("/articles/:id", authenticateJWT, ArticleController.updateArticle);
router.delete("/articles/:id", authenticateJWT, ArticleController.deleteArticle);

// router fitur pet
router.post("/pets", authenticateJWT, validateRequest, PetController.createPet);
router.get("/pets", authenticateJWT, PetController.getPets);
router.get("/pets/:id", authenticateJWT, PetController.getPetById);
router.put("/pets/:id", authenticateJWT, PetController.updatePet);
router.delete("/pets/:id", authenticateJWT, PetController.deletePet);

// Route untuk memulai proses OAuth2
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }),
(req, res) => {
    res.redirect("/dashboard"); 
    }
);
router.get("/auth/google/signup", passport.authenticate("google"));
router.get("/auth/google/signup/callback", passport.authenticate("google",
     { failureRedirect: "/login" }), UserController.googleSignup);

module.exports = router;
