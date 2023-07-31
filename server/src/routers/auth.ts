import {
  create,
  generateForgotPasswordLink,
  grantValid,
  resendVerificationToken,
  updatePassword,
  verifyEmail,
} from "#/controllers/user";
import { isValidPasswordResetToken } from "#/middlewares/auth";
import { validate } from "#/middlewares/validator";
import {
  CreateUserSchema,
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

export default router;
