import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users";
import cardsRouter from './routes/cards'
import handleErrors from "./middlewares/handleErrors";

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://0.0.0.0:27017/mestodb");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  (req as any).user = {
    _id: '6447b54e3153a828191dae01'
  };

  next();
});
app.use("/users", usersRouter);
app.use('/cards', cardsRouter)

app.use(handleErrors)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
