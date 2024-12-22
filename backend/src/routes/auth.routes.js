const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/password-reset", authController.requestPasswordReset);
router.post("/password-reset/:token", authController.resetPassword);
router.post("/verify-email/:token", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerificationEmail);

router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.updateProfile);
router.post("/profile/address", authMiddleware, authController.addAddress);
router.put("/profile/address/:addressId", authMiddleware, authController.updateAddress);
router.delete("/profile/address/:addressId", authMiddleware, authController.deleteAddress);

module.exports = router;
