import { validationResult } from "express-validator";
import User from "../models/Users/index.js";
import jwt from "jsonwebtoken";
import * as env from "../config/env.js";
import { generateServerErrorCode } from "../utils/helpers.js";
import bcrypt from "bcryptjs";

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

    if (user) {
      generateServerErrorCode(res, 400, "Email already in use");
    }

    const token = jwt.sign({ email }, env.jwtKey, {
      expiresIn: 100000000,
    });

    const refreshToken = jwt.sign({ email }, env.jwtKey, {
      expiresIn: 100000000,
    });

    if (!user.email) {
      const newUser = new User({
        firstName,
        lastName,
        email,
        username,
        password,
        profileImage,
        country,
        refreshToken,
      });

      const user = await newUser.save();

      const userToReturn = { ...user.toJSON(), ...{ token } };
      delete userToReturn.password;
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
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (isPasswordMatched) {
      const token = jwt.sign({ email }, env.jwtKey, { expiresIn: 100000 });
      const userToReturn = { ...user.toJSON(), ...{ token } };
      delete userToReturn.password;
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

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.headers?.authorization?.split(" ")[1];
    if (!refreshToken) {
      generateServerErrorCode(res, 401, "Missing refresh token");
    }

    const decoded = jwt.verify(refreshToken, env.jwtKey);
    const user = await User.findOne({ email: decoded.email });
    console.log(user, "user");
    if (!user) {
      generateServerErrorCode(res, 401, "Invalid refresh token");
    }

    const newAccessToken = jwt.sign({ email: decoded.email }, env.jwtKey, {
      expiresIn: 100000,
    });
    // res.status(200).json({ ...user.toJSON() }, { ...newAccessToken });
    const userToReturn = { ...user.toJSON(), ...{ token: newAccessToken } };
    delete userToReturn.password;
    res.status(200).json(userToReturn);
  } catch (error) {
    generateServerErrorCode(res, 401, "Invalid refresh token");
  }
};
