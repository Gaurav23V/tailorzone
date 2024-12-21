const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/password-reset", authController.requestPasswordReset);
router.post("/password-reset/:token", authController.resetPassword);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerificationEmail);

module.exports = router;
