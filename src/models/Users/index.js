import mongoose from "mongoose";
import { modelNames } from "../constants";
import usersSchema from "./schema";

const Users = mongoose.model(modelNames.USERS, usersSchema);

export default Users;
