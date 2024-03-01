import User from "../models/Users/index.js";

export const createUserController = async (req, res, next) => {
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

    res.json({ data: user });
  } catch (error) {
    next(error);
  }
};
