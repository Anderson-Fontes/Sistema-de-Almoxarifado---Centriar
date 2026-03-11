const express = require('express');
const cors = require('cors');
const pool = require('./database');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Rota 1: Listar Materiais
app.get('/api/epis', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM epis ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar dados do banco.' });
    }
});

// Rota 2: Cadastrar Novo Material (POST)
app.post('/api/epis', async (req, res) => {
    const { codigo_identificacao, nome, categoria, numero_ca, validade_ca, quantidade, peso, comprimento } = req.body;
    try {
        const query = `
            INSERT INTO epis (nome, categoria, numero_ca, validade_ca, quantidade, peso, comprimento, codigo_identificacao) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
        `;
        const result = await pool.query(query, [
            nome, 
            categoria, 
            numero_ca, 
            validade_ca || null, 
            quantidade, 
            peso || null, 
            comprimento || null, 
            codigo_identificacao || null
        ]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao salvar no banco.' });
    }
});

// Rota 3: Editar Material Existente (PUT)
app.put('/api/epis/:id', async (req, res) => {
    const { id } = req.params;
    const { codigo_identificacao, nome, categoria, numero_ca, validade_ca, quantidade, peso, comprimento } = req.body;
    try {
        const query = `
            UPDATE epis 
            SET nome = $1, categoria = $2, numero_ca = $3, validade_ca = $4, 
                quantidade = $5, peso = $6, comprimento = $7, codigo_identificacao = $8
            WHERE id = $9 RETURNING *
        `;
        const result = await pool.query(query, [
            nome, 
            categoria, 
            numero_ca, 
            validade_ca || null, 
            quantidade, 
            peso || null, 
            comprimento || null, 
            codigo_identificacao || null, 
            id
        ]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar no banco.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando! Acesse no navegador: http://localhost:${PORT}`);
});