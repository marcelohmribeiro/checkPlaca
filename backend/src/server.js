const express = require('express');
const { pesquisa_placa } = require('api-placa');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    return res.json("Bem vindo a API!")
})

// Rota para consultar placa
app.get("/placa/:plate", async (req, res) => {
    const plate = req.params.plate.toUpperCase();

    try {
        const resultado = await pesquisa_placa(plate);
        res.json(resultado)
    } catch (error) {
        res.status(400).json({ error: 'Placa inválida ou não encontrada.' })
    }
})

app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`))