import path from "path";
import nodemailer from "nodemailer";
import {
  M_TRAP_PASS,
  M_TRAP_USER,
  SIGN_IN_URL,
  VERIFICATION_EMAIL,
} from "#/utils/variables";
import { generateToken } from "#/utils/helper";
import EmailVerificationToken from "#/models/emailVerificationToken";
import { generateTemplate } from "#/mail/template";

const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: M_TRAP_USER,
      pass: M_TRAP_PASS,
    },
  });
  return transport;
};

interface Profile {
  name: string;
  email: string;
  userId: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
  const transport = generateMailTransporter();

  const { name, email } = profile;

  const welcomeMessage = `Hi ${name}, welcome to Podify! There are so much thing that we do for verified users. Use the given OTP to verify your email.`;

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Welcome message",
    html: generateTemplate({
      title: "Welcome to Podify",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      },
    ],
  });
};

interface ForgotPasswordMailOptions {
  email: string;
  link: string;
}

export const sendForgotPasswordMail = async (
  options: ForgotPasswordMailOptions
) => {
  const transport = generateMailTransporter();

  const { email, link } = options;

  const message =
    "We just received a request that you forgot your password. No problem you can use the link below and create brand new password.";

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Reset Password Link",
    html: generateTemplate({
      title: "Forgot Password",
      message: message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link: link,
      btnTitle: "Reset Password",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
};

interface PasswordResetSuccessMailOptions {
  name: string;
  email: string;
}

export const sendPasswordResetSuccessEmail = async (
  options: PasswordResetSuccessMailOptions
) => {
  const transport = generateMailTransporter();

  const { name, email } = options;

  const message = `Dear ${name}, we just update your new password. You can now sign in with your new password.`;

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Password Reset Successfully",
    html: generateTemplate({
      title: "Password Reset Successfully",
      message: message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link: SIGN_IN_URL,
      btnTitle: "Sign In",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
};
