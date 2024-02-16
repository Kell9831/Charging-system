import { ApiError } from "../middlewares/error";
import { User, UserParams } from "../models/user";
import * as userDB from "../data/user-data";
import bcrypt from "bcrypt";


export async function getUsers() {
  const users = await userDB.getUsers();
  return users;
}


  export async function validateCredentials(
    credentials: UserParams
  ): Promise<User> {
    const { email, password } = credentials;
    const user = await userDB.getUserByEmail(email);
  
    if (!user) {
      throw new ApiError("Credenciales incorrectas", 400);
    }
  
    let isValid = false;
  
    // Si el usuario tiene una contraseña cifrada, comparar con bcrypt
    if (user.password.startsWith("$2")) {
      isValid = await bcrypt.compare(password, user.password);
    } else {
      // Si la contraseña no está cifrada, comparar directamente
      isValid = password === user.password;
    }
  
    if (!isValid) {
      throw new ApiError("Credenciales incorrectas", 400);
    }
  
    return user;
  }
  