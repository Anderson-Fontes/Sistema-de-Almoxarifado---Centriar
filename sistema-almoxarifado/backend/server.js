const express = require('express');
const cors = require('cors');
const pool = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. ROTAS DE ESTOQUE (EPIS)
// ==========================================
app.get('/api/epis', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM epis ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error("Erro no GET /epis:", err);
        res.status(500).json({ error: 'Erro ao buscar dados do banco.' });
    }
});

app.post('/api/epis', async (req, res) => {
    const { codigo_identificacao, nome, categoria, numero_ca, validade_ca, quantidade, peso, comprimento, estoque_minimo } = req.body;
    try {
        const query = `
            INSERT INTO epis (nome, categoria, numero_ca, validade_ca, quantidade, peso, comprimento, codigo_identificacao, estoque_minimo) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
        `;
        const result = await pool.query(query, [
            nome, 
            categoria, 
            numero_ca, 
            validade_ca || null, 
            quantidade, 
            (peso === '' ? null : peso), 
            (comprimento === '' ? null : comprimento), 
            codigo_identificacao || null, 
            estoque_minimo || 0
        ]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Erro no POST /epis:", err);
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
            nome, 
            categoria, 
            numero_ca, 
            validade_ca || null, 
            quantidade, 
            (peso === '' ? null : peso), 
            (comprimento === '' ? null : comprimento), 
            codigo_identificacao || null, 
            estoque_minimo || 0, 
            id
        ]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Erro no PUT /epis:", err);
        res.status(500).json({ error: 'Erro ao atualizar.' });
    }
});

// ==========================================
// 2. ROTAS DE COLABORADORES
// ==========================================
app.get('/api/colaboradores', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM colaboradores ORDER BY nome ASC');
        res.json(result.rows);
    } catch (err) {
        console.error("Erro no GET /colaboradores:", err);
        res.status(500).json({ error: 'Erro ao buscar colaboradores.' });
    }
});

// ==========================================
// 3. ROTAS DE MOVIMENTAÇÕES (RETIRADA E DEVOLUÇÃO)
// ==========================================
app.get('/api/movimentacoes', async (req, res) => {
    try {
        const query = `
            SELECT m.*, e.nome as material_nome, e.categoria, c.nome as colaborador_nome 
            FROM movimentacoes m 
            JOIN epis e ON m.epi_id = e.id 
            JOIN colaboradores c ON m.colaborador_id = c.id
            ORDER BY m.status DESC, m.data_retirada DESC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Erro no GET /movimentacoes:", err);
        res.status(500).json({ error: 'Erro ao buscar movimentações.' });
    }
});

app.post('/api/movimentacoes/retirar', async (req, res) => {
    const { epi_id, colaborador_id, quantidade_retirada, medida_inicial } = req.body;
    try {
        // Converte strings vazias em null para evitar erro de sintaxe no PostgreSQL
        const medidaSegura = (medida_inicial === '' || medida_inicial === undefined) ? null : medida_inicial;

        const query = `
            INSERT INTO movimentacoes (epi_id, colaborador_id, quantidade_retirada, medida_inicial, status) 
            VALUES ($1, $2, $3, $4, 'EM_USO') RETURNING *
        `;
        await pool.query(query, [epi_id, colaborador_id, quantidade_retirada, medidaSegura]);
        
        // Atualiza o estoque do material retirado
        await pool.query('UPDATE epis SET quantidade = quantidade - $1 WHERE id = $2', [quantidade_retirada, epi_id]);
        
        res.json({ message: 'Retirada registrada com sucesso!' });
    } catch (err) {
        console.error("🚨 ERRO NO BANCO (RETIRADA):", err); // Log para diagnóstico
        res.status(500).json({ error: 'Erro ao registrar retirada.' });
    }
});

app.put('/api/movimentacoes/:id/devolver', async (req, res) => {
    const { id } = req.params;
    const { epi_id, medida_final, medida_inicial, quantidade_retirada, categoria } = req.body;
    
    try {
        let consumo = 0;
        const medidaFinalSegura = (medida_final === '' || medida_final === undefined) ? null : medida_final;

        if ((categoria === 'Gás' || categoria === 'Cobre') && medidaFinalSegura !== null && medida_inicial !== null) {
            consumo = medida_inicial - medidaFinalSegura;
            
            const campo = categoria === 'Gás' ? 'peso' : 'comprimento';
            await pool.query(`UPDATE epis SET ${campo} = $1 WHERE id = $2`, [medidaFinalSegura, epi_id]);
        }
        
        await pool.query('UPDATE epis SET quantidade = quantidade + $1 WHERE id = $2', [quantidade_retirada, epi_id]);

        const query = `
            UPDATE movimentacoes 
            SET status = 'DEVOLVIDO', data_devolucao = CURRENT_TIMESTAMP, medida_final = $1, consumo = $2 
            WHERE id = $3 RETURNING *
        `;
        await pool.query(query, [medidaFinalSegura, consumo, id]);
        
        res.json({ message: 'Devolução registrada com sucesso!' });
    } catch (err) {
        console.error("🚨 ERRO NO BANCO (DEVOLUÇÃO):", err);
        res.status(500).json({ error: 'Erro ao registrar devolução.' });
    }
});

app.listen(3000, () => {
    console.log('🚀 Servidor rodando em http://localhost:3000');
});