const jwt = require("jsonwebtoken");
const { AppError } = require("./error.middleware");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError("No Token Provided", 401);
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      throw new AppError("User not found", 401);
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(new AppError("Invalid Token", 401));
    } else if (error.name === "TokenExpiredError") {
      next(new AppError("Token Expired", 401));
    } else {
      next(error);
    }
  }
};

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    next(new AppError("Admin access required", 403));
  }
};

module.exports = { authMiddleware, adminMiddleware };
