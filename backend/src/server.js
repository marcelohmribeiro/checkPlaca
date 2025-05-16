const express = require('express');
const { pesquisa_placa } = require('api-placa'); // biblioteca que consulta a placa
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors()); // Habilita CORS para permitir requisições de outros domínios (como o front em React)
app.use(express.json()); // Permite receber JSON no corpo da requisição

app.get("/", (req, res) => {
    return res.json("Bem vindo a API!")
})

// Rota para consultar placa
app.get("/placa/:plate", async (req, res) => {
    const plate = req.params.plate.toUpperCase();

    try {
        const resultado = await pesquisa_placa(plate);
        res.json(resultado); // Retorna o resultado da API
    } catch (error) {
        res.status(400).json({ error: 'Placa inválida ou não encontrada.' });
    }
});

// Inicia o servidor
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));