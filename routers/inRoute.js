const express = require("express");
const router = express.Router();

const UserController = require("../controllers/userController");
const ArticleController = require("../controllers/articleController");
const PetController = require("../controllers/petController");
const DoctorController = require("../controllers/doctorController");
const DiseasesController = require("../controllers/diseasesController");
const { upload, detect } = require("../controllers/predictController");

const validate = require("../middleware/validator");
const validateRequest = require("../middleware/validateRequest");
const authenticateJWT = require("../middleware/authenticateJWT");

// router autentikasi reguler
router.post("/signup", validate.validateSignup, validateRequest, UserController.signup);
router.post("/login", validate.validateLogin, validateRequest, UserController.login);
router.post("/forgot-password", validate.validateForgotPassword, UserController.forgotPassword);
router.post("/reset-password", validate.validateResetPassword, UserController.resetPassword);
router.get("/verify/:token", UserController.verify);

//router autentikasi google
router.post("/auth/google", UserController.googleLogin);

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
router.post("/pets/:id/addhistory", authenticateJWT, validateRequest, PetController.addHistory);

//router fitur profile
router.get("/profile", authenticateJWT, UserController.getProfile);
router.put("/profile", authenticateJWT, UserController.updateProfile);
router.put("/profile/change-password", authenticateJWT, validate.validateChangePassword, UserController.changePassword);

//router fitur appointment
router.get('/appointments', authenticateJWT, DoctorController.listAppointment);
router.get('/appointments/detail', authenticateJWT, DoctorController.getAppointmentDetails);
router.get('/appointments/summary', authenticateJWT, DoctorController.getAppointmentSummary);
  
//router untuk dokter
router.post('/doctors', authenticateJWT, DoctorController.createDoctor);
router.get('/doctors', authenticateJWT, DoctorController.getDoctors);
router.get('/doctors/:id', authenticateJWT, DoctorController.getDoctorById);
router.put('/doctors/:id', authenticateJWT, DoctorController.updateDoctor);
router.delete('/doctors/:id', authenticateJWT, DoctorController.deleteDoctor);

//router untuk schedule
router.post('/schedules', authenticateJWT, DoctorController.createSchedule);
router.get('/schedules/:id', authenticateJWT, DoctorController.getSchedules);
router.put('/schedules/:id', authenticateJWT, DoctorController.updateSchedule);
router.delete('/schedules/:id', authenticateJWT, DoctorController.deleteSchedule);

//router untuk work hour
router.post('/workhours', authenticateJWT, DoctorController.createWorkHour);
router.get('/workhours/:id', authenticateJWT, DoctorController.getWorkHours);
router.put('/workhours/:id', authenticateJWT, DoctorController.updateWorkHour);
router.delete('/workhours/:id', authenticateJWT, DoctorController.deleteWorkHour);

// router untuk diseases
router.post("/predicts",  DiseasesController.postSkinDiseasePredictionHandler);
router.post("/dalamAnjing", DiseasesController.dalamAnjingController);
router.post("/dalamKucing", DiseasesController.dalamKucingController);

router.post("/disease", upload, detect);

module.exports = router;