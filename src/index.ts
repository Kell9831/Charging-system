import express from "express";

const app = express();
const port = 5505;

app.use(express.json());


app.listen(port, () => console.log(`Escuchando al puerto ${port}`));