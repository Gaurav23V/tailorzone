const bcrypt = require("bcrypt");
const crypto = require("crypto");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

const generateResetToken = async () => {
  return crypto.randomBytes(32).toString("hex");
};

module.exports = {
  hashPassword,
  comparePassword,
  generateResetToken,
};
