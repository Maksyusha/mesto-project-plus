import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Joi, celebrate, errors } from "celebrate";
import { requestLogger, errorLogger } from "./middlewares/logger";
import handleErrors from "./middlewares/handleErrors";
import handleAuth from "./middlewares/handleAuth";
import routes from "./routes/index";
import NotFoundError from "./utils/errors/classes/not-found-error";
import { NOT_FOUND_MESSAGE } from "./utils/errors/error-messages";
import { createUser, login } from "./controllers/users";
import { createUserJoi, loginJoi } from "./utils/validation";

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://0.0.0.0:27017/mestodb");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post("/signin", celebrate(loginJoi), login);
app.post("/signup", celebrate(createUserJoi), createUser);
app.use(handleAuth);
app.use("/", routes);
app.use("/", (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(NOT_FOUND_MESSAGE));
});

app.use(errorLogger);

app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
