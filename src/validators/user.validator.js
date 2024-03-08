import { check } from "express-validator";

export const registerValidator = [
  check("firstName").exists().withMessage("First Name is required").isString(),
  check("lastName").exists().withMessage("Last Name is required").isString(),
  check("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is in wrong format"),
  check("password")
    .exists()
    .withMessage("Email is required")
    .isLength({ min: 8 })
    .withMessage("Password length must be atleast 8 characters"),
  check("profileImage").optional(),
  check("username").exists().withMessage("Username is required").isString(),
  check("country").exists().withMessage("Country is required").isString(),
];

export const loginValidator = [
  check("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is in wrong format"),
  check("password")
    .exists()
    .withMessage("Email is required")
    .isLength({ min: 8 })
    .withMessage("Password length must be atleast 8 characters"),
];
