import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin())
const app = express()
app.use(cors())

app.get('/placa/:placa', async (req, res) => {
    const placa = req.params.placa.toUpperCase()

    // Validacão (MercoSul && Modelo antigo)
    const regex = /^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/
    if (!regex.test(placa)) {
        return res.status(400).json({ error: 'Placa inválida' })
    }

    try {
        const browser = await puppeteer.launch({ headless: true })
        const page = await browser.newPage()

        // Consumindo tabela Fipe
        await page.goto(`https://www.tabelafipebrasil.com/placa/${placa}`, {
            waitUntil: 'networkidle2',
        })

        // Aguarda o carregamento da tabela de informações
        await page.waitForSelector('.fipeTablePriceDetail tbody tr')

        // Extrai os dados da tabela da página
        const dados = await page.evaluate(() => {
            const linhas = Array.from(document.querySelectorAll('.fipeTablePriceDetail tbody tr'))
            const resultado = {}

            // Percorrendo as informações do veiculo
            linhas.forEach((linha) => {
                const tituloEl = linha.querySelector('td:first-child')
                const valorEl = linha.querySelector('td:nth-child(2)')

                if (tituloEl && valorEl) {
                    const titulo = tituloEl.textContent.trim().replace(':', '')
                    let valor = valorEl.textContent.trim()
                    if (valor === '----') valor = null

                    resultado[titulo] = valor
                }
            })
            return resultado
        })
        await browser.close()

        if (!dados.Marca || dados.Marca === '---') {
            return res.status(404).json({ error: 'Dados não encontrados para essa placa' })
        }

        const cor = dados.Cor || null
        if (cor) {
            dados.cor = cor
            delete dados.Cor
        }

        const municipio = dados.Municipio || null
        if (municipio) {
            dados.municipio = municipio
            delete dados.Municipio
        }

        res.json(dados)
    } catch (error) {
        console.error('Erro ao consultar placa:', error)
        res.status(500).json({ error: 'Erro interno ao consultar placa' })
    }
})

app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001')
})