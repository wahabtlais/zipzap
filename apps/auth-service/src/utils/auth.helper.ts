import crypto from "crypto";
import { ValidationError } from "../../../../packages/error-handler";
import validator from "validator";
import { NextFunction, Request, Response } from "express";
import redis from "../../../../packages/libs/redis";
import { sendEmail } from "./sendMail";
import { prisma } from "../../../../packages/libs/prisma";

export const validateRegistrationData = (
  data: any,
  userType: "user" | "seller"
) => {
  console.log(data);
  const { name, email, password, phone_number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === "seller" && (!phone_number || !country))
  ) {
    throw new ValidationError("Validation error: Missing required fields");
  }

  if (!validator.isEmail(email)) {
    throw new ValidationError("Validation error: Invalid email format");
  }

  // Normalize email
  const normalizeEmail = validator.normalizeEmail(email);
  if (normalizeEmail) {
    data.email = normalizeEmail;
  }
};

export const checkOtpRestrictions = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    throw new ValidationError(
      "Account temporarily locked due to multiple failed attempts! Please try again after 30 minutes."
    );
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    throw new ValidationError(
      "Too many OTP requests! Please wait 1 hour before requesting another."
    );
  }

  if (await redis.get(`otp_cooldown:${email}`)) {
    throw new ValidationError(
      "Please wait 1 minute before requesting another OTP!"
    );
  }
};

export const trackOtpRequests = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");

  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600); // Lock for 1 hour
    throw new ValidationError(
      "Too many OTP requests! Please wait 1 hour before requesting another."
    );
  }

  await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600); // Reset count after 1 hour
};

export const sendOtp = async (
  email: string,
  name: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, "Verify your email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 300); // Store OTP in Redis with a 5-minute expiration
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60); // Set a cooldown period of 1 minute for sending OTPs
};

export const verifyOtp = async (
  email: string,
  otp: string,
  next: NextFunction
) => {
  const storedOtp = await redis.get(`otp:${email}`);

  if (!storedOtp) {
    throw new ValidationError("Invalid or expired OTP!");
  }

  const failedAttemptsKey = `otp_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");

  if (storedOtp !== otp) {
    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 1800); // Lock for 30 minutes
      await redis.del(`otp:${email}`, failedAttemptsKey);

      throw new ValidationError(
        "Invalid OTP! Too many failed attempts. Try again after 30 minutes."
      );
    }
    await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 300); // Increment failed attempts
    throw new ValidationError(
      `Invalid OTP! ${2 - failedAttempts} attempts left.`
    );
  }

  await redis.del(`otp:${email}`, failedAttemptsKey); // Clear OTP and attempts on success
};

export const handleForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "user" | "seller"
) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ValidationError("Email is required!");
    }

    // Find user/seller by email
    const user =
      userType === "user"
        ? await prisma.users.findUnique({ where: { email } })
        : await prisma.sellers.findUnique({ where: { email } });

    if (!user) throw new ValidationError(`${userType} not found!`);

    // Check opt restrictions
    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);

    // Generate otp and send email
    await sendOtp(
      email,
      user.name,
      userType === "user"
        ? "forgot-password-user-mail"
        : "forgot-password-seller-mail"
    );

    res.status(200).json({
      message: "OTP sent successfully! Please check your email.",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyForgotPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      throw new ValidationError("Email and OTP are required!");
    await verifyOtp(email, otp, next);

    res.status(200).json({
      message: "OTP verified successfully! You can now reset your password.",
    });
  } catch (error) {
    next(error);
  }
};
