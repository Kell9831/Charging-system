import { query } from "../db";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import { costFactor } from "../utils/const-util";

export async function getUsers(): Promise<User[]> {
  const result = await query("SELECT id, email, name, age, role FROM users ;");
  return result.rows;
}


export async function getUserByEmail(
  email: string
): Promise<User | undefined> {
  return (await query("SELECT * FROM users WHERE email = $1", [email]))
    .rows[0];
}


export async function createUser(
  email: string,
  name: string,
  age?: number, 
  role: string = 'user', 
): Promise<User> {
  // Contraseña predeterminada
  const defaultPassword = "supersecret";

  const hashedPassword = await bcrypt.hash(defaultPassword, costFactor);

  try {
    // Insertar el nuevo usuario en la base de datos
    const queryResult = await query(
      "INSERT INTO users (email, name, role, age, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [email, name, role, age, hashedPassword]
    );
    
    // Eliminar el campo de la contraseña del objeto de usuario devuelto
    const user = { ...queryResult.rows[0] };
    delete user.password;
    
    return user;
  } catch (error) {
    // Manejar errores de la consulta SQL
    console.error("Error al crear usuario:", error);
    throw new Error("Error al crear usuario");
  }
}
