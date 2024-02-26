import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import compress from "compression";
import routes from "./config/routes.js";
import * as env from "./config/env.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compress());

// security middlewares
app.use(helmet());
app.use(cors());

app.use("/api", routes);

app.listen(env.port, () => {
  console.log("we are running our first setup on", env.port);
});
