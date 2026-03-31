import React, { useState, useEffect } from 'react';
import { Offcanvas } from 'react-bootstrap';
import api from '../services/api';

const estadoInicialForm = { id: null, nome: '', setor: '', status: 'Ativo' };

// 💡 A função agora recebe a propriedade 'user'
export default function Colaboradores({ user }) {
    const [colaboradores, setColaboradores] = useState([]);
    const [busca, setBusca] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(estadoInicialForm);

    const carregarColaboradores = () => {
        api.get('/colaboradores').then(r => setColaboradores(r.data)).catch(console.error);
    };

    useEffect(() => { carregarColaboradores(); }, []);

    const abrirPainelNovo = () => { setFormData(estadoInicialForm); setShowForm(true); };
    const prepararEdicao = (c) => { setFormData(c); setShowForm(true); };

    const excluirColaborador = async (id, nome) => {
        if (window.confirm(`Tem certeza que deseja excluir permanentemente o colaborador "${nome}"?\n\nEle será removido do sistema, mas o histórico de ferramentas que ele pegou no passado continuará nos relatórios.`)) {
            try {
                await api.delete(`/colaboradores/${id}`);
                carregarColaboradores();
            } catch (error) {
                alert('Erro ao tentar excluir colaborador.');
            }
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const salvarColaborador = (e) => {
        e.preventDefault();
        const req = formData.id ? api.put(`/colaboradores/${formData.id}`, formData) : api.post('/colaboradores', formData);
        req.then(() => { setShowForm(false); carregarColaboradores(); }).catch(() => alert('Erro ao salvar.'));
    };

    const colaboradoresFiltrados = colaboradores.filter(c => 
        c.nome.toLowerCase().includes(busca.toLowerCase()) || 
        (c.setor && c.setor.toLowerCase().includes(busca.toLowerCase()))
    );

    return (
        <div>
            <div className="panel">
                <div className="panel-header">
                    <div className="panel-title">
                        <i className="bi bi-people-fill"></i> Equipe
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 8 }}>{colaboradoresFiltrados.length} membros</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div className="search-box">
                            <i className="bi bi-search"></i>
                            <input className="search-input" placeholder="Buscar colaborador..." value={busca} onChange={e => setBusca(e.target.value)} />
                        </div>
                        
                        {/* 💡 Botão bloqueado: Só ADMIN pode adicionar colaboradores */}
                        {user?.perfil === 'ADMIN' && (
                            <button className="btn-primary-custom" onClick={abrirPainelNovo}>
                                <i className="bi bi-person-plus-fill"></i> Novo Colaborador
                            </button>
                        )}
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Colaborador</th>
                                <th>Setor / Departamento</th>
                                <th style={{ textAlign: 'center' }}>Status</th>
                                {/* Se não for Admin, não mostra a palavra "Ações" no cabeçalho */}
                                {user?.perfil === 'ADMIN' && <th style={{ textAlign: 'right' }}>Ações</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {colaboradoresFiltrados.map(colab => (
                                <tr key={colab.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white' }}>
                                                {colab.nome.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="fw-bold text-dark">{colab.nome}</div>
                                        </div>
                                    </td>
                                    <td><span className="badge bg-light text-dark border px-3 py-2">{colab.setor || 'Não informado'}</span></td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`badge-pill ${colab.status === 'Ativo' ? 'badge-cobre' : 'badge-gas'}`}>
                                            {colab.status === 'Ativo' ? <><i className="bi bi-check-circle-fill me-1"></i> Ativo</> : <><i className="bi bi-x-circle-fill me-1"></i> Inativo</>}
                                        </span>
                                    </td>
                                    
                                    {/* 💡 Botões bloqueados: Só ADMIN pode editar e excluir */}
                                    {user?.perfil === 'ADMIN' && (
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button className="btn-ghost" onClick={() => prepararEdicao(colab)} title="Editar"><i className="bi bi-pencil-square"></i></button>
                                                <button className="btn-ghost" style={{ color: '#ef4444', borderColor: 'transparent' }} onClick={() => excluirColaborador(colab.id, colab.nome)} title="Excluir"><i className="bi bi-trash3-fill"></i></button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Offcanvas show={showForm} onHide={() => setShowForm(false)} placement="end" style={{ width: '400px' }}>
                <Offcanvas.Header closeButton style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <Offcanvas.Title className="fw-bold fs-5 text-dark">
                        <i className={`bi ${formData.id ? 'bi-pencil-square text-warning' : 'bi-person-plus-fill text-primary'} me-2`}></i>
                        {formData.id ? 'Editar Colaborador' : 'Novo Colaborador'}
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-4">
                    <form onSubmit={salvarColaborador}>
                        <div className="form-group mb-4">
                            <label className="form-label-custom">Nome Completo <span className="text-danger">*</span></label>
                            <input className="form-control-custom fw-bold" type="text" name="nome" required value={formData.nome} onChange={handleChange} placeholder="Ex: João da Silva" />
                        </div>
                        <div className="form-group mb-4">
                            <label className="form-label-custom">Setor / Função</label>
                            <input className="form-control-custom" type="text" name="setor" value={formData.setor} onChange={handleChange} placeholder="Ex: Manutenção, Instalador..." />
                        </div>
                        <div className="form-group mb-4">
                            <label className="form-label-custom">Status no Sistema</label>
                            <select className="form-select-custom fw-bold" name="status" value={formData.status} onChange={handleChange}>
                                <option value="Ativo">Ativo (Pode retirar materiais)</option>
                                <option value="Inativo">Inativo (Bloqueado)</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
                            <button type="submit" className="btn-primary-custom" style={{ justifyContent: 'center', padding: '12px', fontSize: 14, borderRadius: 10 }}>{formData.id ? 'Salvar Alterações' : 'Cadastrar'}</button>
                            <button type="button" className="btn-ghost" style={{ justifyContent: 'center', padding: '12px', fontSize: 14, borderRadius: 10 }} onClick={() => setShowForm(false)}>Cancelar</button>
                        </div>
                    </form>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}