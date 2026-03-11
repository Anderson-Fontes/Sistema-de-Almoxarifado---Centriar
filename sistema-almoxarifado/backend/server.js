const express = require('express');
const cors = require('cors');
const pool = require('./database');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/epis', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM epis ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar dados do banco.' });
    }
});

app.post('/api/epis', async (req, res) => {
    // Adicionamos o estoque_minimo aqui
    const { codigo_identificacao, nome, categoria, numero_ca, validade_ca, quantidade, peso, comprimento, estoque_minimo } = req.body;
    try {
        const query = `
            INSERT INTO epis (nome, categoria, numero_ca, validade_ca, quantidade, peso, comprimento, codigo_identificacao, estoque_minimo) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
        `;
        const result = await pool.query(query, [
            nome, categoria, numero_ca, validade_ca || null, quantidade, 
            peso || null, comprimento || null, codigo_identificacao || null, estoque_minimo || 0
        ]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao salvar.' });
    }
});

app.put('/api/epis/:id', async (req, res) => {
    const { id } = req.params;
    const { codigo_identificacao, nome, categoria, numero_ca, validade_ca, quantidade, peso, comprimento, estoque_minimo } = req.body;
    try {
        const query = `
            UPDATE epis 
            SET nome = $1, categoria = $2, numero_ca = $3, validade_ca = $4, 
                quantidade = $5, peso = $6, comprimento = $7, codigo_identificacao = $8, estoque_minimo = $9
            WHERE id = $10 RETURNING *
        `;
        const result = await pool.query(query, [
            nome, categoria, numero_ca, validade_ca || null, quantidade, 
            peso || null, comprimento || null, codigo_identificacao || null, estoque_minimo || 0, id
        ]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar.' });
    }
});

app.listen(3000, () => {
    console.log('🚀 Servidor rodando em http://localhost:3000');
});