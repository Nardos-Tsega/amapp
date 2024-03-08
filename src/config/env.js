import dotenv from "dotenv";

//link dotenv to .env file value
dotenv.config();

const value = process.env;

export const port = value.PORT;
export const nodeEnv = value.NODE_ENV;
export const dbString = value.DB_STRING;
export const jwtKey = value.JWT_KEY;
