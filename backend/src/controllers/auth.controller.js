const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt.utils");
const {
  hashPassword,
  comparePassword,
  generateResetToken,
} = require("../utils/password.utils");
const { AppError } = require("../middleware/error.middleware");
const emailService = require("../services/email.service");

const authController = {
  // User registration
  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      // Check is user already exist
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError("Email already registered", 400);
      }

      // Generate verification token
      const verificationToken = emailService.generateVerificationToken();
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Create new user
      const user = new User({
        email,
        password,
        firstName,
        lastName,
        phone,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      });

      await user.save();

      // Send verification email
      await emailService.sendVerificationEmail(user, verificationToken);

      // Generate Token
      const tokens = generateToken(user._id);

      res.status(201).json({
        message:
          "Registration successful. Please check your email to verify your account.",
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
        },
        tokens,
      });
    } catch (error) {
      next(error);
    }
  },

  // Add email verification method
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;

      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() },
      });

      if (!user) {
        throw new AppError("Invalid or expired verification token", 400);
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      res.json({
        message: "Email verified successfully",
        isEmailVerified: true,
      });
    } catch (error) {
      next(error);
    }
  },

  // Add resend verification email method
  async resendVerificationEmail(req, res, next) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        throw new AppError("User not found", 404);
      }

      if (user.isEmailVerified) {
        throw new AppError("Email already verified", 400);
      }

      const verificationToken = emailService.generateVerificationToken();
      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      );
      await user.save();

      await emailService.sendVerificationEmail(user, verificationToken);

      res.json({
        message: "Verification email send successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  // User login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        throw new AppError("Invalid credentials", 401);
      }

      // Verify password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new AppError(`Invalid credentials`, 401);
      }

      // Generate tokens
      const tokens = generateToken(user._id);

      // Update refresh token
      await User.findByIdAndUpdate(user._id, {
        refreshToken: tokens.refreshToken,
      });

      res.json({
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        tokens,
      });
    } catch (error) {
      next(error);
    }
  },

  // Token refresh
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError("Refresh token required", 400);
      }

      // Find user with refresh token
      const user = await User.findOne({ refreshToken });
      if (!user) {
        throw new AppError("Invalid refresh token", 401);
      }

      // Generate new tokens
      const tokens = generateToken(user._id);

      // Update refresh token
      await user.findByIdAndUpdate(user._id, {
        refreshToken: tokens.refreshToken,
      });

      res.json(tokens);
    } catch (error) {
      next(error);
    }
  },

  // Request password reset
  async requestPasswordReset(req, res, next) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        // Return success even if user doesn't exist (security)
        return res.json({
          message:
            "If your email is registered, you will receive a password reset link",
        });
      }

      const resetToken = generateResetToken();
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // TODO: Implement email service to send reset token

      res.json({
        message:
          "If you email is registered, you will receive a password reset link",
      });
    } catch (error) {
      next(error);
    }
  },

  // Reset Password
  async resetPassword(req, res, next) {
    try {
      const { token } = req.params;
      const password = req.body;

      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
      });

      if (!user) {
        throw new AppError("Invalid or expired reset token");
      }

      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
