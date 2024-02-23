import dotenv from "dotenv";

//link dotenv to .env file value
dotenv.config();

const value = process.env;

export const port = value.PORT;
