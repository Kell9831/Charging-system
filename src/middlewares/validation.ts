import { Request, Response, NextFunction } from "express";
import { createReadStream } from "fs";
import csv from "csv-parser";
import { ZodError } from "zod";

export interface RequestWithValidationErrors extends Request {
  validationErrors?: { row: number; details: Record<string, string> }[];
}

export function validationHandler(userSchema): (req: RequestWithValidationErrors, res: Response, next: NextFunction) => void {
  return (req: RequestWithValidationErrors, _res: Response, next: NextFunction) => {
    if (!req.file) {
      throw new Error("No se ha proporcionado ningún archivo");
    }

    const validationErrors: { row: number; details: Record<string, string> }[] = [];
    let rowIndex = 0; 

    createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row: any) => {
        rowIndex++;
        try {
          // Validar la fila del CSV con el esquema de usuario
          const userData = {
            name: row.name,
            email: row.email,
            age: parseInt(row.age),
            // Utilizar el valor por defecto para el campo password
            password: "supersecret",
            // Establecer el rol por defecto si no está presente en el CSV
            role: row.role || "user"
          };
          userSchema.parse(userData);
        } catch (error) {
          if (error instanceof ZodError) {
            // Si hay errores de validación, los agregamos al array de errores
            const errorDetails: Record<string, string> = {};
            error.errors.forEach((err) => {
              errorDetails[err.path[0]] = err.message;
            });
            validationErrors.push({ row: rowIndex , details: errorDetails });
          }
        }
      })
      .on("end", () => {
        req.validationErrors = validationErrors;
        next();
      });
  };
}
