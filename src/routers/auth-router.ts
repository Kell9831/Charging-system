import express from "express";
import jwt from "jsonwebtoken";
import { validateCredentials } from "../services/user-service";
import { jwtSecret } from "../utils/const-util";


const authRouter = express.Router();

authRouter.post("/", async (req, res, next) => {
  //console.log(req.body);
  try {
    const user = await validateCredentials(req.body);
    const payload = { userId: user.id, userRole: user.role };
    console.log(`payload ${payload}`)
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "5m" });
    console.log(`token ${token}`)
    res.json({ ok: true, message: "Login exitoso", data: { token } });
  } catch (error) {
    next(error);
  }
  
});

export default authRouter;
