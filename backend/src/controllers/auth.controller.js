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
      console.log(`Password reset requested for email: ${email}`);

      const user = await User.findOne({ email });
      if (!user) {
        console.log(`No user found with email: ${email}`);
        return res.json({
          message:
            "If your email is registered, you will receive a password reset link",
        });
      }

      // Generate reset token
      const resetToken = generateResetToken(); // This should be a crypto-secure token
      console.log(`Generated reset token for email: ${email}`);

      const hashedToken = await hashPassword(resetToken); // Hash the token before saving
      console.log(`Hashed reset token for email: ${email}`);

      // Save hashed token and expiry
      user.passwordResetToken = hashedToken;
      user.passwordResetExpires = Date.now() + 3600000; // 1 hour from now
      await user.save();
      console.log(`Saved reset token and expiry for email: ${email}`);

      // Send password reset email
      await emailService.sendPasswordResetEmail(
        user.email,
        resetToken,
        user.firstName
      );
      console.log(`Sent password reset email to: ${email}`);

      res.json({
        message:
          "If your email is registered, you will receive a password reset link",
      });
    } catch (error) {
      console.error(`Error in requestPasswordReset: ${error.message}`);
      next(error);
    }
  },

  // Reset Password
  async resetPassword(req, res, next) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!password) {
        throw new AppError("Password is required", 400);
      }

      // Find user with non-expired reset token
      const user = await User.findOne({
        passwordResetExpires: { $gt: Date.now() },
      });

      if (!user) {
        throw new AppError("Invalid or expired reset token", 400);
      }

      // Verify the token
      const isValidToken = await comparePassword(
        token,
        user.passwordResetToken
      );
      if (!isValidToken) {
        throw new AppError("Invalid or expired reset token", 400);
      }

      // Update password
      user.password = password; // Password will be hashed by pre-save middleware
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      // Send password change confirmation email
      await emailService.sendPasswordChangeConfirmation(
        user.email,
        user.firstName
      );

      res.json({
        message: "Password has been reset successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user profile
  async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user._id).select(
        "-password -refreshToken"
      );
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  // Update user profile
  async updateProfile(req, res, next) {
    try {
      const { firstName, lastName, phone } = req.body;

      // Create update object with only provided fields
      const updateData = {};
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (phone) updateData.phone = phone;

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password -refreshToken");

      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  // Add new address
  async addAddress(req, res, next) {
    try {
      const { street, city, state, postalCode, country, isDefault } = req.body;

      const user = await User.findById(req.user._id);

      // If this is the default address, unset other default addresses
      if (isDefault) {
        user.addresses.forEach((addr) => (addr.isDefault = false));
      }

      // Add new address
      user.addresses.push({
        street,
        city,
        state,
        postalCode,
        country,
        isDefault: isDefault || user.addresses.length === 0, // Make first address default
      });

      await user.save();
      res.json(user.addresses);
    } catch (error) {
      next(error);
    }
  },

  // Update address
  async updateAddress(req, res, next) {
    try {
      const { addressId } = req.params;
      const { street, city, state, postalCode, country, isDefault } = req.body;

      const user = await User.findById(req.user._id);

      // Find address index
      const addressIndex = user.addresses.findIndex(
        (addr) => addr._id.toString() === addressId
      );

      if (addressIndex === -1) {
        throw new AppError("Address not found", 404);
      }

      // If setting as default, unset other defaults
      if (isDefault) {
        user.addresses.forEach((addr) => (addr.isDefault = false));
      }

      // Update address
      user.addresses[addressIndex] = {
        ...user.addresses[addressIndex],
        street: street || user.addresses[addressIndex].street,
        city: city || user.addresses[addressIndex].city,
        state: state || user.addresses[addressIndex].state,
        postalCode: postalCode || user.addresses[addressIndex].postalCode,
        country: country || user.addresses[addressIndex].country,
        isDefault: isDefault || user.addresses[addressIndex].isDefault,
      };

      await user.save();
      res.json(user.addresses);
    } catch (error) {
      next(error);
    }
  },

  // Delete address
  async deleteAddress(req, res, next) {
    try {
      const { addressId } = req.params;

      const user = await User.findById(req.user._id);

      // Remove address
      user.addresses = user.addresses.filter(
        (addr) => addr._id.toString() !== addressId
      );

      // If deleted address was default and addresses remain, make first address default
      if (
        user.addresses.length > 0 &&
        !user.addresses.some((addr) => addr.isDefault)
      ) {
        user.addresses[0].isDefault = true;
      }

      await user.save();
      res.json(user.addresses);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
