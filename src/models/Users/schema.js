import mongoose from "mongoose";
import { usersStatus } from "../constants.js";
import * as env from "../../config/env.js";
import bcrypt from "bcryptjs";

const usersSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  username: { type: String, required: true },
  country: { type: String, required: true },
  refreshToken: { type: String, required: true },
});

usersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// let sendEmail = false;
// let sendActivation = false;

// usersSchema.pre(
//   "findOneAndUpdate",
//   { document: true, query: true },
//   async function cb(next) {
//     const user = await this.model.findOne(this.getFilter());
//     const { _update } = this;
//     if (_update?.email && _update?.email !== user?.email) {
//       sendEmail = true;
//       if (user?.status === usersStatus.PENDING) {
//         sendActivation = true;
//       }
//     }
//     next();
//   }
// );

// usersSchema.post("save", async (doc) => {
//   if (env.nodeEnv === "DEV") {
//     return;
//   }

//code to send activation email should be added here
// });

export default usersSchema;
