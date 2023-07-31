import * as yup from "yup";
import { isValidObjectId } from "mongoose";

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(3, "Length of name must have at least 3.")
    .max(20, "Length of name must not have more than 20."),
  email: yup
    .string()
    .required("Email is required")
    .email("Please provide a valid email address."),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Length of password must have at least 8.")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password must have at least one letter, one digit and one special character."
    ),
});

export const TokenAndIDValidationSchema = yup.object().shape({
  token: yup.string().trim().required("Invalid token."),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) return value;
      else return "";
    })
    .required("Invalid user id."),
});

export const UpdatePasswordSchema = yup.object().shape({
  token: yup.string().trim().required("Invalid token."),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) return value;
      else return "";
    })
    .required("Invalid user id."),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Length of password must have at least 8.")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password must have at least one letter, one digit and one special character."
    ),
});
