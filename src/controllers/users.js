import { validationResult } from "express-validator";
import User from "../models/Users/index.js";
import jwt from "jsonwebtoken";
import * as env from "../config/env.js";
import { generateServerErrorCode } from "../utils/helpers.js";

export const createUserController = async (req, res, next) => {
  const errorsAfterValidation = validationResult(req);

  if (!errorsAfterValidation.isEmpty()) {
    return res.status(400).json({
      code: 400,
      errors: errorsAfterValidation,
    });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      profileImage,
      country,
    } = req.body;

    const user = User.findOne({ email });
    console.log(user, "user");

    if (!user.email) {
      const newUser = new User({
        firstName,
        lastName,
        email,
        username,
        password,
        profileImage,
        country,
      });

      const user = await newUser.save();
      const token = jwt.sign({ email }, env.jwtKey, {
        expiresIn: 100000000,
      });

      const userToReturn = { ...user.toJSON(), ...{ token } };
      res.status(200).json(userToReturn);
    } else {
      generateServerErrorCode(
        res,
        403,
        "register email error",
        "USER ALREADY EXISTS",
        "email"
      );
    }
  } catch (error) {
    generateServerErrorCode(res, 500, error, "SOMETHING WENT WRONG");
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
    return res.status(400).json({
      code: 400,
      error: errorsAfterValidation.mapped(),
    });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && user.email) {
    const isPasswordMatched = true;
    if (isPasswordMatched) {
      const token = jwt.sign({ email }, env.jwtKey, { expiresIn: 100000 });
      const userToReturn = { ...user.toJSON(), ...{ token } };
      res.status(200).json(userToReturn);
    } else {
      generateServerErrorCode(
        res,
        403,
        "login password error",
        "WRONG PASSWORD"
      );
    }
  } else {
    generateServerErrorCode(res, 404, "login email error", "NO SUCH USER");
  }
};
