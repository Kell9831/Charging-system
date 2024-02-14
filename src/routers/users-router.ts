import express from "express";
import { getUsers } from "../services/user-service";

const usersRouter = express.Router();

usersRouter.get("/", async (_req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).send("Error al obtener los usuarios");
  }
});

export default usersRouter;