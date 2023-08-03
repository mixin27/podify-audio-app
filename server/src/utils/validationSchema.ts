import * as yup from "yup";
import { isValidObjectId } from "mongoose";
import { categories } from "./audio_category";

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

export const SignInValidationSchema = yup.object().shape({
  email: yup.string().required("Email is required").email("Invalid email"),
  password: yup.string().trim().required("Password is required"),
});

export const AudioValidationSchema = yup.object().shape({
  title: yup.array(yup.string()).required("Title is required"),
  about: yup.array(yup.string()).required("About is required"),
  category: yup
    .array(yup.string().oneOf(categories, "Invalid category"))
    .required("Category is required"),
});
