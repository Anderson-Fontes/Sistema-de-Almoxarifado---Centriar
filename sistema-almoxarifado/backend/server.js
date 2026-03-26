const express = require('express');
const cors = require('cors');
const pool = require('./database');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ==========================================
// ROTAS DE MATERIAIS / ESTOQUE
// ==========================================

// Listar todos os materiais
app.get('/api/epis', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM epis ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) { 
        res.status(500).json({ error: 'Erro ao buscar dados do banco.' }); 
    }
});

// Cadastrar novo material
app.post('/api/epis', async (req, res) => {
    const { codigo_identificacao, nome, categoria, numero_ca, validade_ca, quantidade, peso, comprimento, estoque_minimo, peso_minimo, estado, bitola } = req.body;
    try {
        const query = `
            INSERT INTO epis (nome, categoria, numero_ca, validade_ca, quantidade, peso, comprimento, codigo_identificacao, estoque_minimo, peso_minimo, estado, bitola) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *
        `;
        const result = await pool.query(query, [
            nome, categoria, numero_ca, validade_ca || null, quantidade || 0, 
            peso || null, comprimento || null, codigo_identificacao || null, 
            estoque_minimo || 0, peso_minimo || 0, estado || 'Novo', bitola || '1/4'
        ]);
        res.json(result.rows[0]);
    } catch (err) { 
        res.status(500).json({ error: 'Erro ao salvar.' }); 
    }
});

// Atualizar material existente
app.put('/api/epis/:id', async (req, res) => {
    const { id } = req.params;
    const { codigo_identificacao, nome, categoria, numero_ca, validade_ca, quantidade, peso, comprimento, estoque_minimo, peso_minimo, estado, bitola } = req.body;
    try {
        const query = `
            UPDATE epis 
            SET nome = $1, categoria = $2, numero_ca = $3, validade_ca = $4, 
                quantidade = $5, peso = $6, comprimento = $7, codigo_identificacao = $8, 
                estoque_minimo = $9, peso_minimo = $10, estado = $11, bitola = $12 
            WHERE id = $13 RETURNING *
        `;
        const result = await pool.query(query, [
            nome, categoria, numero_ca, validade_ca || null, quantidade || 0, 
            peso || null, comprimento || null, codigo_identificacao || null, 
            estoque_minimo || 0, peso_minimo || 0, estado || 'Novo', bitola || '1/4', id
        ]);
        res.json(result.rows[0]);
    } catch (err) { 
        res.status(500).json({ error: 'Erro ao atualizar.' }); 
    }
});

// Excluir Material (Forçado - Mantém histórico em texto)
app.delete('/api/epis/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Desvincula o ID das movimentações para não quebrar relatórios, mas o nome do item fica salvo lá!
        await pool.query('UPDATE movimentacoes SET epi_id = NULL WHERE epi_id = $1', [id]);
        // Deleta do estoque
        await pool.query('DELETE FROM epis WHERE id = $1', [id]);
        res.json({ message: 'Material excluído com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir o material.' });
    }
});

// ==========================================
// ROTAS DE COLABORADORES
// ==========================================

app.get('/api/colaboradores', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM colaboradores ORDER BY nome ASC');
        res.json(result.rows);
    } catch (err) { 
        res.status(500).json({ error: 'Erro ao buscar colaboradores.' }); 
    }
});

app.post('/api/colaboradores', async (req, res) => {
    const { nome, setor, status } = req.body;
    try {
        const query = `INSERT INTO colaboradores (nome, setor, status) VALUES ($1, $2, $3) RETURNING *`;
        const result = await pool.query(query, [nome, setor, status || 'Ativo']);
        res.json(result.rows[0]);
    } catch (err) { 
        res.status(500).json({ error: 'Erro ao cadastrar colaborador.' }); 
    }
});

app.put('/api/colaboradores/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, setor, status } = req.body;
    try {
        const query = `UPDATE colaboradores SET nome = $1, setor = $2, status = $3 WHERE id = $4 RETURNING *`;
        const result = await pool.query(query, [nome, setor, status, id]);
        res.json(result.rows[0]);
    } catch (err) { 
        res.status(500).json({ error: 'Erro ao atualizar colaborador.' }); 
    }
});

// Excluir Colaborador (Forçado)
app.delete('/api/colaboradores/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE movimentacoes SET colaborador_id = NULL WHERE colaborador_id = $1', [id]);
        await pool.query('DELETE FROM colaboradores WHERE id = $1', [id]);
        res.json({ message: 'Colaborador excluído com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir o colaborador.' });
    }
});

// ==========================================
// ROTAS DE MOVIMENTAÇÕES (RETIRADA, DEVOLUÇÃO E EXCLUSÃO)
// ==========================================

app.get('/api/movimentacoes', async (req, res) => {
    try {
        const query = `
            SELECT m.*, c.nome as colaborador_nome, e.nome as material_nome_atual, e.categoria 
            FROM movimentacoes m
            LEFT JOIN colaboradores c ON m.colaborador_id = c.id
            LEFT JOIN epis e ON m.epi_id = e.id
            ORDER BY m.id DESC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar movimentações.' });
    }
});

app.post('/api/movimentacoes/retirar', async (req, res) => {
    const { epi_id, colaborador_id, quantidade_retirada, medida_inicial, nome_material_salvo } = req.body;
    try {
        const query = `
            INSERT INTO movimentacoes (epi_id, colaborador_id, quantidade_retirada, medida_inicial, status, data_retirada, epi_nome)
            VALUES ($1, $2, $3, $4, 'EM_USO', CURRENT_TIMESTAMP, $5) RETURNING *
        `;
        const result = await pool.query(query, [epi_id, colaborador_id, quantidade_retirada, medida_inicial || null, nome_material_salvo]);
        
        await pool.query('UPDATE epis SET quantidade = quantidade - $1 WHERE id = $2', [quantidade_retirada, epi_id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao registrar retirada.' });
    }
});

app.put('/api/movimentacoes/:id/devolver', async (req, res) => {
    const { id } = req.params;
    const { epi_id, quantidade_retirada, medida_inicial, medida_final, categoria } = req.body;
    
    try {
        let consumo = 0;
        
        if (epi_id) {
            if (categoria === 'Gás' || categoria === 'Cobre') {
                consumo = parseFloat(medida_inicial || 0) - parseFloat(medida_final || 0);
                await pool.query('UPDATE epis SET peso = $1 WHERE id = $2', [medida_final, epi_id]);
            } else {
                await pool.query('UPDATE epis SET quantidade = quantidade + $1 WHERE id = $2', [quantidade_retirada, epi_id]);
            }
        }

        const query = `
            UPDATE movimentacoes 
            SET status = 'DEVOLVIDO', data_devolucao = CURRENT_TIMESTAMP, medida_final = $1, consumo = $2
            WHERE id = $3 RETURNING *
        `;
        const result = await pool.query(query, [medida_final || null, consumo, id]);
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao registrar devolução.' });
    }
});

// Excluir Movimentação (Limpar histórico)
app.delete('/api/movimentacoes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM movimentacoes WHERE id = $1', [id]);
        res.json({ message: 'Registro de movimentação excluído.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir movimentação.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});