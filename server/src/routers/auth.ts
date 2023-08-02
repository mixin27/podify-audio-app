import {
  create,
  generateForgotPasswordLink,
  grantValid,
  logOut,
  resendVerificationToken,
  sendProfile,
  signIn,
  updatePassword,
  updateProfile,
  verifyEmail,
} from "#/controllers/auth";
import { isValidPasswordResetToken, mustAuth } from "#/middlewares/auth";
import fileParser, { RequestWithFiles } from "#/middlewares/fileParser";
import { validate } from "#/middlewares/validator";
import {
  CreateUserSchema,
  SignInValidationSchema,
  TokenAndIDValidationSchema,
  UpdatePasswordSchema,
} from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(TokenAndIDValidationSchema), verifyEmail);
router.post("/re-verify-email", resendVerificationToken);
router.post("/forgot-password", generateForgotPasswordLink);
router.post(
  "/verify-pass-reset-token",
  validate(TokenAndIDValidationSchema),
  isValidPasswordResetToken,
  grantValid
);
router.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPasswordResetToken,
  updatePassword
);
router.post("/sign-in", validate(SignInValidationSchema), signIn);
router.get("/is-auth", mustAuth, sendProfile);

router.post("/update-profile", mustAuth, fileParser, updateProfile);

router.post("/logout", mustAuth, logOut);

export default router;
