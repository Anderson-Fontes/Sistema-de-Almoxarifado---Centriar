const express = require('express');
const cors = require('cors');
const pool = require('./database');
const path = require('path');

const jwt = require('jsonwebtoken');
const SEGREDO = 'chave_super_secreta_centriar_2026';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// =======================================================
// --- ROTA DE LOGIN ---
// =======================================================
app.post('/api/login', async (req, res) => {
    const { cpf, senha } = req.body;
    try {
        const { rows } = await pool.query('SELECT * FROM usuarios WHERE cpf = $1 AND senha = $2', [cpf, senha]);
        if (rows.length === 0) return res.status(401).json({ error: 'CPF ou senha inválidos' });
        
        const usuario = rows[0];
        const token = jwt.sign({ id: usuario.id, perfil: usuario.perfil }, SEGREDO, { expiresIn: '8h' });
        
        res.json({ 
            token, 
            user: { 
                id: usuario.id, 
                cpf: usuario.cpf, 
                nome: usuario.nome, 
                perfil: usuario.perfil, 
                funcao: usuario.funcao 
            } 
        });
    } catch (err) { 
        console.error("Erro no login:", err);
        res.status(500).json({ error: 'Erro no servidor' }); 
    }
});

// =======================================================
// --- BARREIRA DE SEGURANÇA ADMIN ---
// =======================================================
const verificarAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, SEGREDO);
        if (payload.perfil !== 'ADMIN') return res.status(403).json({ error: 'Apenas Administradores.' });
        
        req.usuarioToken = payload; 
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido.' });
    }
};

// =======================================================
// --- ROTAS DE GERENCIAMENTO DE USUÁRIOS (SISTEMA) ---
// =======================================================
app.get('/api/usuarios', verificarAdmin, async (req, res) => {
    try {
        if (req.usuarioToken.id === 1) {
            const query = 'SELECT id, nome, cpf, perfil, funcao, senha FROM usuarios ORDER BY id ASC';
            const result = await pool.query(query);
            return res.json(result.rows);
        } else {
            const query = 'SELECT id, nome, cpf, perfil, funcao FROM usuarios WHERE id != 1 ORDER BY nome ASC';
            const result = await pool.query(query);
            return res.json(result.rows);
        }
    } catch (err) { 
        console.error("Erro ao buscar usuários:", err);
        res.status(500).json({ error: 'Erro ao buscar usuários.' }); 
    }
});

app.post('/api/usuarios', verificarAdmin, async (req, res) => {
    const { nome, cpf, senha, perfil, funcao } = req.body;
    try {
        const query = `INSERT INTO usuarios (nome, cpf, senha, perfil, funcao) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, cpf, perfil, funcao`;
        const result = await pool.query(query, [nome, cpf, senha, perfil || 'VISUALIZADOR', funcao || null]);
        res.json(result.rows[0]);
    } catch (err) {
        if(err.code === '23505') return res.status(400).json({error: 'Este CPF já possui cadastro.'});
        console.error("Erro ao cadastrar usuário:", err);
        res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
});

app.put('/api/usuarios/:id', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    const { nome, cpf, senha, perfil, funcao } = req.body;
    
    if (id === '1' && req.usuarioToken.id !== 1) {
        return res.status(403).json({ error: 'Você não tem permissão para alterar o Super Admin.' });
    }

    try {
        let query, params;
        if (senha && senha.trim() !== '') {
            query = `UPDATE usuarios SET nome = $1, cpf = $2, senha = $3, perfil = $4, funcao = $5 WHERE id = $6 RETURNING id, nome, cpf, perfil, funcao`;
            params = [nome, cpf, senha, perfil, funcao || null, id];
        } else {
            query = `UPDATE usuarios SET nome = $1, cpf = $2, perfil = $3, funcao = $4 WHERE id = $5 RETURNING id, nome, cpf, perfil, funcao`;
            params = [nome, cpf, perfil, funcao || null, id];
        }
        const result = await pool.query(query, params);
        res.json(result.rows[0]);
    } catch (err) {
        if(err.code === '23505') return res.status(400).json({error: 'Este CPF já possui cadastro.'});
        console.error("Erro ao atualizar usuário:", err);
        res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
});

app.delete('/api/usuarios/:id', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        if (id === '1') return res.status(403).json({ error: 'O usuário principal não pode ser excluído.' });
        await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        res.json({ message: 'Usuário excluído com sucesso.' });
    } catch (err) { 
        console.error("Erro ao excluir usuário:", err);
        res.status(500).json({ error: 'Erro ao excluir usuário.' }); 
    }
});

// =======================================================
// --- ROTAS DE ESTOQUE (EPIS E MATERIAIS) ---
// =======================================================
app.get('/api/epis', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM epis ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) { 
        console.error("Erro ao buscar epis:", err);
        res.status(500).json({ error: 'Erro ao buscar dados do banco.' }); 
    }
});

app.post('/api/epis', verificarAdmin, async (req, res) => {
    const { codigo_identificacao, nome, categoria, numero_ca, validade_ca, quantidade, peso, comprimento, estoque_minimo, peso_minimo, estado, bitola, nivel_pacote, voltagem, gas_refrigerante, btu, tecnologia } = req.body;
    try {
        const query = `
            INSERT INTO epis (nome, categoria, numero_ca, validade_ca, quantidade, peso, comprimento, codigo_identificacao, estoque_minimo, peso_minimo, estado, bitola, nivel_pacote, voltagem, gas_refrigerante, btu, tecnologia) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *
        `;
        const result = await pool.query(query, [
            nome, categoria, numero_ca, validade_ca || null, quantidade || 0, 
            peso || null, comprimento || null, codigo_identificacao || null, 
            estoque_minimo || 0, peso_minimo || 0, estado || 'Novo', bitola || '1/4', nivel_pacote || null,
            voltagem || null, gas_refrigerante || null, btu || null, tecnologia || null
        ]);
        res.json(result.rows[0]);
    } catch (err) { 
        console.error("Erro ao salvar epi:", err);
        res.status(500).json({ error: 'Erro ao salvar.' }); 
    }
});

app.put('/api/epis/:id', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    const { codigo_identificacao, nome, categoria, numero_ca, validade_ca, quantidade, peso, comprimento, estoque_minimo, peso_minimo, estado, bitola, nivel_pacote, voltagem, gas_refrigerante, btu, tecnologia } = req.body;
    try {
        const query = `
            UPDATE epis 
            SET nome = $1, categoria = $2, numero_ca = $3, validade_ca = $4, 
                quantidade = $5, peso = $6, comprimento = $7, codigo_identificacao = $8, 
                estoque_minimo = $9, peso_minimo = $10, estado = $11, bitola = $12, nivel_pacote = $13,
                voltagem = $14, gas_refrigerante = $15, btu = $16, tecnologia = $17
            WHERE id = $18 RETURNING *
        `;
        const result = await pool.query(query, [
            nome, categoria, numero_ca, validade_ca || null, quantidade || 0, 
            peso || null, comprimento || null, codigo_identificacao || null, 
            estoque_minimo || 0, peso_minimo || 0, estado || 'Novo', bitola || '1/4', nivel_pacote || null,
            voltagem || null, gas_refrigerante || null, btu || null, tecnologia || null, id
        ]);
        res.json(result.rows[0]);
    } catch (err) { 
        console.error("Erro ao atualizar epi:", err);
        res.status(500).json({ error: 'Erro ao atualizar.' }); 
    }
});

app.delete('/api/epis/:id', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE movimentacoes SET epi_id = NULL WHERE epi_id = $1', [id]);
        await pool.query('UPDATE agendamentos SET epi_id = NULL WHERE epi_id = $1', [id]);
        await pool.query('DELETE FROM epis WHERE id = $1', [id]);
        res.json({ message: 'Material excluído com sucesso.' });
    } catch (err) { 
        console.error("🔥 ERRO AO DELETAR EPI:", err);
        res.status(500).json({ error: 'Erro ao excluir o material.' }); 
    }
});

// =======================================================
// --- ROTAS DE COLABORADORES (EQUIPE) ---
// =======================================================
app.get('/api/colaboradores', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM colaboradores ORDER BY nome ASC');
        res.json(result.rows);
    } catch (err) { 
        console.error("Erro ao buscar colaboradores:", err);
        res.status(500).json({ error: 'Erro ao buscar colaboradores.' }); 
    }
});

app.post('/api/colaboradores', verificarAdmin, async (req, res) => {
    const { nome, setor, status } = req.body;
    try {
        const query = `INSERT INTO colaboradores (nome, setor, status) VALUES ($1, $2, $3) RETURNING *`;
        const result = await pool.query(query, [nome, setor, status || 'Ativo']);
        res.json(result.rows[0]);
    } catch (err) { 
        console.error("Erro ao cadastrar colaborador:", err);
        res.status(500).json({ error: 'Erro ao cadastrar colaborador.' }); 
    }
});

app.put('/api/colaboradores/:id', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    const { nome, setor, status } = req.body;
    try {
        const query = `UPDATE colaboradores SET nome = $1, setor = $2, status = $3 WHERE id = $4 RETURNING *`;
        const result = await pool.query(query, [nome, setor, status, id]);
        res.json(result.rows[0]);
    } catch (err) { 
        console.error("Erro ao atualizar colaborador:", err);
        res.status(500).json({ error: 'Erro ao atualizar colaborador.' }); 
    }
});

app.delete('/api/colaboradores/:id', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE movimentacoes SET colaborador_id = NULL WHERE colaborador_id = $1', [id]);
        await pool.query('UPDATE agendamentos SET colaborador_id = NULL WHERE colaborador_id = $1', [id]);
        await pool.query('UPDATE registros_ficha_epi SET colaborador_id = NULL WHERE colaborador_id = $1', [id]);
        await pool.query('DELETE FROM colaboradores WHERE id = $1', [id]);
        res.json({ message: 'Colaborador excluído com sucesso.' });
    } catch (err) { 
        console.error("Erro ao excluir colaborador:", err);
        res.status(500).json({ error: 'Erro ao excluir o colaborador.' }); 
    }
});

// =======================================================
// --- ROTAS DE MOVIMENTAÇÕES (RETIRADAS E DEVOLUÇÕES) ---
// =======================================================
app.get('/api/movimentacoes', async (req, res) => {
    try {
        const query = `
            SELECT m.*, c.nome as colaborador_nome, e.nome as material_nome_atual, e.categoria, e.btu, e.gas_refrigerante, e.voltagem, e.tecnologia 
            FROM movimentacoes m
            LEFT JOIN colaboradores c ON m.colaborador_id = c.id
            LEFT JOIN epis e ON m.epi_id = e.id
            ORDER BY m.id DESC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) { 
        console.error("Erro ao buscar movimentacoes:", err);
        res.status(500).json({ error: 'Erro ao buscar movimentações.' }); 
    }
});

app.post('/api/movimentacoes/retirar', verificarAdmin, async (req, res) => {
    const { epi_id, colaborador_id, quantidade_retirada, medida_inicial, nome_material_salvo, destino } = req.body;
    try {
        const query = `
            INSERT INTO movimentacoes (epi_id, colaborador_id, quantidade_retirada, medida_inicial, status, data_retirada, epi_nome, destino)
            VALUES ($1, $2, $3, $4, 'EM_USO', CURRENT_TIMESTAMP, $5, $6) RETURNING *
        `;
        const result = await pool.query(query, [epi_id, colaborador_id, quantidade_retirada, medida_inicial || null, nome_material_salvo, destino || 'Uso Contínuo']);
        
        await pool.query('UPDATE epis SET quantidade = quantidade - $1 WHERE id = $2', [quantidade_retirada, epi_id]);
        res.json(result.rows[0]);
    } catch (err) { 
        console.error("Erro ao retirar movimentacao:", err);
        res.status(500).json({ error: 'Erro ao registrar retirada.' }); 
    }
});

app.put('/api/movimentacoes/:id/devolver', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    const { epi_id, quantidade_retirada, quantidade_devolvida, estado_devolucao, medida_inicial, medida_final, categoria } = req.body;
    
    try {
        let consumo = 0;
        let qtdDevolvida = parseFloat(quantidade_devolvida) || 0;

        if (epi_id) {
            if (categoria === 'Gás' || categoria === 'Cobre') {
                consumo = parseFloat(medida_inicial || 0) - parseFloat(medida_final || 0);
                await pool.query('UPDATE epis SET peso = $1, estado = $2 WHERE id = $3', [medida_final, estado_devolucao, epi_id]);
            } else {
                consumo = parseFloat(quantidade_retirada || 0) - qtdDevolvida;
                await pool.query('UPDATE epis SET quantidade = quantidade + $1, estado = $2 WHERE id = $3', [qtdDevolvida, estado_devolucao, epi_id]);
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
        console.error("Erro ao devolver movimentacao:", err);
        res.status(500).json({ error: 'Erro ao registrar devolução.' }); 
    }
});

app.delete('/api/movimentacoes/:id', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM movimentacoes WHERE id = $1', [id]);
        res.json({ message: 'Registro excluído.' });
    } catch (err) { 
        console.error("Erro ao excluir movimentacao:", err);
        res.status(500).json({ error: 'Erro ao excluir movimentação.' }); 
    }
});

// =======================================================
// --- ROTAS DE AGENDAMENTOS ---
// =======================================================
app.get('/api/agendamentos', async (req, res) => {
    try {
        const query = `
            SELECT a.*, c.nome as colaborador_nome, e.nome as material_nome_atual, e.categoria, e.peso as peso_atual, e.quantidade as qtd_atual, e.btu, e.gas_refrigerante, e.voltagem, e.tecnologia
            FROM agendamentos a
            LEFT JOIN colaboradores c ON a.colaborador_id = c.id
            LEFT JOIN epis e ON a.epi_id = e.id
            ORDER BY a.data_agendada ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) { 
        console.error("Erro ao buscar agendamentos:", err);
        res.status(500).json({ error: 'Erro ao buscar agendamentos.' }); 
    }
});

app.post('/api/agendamentos', verificarAdmin, async (req, res) => {
    const { epi_id, colaborador_id, quantidade, data_agendada, destino } = req.body;
    try {
        const query = `
            INSERT INTO agendamentos (colaborador_id, epi_id, quantidade, data_agendada, status, destino)
            VALUES ($1, $2, $3, $4, 'AGENDADO', $5) RETURNING *
        `;
        const result = await pool.query(query, [colaborador_id, epi_id, quantidade, data_agendada, destino || 'Uso Contínuo']);
        res.json(result.rows[0]);
    } catch (err) { 
        console.error("Erro ao agendar:", err);
        res.status(500).json({ error: 'Erro ao agendar.' }); 
    }
});

app.put('/api/agendamentos/:id/confirmar', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    const { epi_id, colaborador_id, quantidade, epi_nome, medida_inicial, categoria, destino } = req.body;
    
    try {
        const epiRes = await pool.query('SELECT quantidade, peso FROM epis WHERE id = $1', [epi_id]);
        const epi = epiRes.rows[0];
        
        if (!epi) return res.status(400).json({ error: 'Material não existe mais no estoque.' });

        if ((categoria === 'Gás' || categoria === 'Cobre') && epi.peso <= 0) {
            return res.status(400).json({ error: 'Estoque de peso zerado! Impossível confirmar.' });
        } else if (categoria !== 'Gás' && categoria !== 'Cobre' && parseFloat(epi.quantidade) < parseFloat(quantidade)) {
            return res.status(400).json({ error: `Estoque insuficiente! Tentou retirar ${quantidade}, mas só temos ${epi.quantidade}.` });
        }

        await pool.query('UPDATE agendamentos SET status = $1 WHERE id = $2', ['RETIRADO', id]);
        
        const movQuery = `
            INSERT INTO movimentacoes (epi_id, colaborador_id, quantidade_retirada, medida_inicial, status, data_retirada, epi_nome, destino)
            VALUES ($1, $2, $3, $4, 'EM_USO', CURRENT_TIMESTAMP, $5, $6) RETURNING *
        `;
        await pool.query(movQuery, [epi_id, colaborador_id, quantidade, medida_inicial || null, epi_nome, destino || 'Uso Contínuo']);
        
        if (categoria !== 'Gás' && categoria !== 'Cobre') {
            await pool.query('UPDATE epis SET quantidade = quantidade - $1 WHERE id = $2', [quantidade, epi_id]);
        }

        res.json({ message: 'Retirada confirmada com sucesso!' });
    } catch (err) { 
        console.error("Erro ao confirmar agendamento:", err);
        res.status(500).json({ error: 'Erro ao confirmar agendamento.' }); 
    }
});

app.put('/api/agendamentos/:id/cancelar', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('UPDATE agendamentos SET status = $1 WHERE id = $2', ['CANCELADO', id]);
        res.json({ message: 'Agendamento cancelado.' });
    } catch (err) { 
        console.error("Erro ao cancelar agendamento:", err);
        res.status(500).json({ error: 'Erro ao cancelar agendamento.' }); 
    }
});

app.delete('/api/agendamentos/:id', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM agendamentos WHERE id = $1', [id]);
        res.json({ message: 'Agendamento excluído.' });
    } catch (err) { 
        console.error("Erro ao excluir agendamento:", err);
        res.status(500).json({ error: 'Erro ao excluir agendamento.' }); 
    }
});

// =======================================================
// --- ROTAS DA FICHA DE EPI ---
// =======================================================

// 1. Buscar a Ficha de EPI completa de UM colaborador específico
app.get('/api/fichas-epi/colaborador/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT f.*, e.nome as epi_nome, e.categoria 
            FROM registros_ficha_epi f
            LEFT JOIN epis e ON f.epi_id = e.id
            WHERE f.colaborador_id = $1
            ORDER BY f.data_retirada DESC
        `;
        const result = await pool.query(query, [id]);
        res.json(result.rows);
    } catch (err) { 
        console.error("Erro ao buscar ficha de EPI:", err);
        res.status(500).json({ error: 'Erro ao buscar ficha do colaborador.' }); 
    }
});

// 2. Adicionar um novo item na Ficha do Colaborador (Entregar EPI)
app.post('/api/fichas-epi', verificarAdmin, async (req, res) => {
    const { colaborador_id, epi_id, nome_manual, ca_registrado, data_retirada, data_vencimento, proxima_troca, quantidade, observacoes } = req.body;
    
    const epiIdTratado = epi_id ? epi_id : null;

    try {
        const query = `
            INSERT INTO registros_ficha_epi 
            (colaborador_id, epi_id, nome_manual, ca_registrado, data_retirada, data_vencimento, proxima_troca, quantidade, observacoes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
        `;
        const result = await pool.query(query, [
            colaborador_id, 
            epiIdTratado, 
            nome_manual || null, 
            ca_registrado, 
            data_retirada, 
            data_vencimento || null, 
            proxima_troca || null, 
            quantidade || 1, 
            observacoes || ''
        ]);
        
        if (epiIdTratado) {
            await pool.query('UPDATE epis SET quantidade = quantidade - $1 WHERE id = $2', [quantidade || 1, epiIdTratado]);
        }

        res.json(result.rows[0]);
    } catch (err) { 
        console.error("Erro ao registrar EPI na ficha:", err);
        res.status(500).json({ error: 'Erro ao adicionar item na ficha.' }); 
    }
});

// 3. Atualizar um item da Ficha do Colaborador (Editar) - 🔥 CORRIGIDO!
app.put('/api/fichas-epi/:id', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    const { epi_id, nome_manual, ca_registrado, data_retirada, data_vencimento, proxima_troca, quantidade, observacoes } = req.body;
    
    // Tratamos o ID: se for string vazia, vira null para o Postgres aceitar
    const epiIdTratado = epi_id ? epi_id : null;

    try {
        const query = `
            UPDATE registros_ficha_epi 
            SET epi_id = $1, 
                nome_manual = $2, 
                ca_registrado = $3, 
                data_retirada = $4, 
                data_vencimento = $5, 
                proxima_troca = $6, 
                quantidade = $7, 
                observacoes = $8
            WHERE id = $9 RETURNING *
        `;
        const result = await pool.query(query, [
            epiIdTratado, 
            nome_manual || null, 
            ca_registrado, 
            data_retirada, 
            data_vencimento || null, 
            proxima_troca || null, 
            quantidade || 1, 
            observacoes || '', 
            id
        ]);
        res.json(result.rows[0]);
    } catch (err) { 
        console.error("Erro ao atualizar ficha de EPI:", err);
        res.status(500).json({ error: 'Erro ao atualizar registro.' }); 
    }
});

// 4. Deletar um registro da ficha (Caso tenha lançado errado)
app.delete('/api/fichas-epi/:id', verificarAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM registros_ficha_epi WHERE id = $1', [id]);
        res.json({ message: 'Registro removido da ficha com sucesso.' });
    } catch (err) { 
        console.error("Erro ao deletar registro da ficha:", err);
        res.status(500).json({ error: 'Erro ao excluir registro.' }); 
    }
});

const PORT = 3000;
app.listen(PORT, () => { console.log(`🚀 Servidor rodando na porta ${PORT}`); });