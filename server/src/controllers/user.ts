import EmailVerificationToken from "#/models/emailVerificationToken";
import PasswordResetToken from "#/models/passwordResetToken";
import {
  sendForgotPasswordMail,
  sendPasswordResetSuccessEmail,
  sendVerificationMail,
} from "#/mail/mail";
import User from "#/models/user";
import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import { generateToken } from "#/utils/helper";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";
import { PASSWORD_RESET_LINK } from "#/utils/variables";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;

  const createdUser = await User.create({ name, email, password });

  // send verification email
  const token = generateToken();

  await EmailVerificationToken.create({
    owner: createdUser._id,
    token,
  });

  sendVerificationMail(token, {
    name,
    email,
    userId: createdUser._id.toString(),
  });

  res.status(201).json({ user: { id: createdUser._id, name, email } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;
  // console.log(userId);

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({ error: "Invalid token!" });

  const matched = await verificationToken.compareToken(token);
  if (!matched) return res.status(403).json({ error: "Invalid token!" });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });

  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({ message: "Your email has been verified successfully." });
};

export const resendVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid request" });

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Invalid request" });

  await EmailVerificationToken.findOneAndDelete({
    owner: userId,
  });

  const token = generateToken();

  await EmailVerificationToken.create({
    owner: userId,
    token,
  });

  sendVerificationMail(token, {
    name: user.name,
    email: user.email,
    userId: user._id.toString(),
  });

  res.json({ message: "Please check your mail." });
};

export const generateForgotPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  await PasswordResetToken.findOneAndDelete({
    owner: user._id,
  });

  // generate the link
  const token = crypto.randomBytes(36).toString("hex");
  await PasswordResetToken.create({
    owner: user._id,
    token,
  });
  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;
  sendForgotPasswordMail({ email: user.email, link: resetLink });

  res.json({ message: "Check your registered mail." });
};

export const grantValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Unauthorized access." });

  const matched = await user.comparePassword(password);
  if (matched)
    return res
      .status(422)
      .json({ error: "The new password must be different from the old one." });

  user.password = password;
  await user.save();

  await PasswordResetToken.findOneAndDelete({ owner: user._id });
  // send the success email
  sendPasswordResetSuccessEmail({ name: user.name, email: user.email });

  res.json({ message: "Password reset successfully." });
};
