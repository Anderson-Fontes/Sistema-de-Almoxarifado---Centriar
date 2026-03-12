import React, { useState, useEffect } from 'react';
import { Offcanvas } from 'react-bootstrap';
import api from '../services/api';

const estadoInicialForm = {
    id: null,
    nome: '',
    setor: '',
    status: 'Ativo'
};

export default function Colaboradores() {
    const [colaboradores, setColaboradores] = useState([]);
    const [busca, setBusca] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(estadoInicialForm);
    const [statusFiltro, setStatusFiltro] = useState('');

    const carregarColaboradores = () => {
        api.get('/colaboradores')
            .then(r => setColaboradores(r.data))
            .catch(console.error);
    };

    useEffect(() => { carregarColaboradores(); }, []);

    const abrirPainelNovo = () => { 
        setFormData(estadoInicialForm); 
        setShowForm(true); 
    };

    const prepararEdicao = (c) => {
        setFormData({ ...c });
        setShowForm(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
    };

    const salvarColaborador = (e) => {
        e.preventDefault();
        const req = formData.id
            ? api.put(`/colaboradores/${formData.id}`, formData)
            : api.post('/colaboradores', formData);
            
        req.then(() => { 
            setShowForm(false); 
            carregarColaboradores(); 
        })
        .catch(() => alert('Erro ao salvar colaborador.'));
    };

    const colaboradoresFiltrados = colaboradores.filter(c => {
        const matchBusca =
            c.nome.toLowerCase().includes(busca.toLowerCase()) ||
            c.setor.toLowerCase().includes(busca.toLowerCase());
        const matchStatus = statusFiltro === '' || c.status === statusFiltro;
        return matchBusca && matchStatus;
    });

    const ativos = colaboradores.filter(c => c.status === 'Ativo').length;
    const inativos = colaboradores.filter(c => c.status === 'Inativo').length;

    return (
        <div>
            {/* ─── KPI CARDS ─── */}
            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>
                        <i className="bi bi-people-fill"></i>
                    </div>
                    <div className="kpi-value">{colaboradores.length}</div>
                    <div className="kpi-label">Total de Colaboradores</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}>
                        <i className="bi bi-person-check-fill"></i>
                    </div>
                    <div className="kpi-value">{ativos}</div>
                    <div className="kpi-label">Colaboradores Ativos</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                        <i className="bi bi-person-x-fill"></i>
                    </div>
                    <div className="kpi-value">{inativos}</div>
                    <div className="kpi-label">Colaboradores Inativos</div>
                </div>
            </div>

            {/* ─── PAINEL PRINCIPAL ─── */}
            <div className="panel">
                {/* Toolbar */}
                <div className="panel-header">
                    <div className="panel-title">
                        <i className="bi bi-person-badge-fill"></i>
                        Gestão de Equipe
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 4 }}>
                            {colaboradoresFiltrados.length} registros
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        {/* Filtro por status */}
                        <select
                            className="form-select-custom"
                            style={{ width: 'auto', fontSize: 12.5, padding: '7px 32px 7px 12px' }}
                            value={statusFiltro}
                            onChange={e => setStatusFiltro(e.target.value)}
                        >
                            <option value="">Todos os status</option>
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </select>

                        {/* Busca */}
                        <div className="search-box">
                            <i className="bi bi-search"></i>
                            <input
                                className="search-input"
                                placeholder="Buscar colaborador..."
                                value={busca}
                                onChange={e => setBusca(e.target.value)}
                            />
                        </div>

                        <button className="btn-primary-custom" onClick={abrirPainelNovo}>
                            <i className="bi bi-person-plus-fill"></i>
                            Novo Colaborador
                        </button>
                    </div>
                </div>

                {/* Tabela */}
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: '10%' }}>ID</th>
                                <th>Nome do Colaborador</th>
                                <th>Setor / Função</th>
                                <th style={{ textAlign: 'center' }}>Status</th>
                                <th style={{ textAlign: 'right' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {colaboradoresFiltrados.map(colab => (
                                <tr key={colab.id}>
                                    <td>
                                        <span className="cell-mono">#{colab.id}</span>
                                    </td>
                                    <td>
                                        <div className="cell-main">{colab.nome}</div>
                                    </td>
                                    <td>
                                        <div className="cell-sub" style={{ fontSize: 13, background: 'var(--background-alt)', padding: '4px 10px', borderRadius: 20, display: 'inline-block' }}>
                                            {colab.setor}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`badge-pill ${colab.status === 'Ativo' ? 'badge-epi' : 'badge-gas'}`}>
                                            <i className={`bi ${colab.status === 'Ativo' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`} style={{ fontSize: 10 }}></i>
                                            {colab.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button className="btn-ghost" onClick={() => prepararEdicao(colab)}>
                                            <i className="bi bi-pencil-square"></i>
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {colaboradoresFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="empty-state">
                                            <div className="empty-state-icon"><i className="bi bi-people"></i></div>
                                            <div className="empty-state-title">Nenhum colaborador encontrado</div>
                                            <div className="empty-state-text">Verifique os termos de busca ou filtros aplicados</div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ─── OFFCANVAS FORMULÁRIO ─── */}
            <Offcanvas show={showForm} onHide={() => setShowForm(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        {formData.id
                            ? <><i className="bi bi-pencil-square" style={{ color: '#fbbf24', marginRight: 8 }}></i>Editar Colaborador</>
                            : <><i className="bi bi-person-plus-fill" style={{ color: 'var(--primary-light)', marginRight: 8 }}></i>Novo Colaborador</>
                        }
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <form onSubmit={salvarColaborador}>
                        <div className="form-group">
                            <label className="form-label-custom">Nome Completo <span style={{ color: '#f87171' }}>*</span></label>
                            <input className="form-control-custom" type="text" name="nome" required
                                placeholder="Ex: João da Silva" value={formData.nome} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label-custom">Setor / Função <span style={{ color: '#f87171' }}>*</span></label>
                            <input className="form-control-custom" type="text" name="setor" required
                                placeholder="Ex: Obras, TI, Manutenção" value={formData.setor} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label-custom">Status no Sistema</label>
                            <select className="form-select-custom" name="status" value={formData.status} onChange={handleChange}>
                                <option value="Ativo">Ativo (Permitido retirar EPIs)</option>
                                <option value="Inativo">Inativo (Bloqueado)</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 40 }}>
                            <button type="submit" className="btn-primary-custom" style={{ justifyContent: 'center', padding: '11px', fontSize: 14, width: '100%', borderRadius: 10 }}>
                                {formData.id ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                            </button>
                            <button type="button" className="btn-ghost" style={{ justifyContent: 'center', padding: '11px', fontSize: 14, width: '100%', borderRadius: 10 }}
                                onClick={() => setShowForm(false)}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}