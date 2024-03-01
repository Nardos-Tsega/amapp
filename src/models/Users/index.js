import mongoose from "mongoose";
import { modelNames } from "../constants.js";
import usersSchema from "./schema.js";

const User = mongoose.model(modelNames.USERS, usersSchema);

export default User;
