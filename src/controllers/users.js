import { validationResult } from "express-validator";
import User from "../models/Users/index.js";
import jwt from "jsonwebtoken";
import * as env from "../config/env.js";
import { generateServerErrorCode } from "../utils/helpers.js";
import bcrypt from "bcryptjs";

export const createUserController = async (req, res, next) => {
  const errorsAfterValidation = validationResult(req);

  if (!errorsAfterValidation.isEmpty()) {
    res.status(400).json({
      code: 400,
      errors: errorsAfterValidation,
    });
    return;
  }

  try {
    const { firstName, lastName, email, username, password, country } =
      req.body;

    const user = await User.findOne({ email: email });

    if (user) {
      generateServerErrorCode(res, 400, "Email already in use");
      return;
    }

    const token = jwt.sign({ email }, env.jwtKey, {
      expiresIn: 100000000,
    });

    const refreshToken = jwt.sign({ email }, env.jwtKey, {
      expiresIn: 100000000,
    });

    let profileImage = "";

    if (req.file) {
      profileImage = req.file.filename;
    }

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

    const savedUser = await newUser.save();

    const userToReturn = { ...savedUser.toJSON(), ...{ token } };
    delete userToReturn.password;
    res.status(200).json(userToReturn);
    return;
  } catch (error) {
    generateServerErrorCode(res, 500, error, "SOMETHING WENT WRONG");
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
    res.status(400).json({
      code: 400,
      error: errorsAfterValidation.mapped(),
    });
    return;
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
    if (!user) {
      generateServerErrorCode(res, 401, "Invalid refresh token");
    }

    const newAccessToken = jwt.sign({ email: decoded.email }, env.jwtKey, {
      expiresIn: 100000,
    });
    const userToReturn = { ...user.toJSON(), ...{ token: newAccessToken } };
    delete userToReturn.password;
    res.status(200).json(userToReturn);
  } catch (error) {
    generateServerErrorCode(res, 401, "Invalid refresh token");
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    console.log(users, "users");

    if (!users) {
      generateServerErrorCode(res, 404, "no users found", "no users found");
      return;
    }
    res.status(200).json(users);
  } catch (error) {
    generateServerErrorCode(res, 500, error, "SOMETHING WENT WRONG");
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    let user;
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(userId);
    } else {
      generateServerErrorCode(res, 404, "Invalid user id", "User not found");
      return;
    }

    if (!user) {
      generateServerErrorCode(res, 404, "User not found", "User not found");
      return;
    }
    const userToReturn = { ...user.toJSON() };
    delete userToReturn.password;
    delete userToReturn.refreshToken;
    res.status(200).json(userToReturn);
  } catch (error) {
    generateServerErrorCode(res, 500, error, "SOMETHING WENT WRONG");
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    let user;
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findByIdAndDelete(userId);
    } else {
      generateServerErrorCode(res, 404, "Invalid user id", "User not found");
      return;
    }

    if (!user) {
      generateServerErrorCode(res, 404, "User not found", "User not found");
      return;
    }

    const userToReturn = {
      ...user.toJSON(),
      ...{ message: "User deleted successfully" },
    };
    res.status(200).json(userToReturn);
  } catch (error) {
    generateServerErrorCode(res, 500, error, "SOMETHING WENT WRONG");
    next(error);
  }
};

export const editUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!user) {
      generateServerErrorCode(res, 404, "User not found", "User not found");
      return;
    }
    const userToReturn = { ...user.toJSON() };
    delete userToReturn.password;
    res.status(200).json(userToReturn);
    return;
  } catch (error) {
    generateServerErrorCode(res, 500, error, "SOMETHING WENT WRONG");
    next(error);
  }
};
