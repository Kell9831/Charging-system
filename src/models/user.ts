import { z } from "zod";

export const userSchema = z.object({
  email: z
    .string({
      required_error: "Email es requerido",
      invalid_type_error: "Email debe ser un string",
    })
    .email({ message: "El formato del campo 'email' es inválido." }),
  password: z
    .string({
      invalid_type_error: "Password viene por defecto" }),
  name: z
    .string({
      invalid_type_error: "Nombre debe ser un string",
    }).min(1,{message: "El campo 'name' no puede estar vacío."}),
    age: z
    .number()
    .refine((age) => age >= 0, {
      message: "La edad no puede ser negativa",
    })
    .refine((age) => age !== 0, {
      message: "La edad no puede ser cero",
    })
    .optional(),
  role: z
    .enum(["admin", "user"], {
      errorMap: () => ({ message: "Role solo puede ser 'user' o 'admin'" }),
    })
    .default("user"),
}).refine(data => {
  // Refinar el esquema para establecer el valor por defecto del password
  if (!("password" in data) || data.password === undefined) {
    return { ...data, password: "supersecret" };
  }
  return data;
});

export type UserParams = z.infer<typeof userSchema>;
export type User = UserParams & { id: number };
