import mongoose from "mongoose";
import { dbString } from "../config/env.js";

const connectToDb = async () => {
  try {
    // const connectOptions = {
    //   useNewUrlParser: true,
    // };
    await mongoose.connect(dbString);
    console.log("Database connection succesfull");
  } catch (error) {
    console.log("Database connection error", error);
    throw error;
  }
};

export default connectToDb;
