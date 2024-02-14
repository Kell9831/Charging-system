import { ApiError } from "../middlewares/error";
import { User, UserParams } from "../models/user";
import * as userDB from "../data/user-data";
import bcrypt from "bcrypt";
import { costFactor } from "../utils/const-util";

export async function getUsers() {
  const users = await userDB.getUsers();
  return users;
}


export async function createUser(data: UserParams): Promise<User> {
    const { email, password,name,age, role } = data;
  
    const user = await userDB.getUserByEmail(email);
  
    if (user) {
      throw new ApiError("El usuario ya está registrado", 400);
    }
  
    const hashedPassword = await bcrypt.hash(password, costFactor);
    const newUser = await userDB.createUser(email, hashedPassword,name, age, role);
    return newUser;
  }

  export async function validateCredentials(
    credentials: UserParams
  ): Promise<User> {
    const { email, password } = credentials;
    const user = await userDB.getUserByEmail(email);
  
    // Verificar si el usuario existe
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
  
    // Si la contraseña no es válida, lanzar un error
    if (!isValid) {
      throw new ApiError("Credenciales incorrectas", 400);
    }
  
    // Si llegamos hasta aquí, las credenciales son válidas
    return user;
  }
  