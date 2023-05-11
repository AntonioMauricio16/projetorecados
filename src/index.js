import express from 'express';
import bcrypt, { hash } from "bcrypt";
const app = express();
app.use(express.json());

app.get('/', (request, response) => {
return response.json('OK');

});

app.listen(8080, () => console.log('Servidor iniciado'));

