const express = require('express');
const { pesquisa_placa } = require('api-placa');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    return res.json("Bem vindo à API!");
});

app.get("/placa/:plate", async (req, res) => {
    const plate = req.params.plate.toUpperCase();

    try {
        const resultado = await pesquisa_placa(plate);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: 'Placa inválida ou não encontrada.' });
    }
});

module.exports = app;
module.exports.handler = serverless(app);