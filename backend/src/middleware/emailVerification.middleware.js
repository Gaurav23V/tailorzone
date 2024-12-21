const { AppError } = require("./error.middleware");

const requireEmailVerification = async (req, res, next) => {
  try {
    if (!req.user.isEmailVerified) {
      throw new AppError("Email verification required", 403);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = requireEmailVerification;
