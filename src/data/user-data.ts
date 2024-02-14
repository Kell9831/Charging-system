import { query } from "../db";
import { User } from "../models/user";

export async function getUsers(): Promise<User[]> {
  const result = await query("SELECT * FROM users;");
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
    password: string,
    name:string,
    age:number | undefined,
    role:string,
  ): Promise<User> {
    return (
      await query(
        "INSERT INTO users (email, password,name,age,role) VALUES ($1, $2, $3,$4,$5) RETURNING *",
  
        [email, password,name,age,role]
      )
    ).rows[0];
}