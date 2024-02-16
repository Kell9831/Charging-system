import express from "express";
import authRouter from "./routers/auth-router";
import errorHandler from "./middlewares/error";
import usersRouter from "./routers/users-router";

const app = express();
const port = 5500;

app.use(express.json());

app.use("/login", authRouter);
app.use("/", usersRouter);
app.use(errorHandler);


app.listen(port, () => console.log(`Escuchando al puerto ${port}`));