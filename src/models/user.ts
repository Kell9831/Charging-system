import { z } from "zod";

export const userSchema = z.object({
  email: z
    .string({
      required_error: "Email es requerido",
      invalid_type_error: "Email debe ser un string",
    })
    .email({ message: "Email no es válido" }),
  password: z
    .string({
      required_error: "Password es requerido",
      invalid_type_error: "Password debe ser un string",
    })
    .min(6, "Password debe tener al menos 6 caracteres").default("supersecret"),
  name: z
    .string({
      required_error: "Nombre es requerido",
      invalid_type_error: "Nombre debe ser un string",
    }),
  age: z.number().min(0, { message: "Edad debe ser mayor o igual a cero" }).optional(),
  role: z
    .enum(["admin", "user"], {
      errorMap: () => ({ message: "Role solo puede ser 'user' o 'admin'" }),
    })
    .default("user"),
});

export type UserParams = z.infer<typeof userSchema>;
export type User = UserParams & { id: number };
