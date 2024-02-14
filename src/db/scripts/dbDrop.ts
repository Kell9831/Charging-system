import { configDotenv } from "dotenv";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

import { adminClient } from "..";
import fs from "node:fs";
import path from "node:path";

const migrationsFileName =
  process.env["NODE_ENV"] === "test"
    ? "migrations.test.json"
    : "migrations.json";

const dbName = process.env["PGDATABASE"];
adminClient.connect();

adminClient.query(`DROP DATABASE IF EXISTS "${dbName}"`, (err) => {
  if (err) {
    console.error("Error al eliminar la base de datos", err.stack);
  } else {
    console.log(`Base de datos "${dbName}" eliminada exitosamente`);
    try {
      fs.unlinkSync(
        path.join(__dirname, "..", "migrations", migrationsFileName)
      );
    } catch {
      console.log(
        "No se pudo eliminar el archivo de migraciones",
        migrationsFileName
      );
    }
  }
  adminClient.end();
});