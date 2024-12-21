const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // For development
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP connection error:", error);
      } else {
        console.log("SMTP server ready");
      }
    });
  }

  generateVerificationToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const mailOption = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Verify Your Email Address",
      html: `
        <h1>Email Verification</h1>
        <p>Hello ${user.firstName},</p>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      `,
    };

    await this.transporter.sendMail(mailOption);
  }
}

module.exports = new EmailService();
