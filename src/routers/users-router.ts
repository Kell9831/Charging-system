import express, { Response } from 'express';
import { validationHandler } from "../middlewares/validation";
import { userSchema } from "../models/user";
import { createUser } from "../data/user-data";
import csv from "csv-parser";
import fs from "fs";
import multer from 'multer';

import { RequestWithValidationErrors } from '../middlewares/validation';
import { authorize } from '../middlewares/authorize';
import { authenticateHandler } from '../middlewares/authenticate';
import { getUsers } from '../services/user-service';

const usersRouter = express.Router();

const upload = multer({ dest: 'uploads/' });

usersRouter.post('/upload', upload.single('csvFile'),authenticateHandler, authorize("admin"),validationHandler(userSchema), async (req: RequestWithValidationErrors, res: Response) => {
  try {
    if (!req.file) {
      throw new Error("No se ha proporcionado ningún archivo");
    }

    const successRecords: any[] = [];
    const errorRecords: { row: number; details: Record<string, string> }[] = [];

    // Leer el archivo CSV desde el sistema de archivos
    const csvData: any[] = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        csvData.push(row);
      })
      .on('end', async () => {
        // Procesar cada fila del archivo CSV y crear usuarios
        for (let i = 0; i < csvData.length; i++) {
          const row = csvData[i];
          try {
            // Validar los datos con el esquema de usuario de Zod
            const newUser = await createUser(row.email, row.name, row.age, row.role);
            successRecords.push(newUser);
          } catch (error) {
            if (req.validationErrors && req.validationErrors[i]) {
              errorRecords.push(req.validationErrors[i]);
            }
          }
        }

        // Enviar respuesta con registros exitosos y registros con errores
        res.json({ ok: true, data: { success: successRecords, errors: errorRecords } });
      });
  } catch (error) {
    console.error('Error en el middleware de manejo de errores de validación:', error);
    res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});


usersRouter.get("/users",authenticateHandler,authorize("admin"), async (_req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).send("Error al obtener los usuarios");
  }
});


export default usersRouter;
