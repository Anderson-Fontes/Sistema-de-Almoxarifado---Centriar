import React, { useState, useEffect, useCallback } from 'react';
import { Offcanvas, Modal } from 'react-bootstrap';
import api from '../services/api';

export default function Movimentacoes() {
    const [viewMode, setViewMode] = useState('historico'); 
    
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);
    const [materiais, setMateriais] = useState([]);
    const [colaboradores, setColaboradores] = useState([]);
    const [filtroStatus, setFiltroStatus] = useState('');
    const [busca, setBusca] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [showDevolucao, setShowDevolucao] = useState(false);
    const [itemDevolucao, setItemDevolucao] = useState(null);

    const formInicial = { epi_id: '', colaborador_id: '', quantidade: 1, medida_inicial: '', data_agendada: '', destino: 'Uso Contínuo' };
    const [formData, setFormData] = useState(formInicial);
    
    const [medidaFinal, setMedidaFinal] = useState('');
    const [quantidadeDevolvida, setQuantidadeDevolvida] = useState('');
    const [estadoDevolucao, setEstadoDevolucao] = useState('Bom Estado');

    const carregarDados = useCallback(() => {
        api.get('/movimentacoes').then(r => setMovimentacoes(r.data)).catch(console.error);
        api.get('/agendamentos').then(r => setAgendamentos(r.data)).catch(console.error);
        api.get('/epis').then(r => setMateriais(r.data)).catch(console.error);
        api.get('/colaboradores').then(r => setColaboradores(r.data.filter(c => c.status === 'Ativo'))).catch(console.error);
    }, []);

    useEffect(() => { carregarDados(); }, [carregarDados]);

    const handleMaterialChange = (e) => {
        const mat = materiais.find(m => m.id === parseInt(e.target.value));
        setFormData({ ...formData, epi_id: e.target.value, medida_inicial: mat?.peso || mat?.comprimento || '' });
    };

    const abrirForm = () => { setFormData(formInicial); setShowForm(true); };

    const salvarRegistro = (e) => {
        e.preventDefault();
        const mat = materiais.find(m => m.id === parseInt(formData.epi_id));
        const payload = { ...formData, nome_material_salvo: mat?.nome, quantidade_retirada: formData.quantidade };

        if (viewMode === 'historico') {
            api.post('/movimentacoes/retirar', payload)
                .then(() => { setShowForm(false); carregarDados(); })
                .catch(() => alert('Erro ao registrar retirada.'));
        } else {
            api.post('/agendamentos', payload)
                .then(() => { setShowForm(false); carregarDados(); })
                .catch(() => alert('Erro ao agendar.'));
        }
    };

    const abrirDevolucao = (mov) => { 
        setItemDevolucao(mov); 
        setMedidaFinal(''); 
        setQuantidadeDevolvida(mov.quantidade_retirada);
        const mat = materiais.find(m => m.id === mov.epi_id);
        setEstadoDevolucao(mat?.estado || 'Bom Estado');
        setShowDevolucao(true); 
    };
    
    const registrarDevolucao = () => {
        const payload = { 
            epi_id: itemDevolucao.epi_id, 
            quantidade_retirada: itemDevolucao.quantidade_retirada, 
            quantidade_devolvida: quantidadeDevolvida,
            estado_devolucao: estadoDevolucao,
            medida_inicial: itemDevolucao.medida_inicial, 
            medida_final: medidaFinal || null, 
            categoria: itemDevolucao.categoria 
        };
        
        api.put(`/movimentacoes/${itemDevolucao.id}/devolver`, payload)
           .then(() => { setShowDevolucao(false); carregarDados(); })
           .catch(() => alert('Erro ao devolver.'));
    };

    const confirmarAgendamento = (ag) => {
        if (window.confirm(`Deseja confirmar a retirada de ${ag.material_nome_atual} por ${ag.colaborador_nome} agora?`)) {
            const mat = materiais.find(m => m.id === ag.epi_id);
            const payload = { epi_id: ag.epi_id, colaborador_id: ag.colaborador_id, quantidade: ag.quantidade, epi_nome: ag.material_nome_atual, medida_inicial: mat?.peso || null, categoria: ag.categoria, destino: ag.destino };
            
            api.put(`/agendamentos/${ag.id}/confirmar`, payload)
                .then(() => { alert('Retirada confirmada!'); carregarDados(); })
                .catch(err => alert(err.response?.data?.error || 'Erro ao confirmar. Estoque pode estar insuficiente.'));
        }
    };

    const cancelarAgendamento = (id) => {
        if (window.confirm("Cancelar este agendamento?")) {
            api.put(`/agendamentos/${id}/cancelar`).then(() => carregarDados()).catch(() => alert('Erro ao cancelar.'));
        }
    };

    const excluirRegistro = async (id, tipo) => {
        if (window.confirm("Excluir este registro permanentemente do sistema?")) {
            const url = tipo === 'movimentacao' ? `/movimentacoes/${id}` : `/agendamentos/${id}`;
            try { await api.delete(url); carregarDados(); } catch (error) { alert('Erro ao excluir.'); }
        }
    };

    const formatarData = (d) => d ? new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : null;

    const dadosExibidos = viewMode === 'historico' ? movimentacoes : agendamentos;
    const itensFiltrados = dadosExibidos.filter(i => {
        const matchStatus = filtroStatus === '' || i.status === filtroStatus;
        const matchBusca = busca === '' || i.colaborador_nome?.toLowerCase().includes(busca.toLowerCase()) || (i.material_nome_atual || i.epi_nome)?.toLowerCase().includes(busca.toLowerCase()) || i.destino?.toLowerCase().includes(busca.toLowerCase());
        return matchStatus && matchBusca;
    });

    const matSelecionado = materiais.find(m => m.id === parseInt(formData.epi_id));
    const requerMedida = itemDevolucao?.categoria === 'Gás' || itemDevolucao?.categoria === 'Cobre';
    
    const estoqueInsuficiente = matSelecionado && (
        (matSelecionado.categoria === 'Gás' || matSelecionado.categoria === 'Cobre' ? parseFloat(matSelecionado.peso) <= 0 : parseFloat(matSelecionado.quantidade) < parseFloat(formData.quantidade))
    );

    return (
        <div>
            {/* ─── NAVEGAÇÃO SUPERIOR (ABAS) ─── */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
                <button 
                    onClick={() => { setViewMode('historico'); setFiltroStatus(''); }}
                    style={{ background: 'none', border: 'none', fontSize: '1.1rem', fontWeight: viewMode === 'historico' ? 800 : 600, color: viewMode === 'historico' ? '#4f46e5' : '#64748b', transition: '0.2s', padding: '8px 16px', borderRadius: '8px', backgroundColor: viewMode === 'historico' ? 'rgba(79, 70, 229, 0.1)' : 'transparent' }}
                >
                    <i className="bi bi-journal-text me-2"></i> Histórico de Cautelas
                </button>
                <button 
                    onClick={() => { setViewMode('agendamentos'); setFiltroStatus(''); }}
                    style={{ background: 'none', border: 'none', fontSize: '1.1rem', fontWeight: viewMode === 'agendamentos' ? 800 : 600, color: viewMode === 'agendamentos' ? '#f59e0b' : '#64748b', transition: '0.2s', padding: '8px 16px', borderRadius: '8px', backgroundColor: viewMode === 'agendamentos' ? 'rgba(245, 158, 11, 0.1)' : 'transparent' }}
                >
                    <i className="bi bi-calendar-check me-2"></i> Agenda Futura
                </button>
            </div>

            {/* ─── PAINEL PRINCIPAL ─── */}
            <div className="panel" style={{ marginTop: 0 }}>
                <div className="panel-header">
                    <div className="panel-title">
                        {viewMode === 'historico' ? <><i className="bi bi-inboxes-fill"></i> Registros de Retirada</> : <><i className="bi bi-clock-history"></i> Agendamentos Cadastrados</>}
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 8 }}>{itensFiltrados.length} encontrados</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                            <button className={filtroStatus === '' ? 'btn-primary-custom' : 'btn-ghost'} style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setFiltroStatus('')}>Todos</button>
                            {viewMode === 'historico' ? (
                                <>
                                    <button className={filtroStatus === 'EM_USO' ? 'btn-primary-custom' : 'btn-ghost'} style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setFiltroStatus('EM_USO')}>Em Uso</button>
                                    <button className={filtroStatus === 'DEVOLVIDO' ? 'btn-primary-custom' : 'btn-ghost'} style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setFiltroStatus('DEVOLVIDO')}>Devolvidos</button>
                                </>
                            ) : (
                                <>
                                    <button className={filtroStatus === 'AGENDADO' ? 'btn-primary-custom' : 'btn-ghost'} style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setFiltroStatus('AGENDADO')}>Pendentes</button>
                                    <button className={filtroStatus === 'RETIRADO' ? 'btn-primary-custom' : 'btn-ghost'} style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setFiltroStatus('RETIRADO')}>Retirados</button>
                                    <button className={filtroStatus === 'CANCELADO' ? 'btn-primary-custom' : 'btn-ghost'} style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setFiltroStatus('CANCELADO')}>Cancelados</button>
                                </>
                            )}
                        </div>
                        <div className="search-box"><i className="bi bi-search"></i><input className="search-input" placeholder="Buscar local, pessoa..." value={busca} onChange={e => setBusca(e.target.value)} /></div>
                        
                        <button className="btn-primary-custom" onClick={abrirForm}>
                            {viewMode === 'historico' ? <><i className="bi bi-box-arrow-right"></i> Retirar Agora</> : <><i className="bi bi-calendar-plus"></i> Agendar Retirada</>}
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Colaborador</th>
                                <th>Material / Destino</th>
                                <th>{viewMode === 'historico' ? 'Retirada' : 'Data e Hora Prevista'}</th>
                                {viewMode === 'historico' && <th>Devolução / Consumo</th>}
                                <th style={{ textAlign: 'center' }}>Status</th>
                                <th style={{ textAlign: 'right' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itensFiltrados.map(item => (
                                <tr key={item.id} style={{ opacity: item.status === 'CANCELADO' ? 0.6 : 1 }}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                                                {item.colaborador_nome ? item.colaborador_nome.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div className="fw-bold text-dark">{item.colaborador_nome || 'Desconhecido'}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="cell-main">{item.material_nome_atual || item.epi_nome}</div>
                                        <div className="cell-sub" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span>Qtd: {viewMode === 'historico' ? item.quantidade_retirada : item.quantidade} {item.medida_inicial && `(${item.medida_inicial}kg)`}</span>
                                            <span style={{ color: '#4f46e5', fontWeight: 600, background: 'rgba(79, 70, 229, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                                <i className="bi bi-geo-alt-fill me-1"></i> {item.destino || 'Uso Contínuo'}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
                                            {formatarData(viewMode === 'historico' ? item.data_retirada : item.data_agendada)}
                                        </div>
                                    </td>
                                    {viewMode === 'historico' && (
                                        <td>
                                            <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{formatarData(item.data_devolucao) ?? <span style={{ opacity: 0.3 }}>Pendente</span>}</div>
                                            {item.consumo > 0 && <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 600, marginTop: 2 }}>Consumo: {item.consumo}</div>}
                                        </td>
                                    )}
                                    <td style={{ textAlign: 'center' }}>
                                        {item.status === 'EM_USO' && <span className="badge bg-warning bg-opacity-10 text-warning border border-warning px-3 py-1 rounded-pill"><i className="bi bi-hourglass-split me-1"></i> Em Uso</span>}
                                        {item.status === 'DEVOLVIDO' && <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-1 rounded-pill"><i className="bi bi-check-circle-fill me-1"></i> Devolvido</span>}
                                        {item.status === 'AGENDADO' && <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-3 py-1 rounded-pill"><i className="bi bi-calendar-event me-1"></i> Agendado</span>}
                                        {item.status === 'RETIRADO' && <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-1 rounded-pill"><i className="bi bi-check-all me-1"></i> Retirado</span>}
                                        {item.status === 'CANCELADO' && <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-3 py-1 rounded-pill"><i className="bi bi-x-circle-fill me-1"></i> Cancelado</span>}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            {viewMode === 'historico' && item.status === 'EM_USO' && (
                                                <button className="btn btn-sm btn-outline-success fw-bold" onClick={() => abrirDevolucao(item)}><i className="bi bi-arrow-return-left me-1"></i> Devolver</button>
                                            )}
                                            {viewMode === 'agendamentos' && item.status === 'AGENDADO' && (
                                                <>
                                                    <button className="btn btn-sm btn-success fw-bold text-white shadow-sm" onClick={() => confirmarAgendamento(item)}><i className="bi bi-check2-circle"></i> Liberar</button>
                                                    <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => cancelarAgendamento(item.id)}><i className="bi bi-x-lg"></i></button>
                                                </>
                                            )}
                                            <button className="btn-ghost" style={{ color: '#ef4444', borderColor: 'transparent' }} onClick={() => excluirRegistro(item.id, viewMode === 'historico' ? 'movimentacao' : 'agendamento')}><i className="bi bi-trash3-fill"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {itensFiltrados.length === 0 && <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon"><i className="bi bi-inbox"></i></div><div className="empty-state-title">Nenhum registro encontrado</div></div></td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ─── OFFCANVAS: NOVA RETIRADA / NOVO AGENDAMENTO ─── */}
            <Offcanvas show={showForm} onHide={() => setShowForm(false)} placement="end">
                <Offcanvas.Header closeButton style={{ background: viewMode === 'agendamentos' ? '#fef3c7' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <Offcanvas.Title className="fw-bold text-dark">
                        {viewMode === 'historico' ? <><i className="bi bi-box-arrow-right text-primary me-2"></i>Registrar Retirada</> : <><i className="bi bi-calendar-plus text-warning me-2"></i>Novo Agendamento</>}
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-4">
                    <form onSubmit={salvarRegistro}>
                        
                        {viewMode === 'agendamentos' && (
                            <div className="form-group mb-4">
                                <label className="form-label-custom">Data e Hora da Retirada <span className="text-danger">*</span></label>
                                <input className="form-control-custom fw-bold" type="datetime-local" required value={formData.data_agendada} onChange={e => setFormData({ ...formData, data_agendada: e.target.value })} />
                            </div>
                        )}

                        <div className="form-group mb-3">
                            <label className="form-label-custom">Colaborador <span className="text-danger">*</span></label>
                            <select className="form-select-custom fw-bold" required value={formData.colaborador_id} onChange={e => setFormData({ ...formData, colaborador_id: e.target.value })}>
                                <option value="">Selecione a pessoa...</option>
                                {colaboradores.map(c => <option key={c.id} value={c.id}>{c.nome} — {c.setor}</option>)}
                            </select>
                        </div>

                        <div className="form-group mb-3">
                            <label className="form-label-custom">Material / Ferramenta <span className="text-danger">*</span></label>
                            <select className="form-select-custom fw-bold" required value={formData.epi_id} onChange={handleMaterialChange}>
                                <option value="">Selecione o item...</option>
                                {materiais.map(m => <option key={m.id} value={m.id}>{m.nome} (Estoque: {m.categoria === 'Gás' || m.categoria === 'Cobre' ? `${m.peso}kg` : m.quantidade})</option>)}
                            </select>
                        </div>

                        <div className="row mb-3">
                            <div className="col-6">
                                <label className="form-label-custom">Qtd Solicitada <span className="text-danger">*</span></label>
                                {/* 💡 Agora aceita quantidades quebradas (ex: 2.5 metros de cabo) */}
                                <input className="form-control-custom fw-bold text-primary" type="number" step="0.01" min="0.01" required value={formData.quantidade} onChange={e => setFormData({ ...formData, quantidade: e.target.value })} />
                            </div>
                            <div className="col-6">
                                <label className="form-label-custom">Destino / Uso</label>
                                <input className="form-control-custom" type="text" placeholder="Ex: Obra XPTO..." value={formData.destino} onChange={e => setFormData({ ...formData, destino: e.target.value })} />
                            </div>
                        </div>
                        
                        {estoqueInsuficiente && (
                            <div className="alert-banner mb-4" style={{ background: '#fef2f2', border: '1px solid #ef4444', padding: '12px', borderRadius: '8px' }}>
                                <div style={{ color: '#b91c1c', fontSize: '13px', fontWeight: 600 }}>
                                    <i className="bi bi-exclamation-octagon-fill me-2"></i>
                                    Atenção: O estoque atual é insuficiente para atender essa solicitação completa.
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
                            <button type="submit" className={`btn-primary-custom ${viewMode === 'agendamentos' ? 'bg-warning border-warning text-dark' : ''}`} style={{ justifyContent: 'center', padding: '12px', fontSize: 14, borderRadius: 10 }}>
                                <i className="bi bi-check2-circle"></i> {viewMode === 'historico' ? 'Confirmar Retirada' : 'Salvar Agendamento'}
                            </button>
                            <button type="button" className="btn-ghost" style={{ justifyContent: 'center', padding: '12px', fontSize: 14, borderRadius: 10 }} onClick={() => setShowForm(false)}>Cancelar</button>
                        </div>
                    </form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* ─── MODAL: DEVOLUÇÃO INTELIGENTE ─── */}
            <Modal show={showDevolucao} onHide={() => setShowDevolucao(false)} centered>
                <Modal.Header closeButton><Modal.Title><i className="bi bi-arrow-return-left text-success me-2"></i>Registrar Devolução</Modal.Title></Modal.Header>
                <Modal.Body>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px', marginBottom: 18 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{itemDevolucao?.material_nome_atual || itemDevolucao?.epi_nome}</div>
                        <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 2 }}>Com: <strong>{itemDevolucao?.colaborador_nome}</strong> | Destino: {itemDevolucao?.destino}</div>
                    </div>
                    
                    {requerMedida ? (
                        <div className="form-group mb-3">
                            <label className="form-label-custom text-danger">Medida na devolução (kg) <span className="text-danger">*</span></label>
                            <input className="form-control-custom fw-bold" type="number" step="0.01" placeholder={`Saiu com ${itemDevolucao?.medida_inicial}kg. Voltou com...`} value={medidaFinal} onChange={e => setMedidaFinal(e.target.value)} required style={{ borderColor: '#fca5a5' }} />
                        </div>
                    ) : (
                        <div className="form-group mb-3">
                            <label className="form-label-custom text-primary">Quantidade Devolvida <span className="text-danger">*</span></label>
                            <div className="input-group">
                                {/* 💡 Agora aceita devoluções quebradas (ex: devolveu 1.5 metros) */}
                                <input className="form-control-custom fw-bold" type="number" step="0.01" min="0" max={itemDevolucao?.quantidade_retirada} value={quantidadeDevolvida} onChange={e => setQuantidadeDevolvida(e.target.value)} required />
                                <span className="input-group-text" style={{ fontSize: 12, background: '#f1f5f9' }}>de {itemDevolucao?.quantidade_retirada}</span>
                            </div>
                            <small className="text-muted" style={{ fontSize: 11 }}>Se gastou tudo na obra, coloque 0.</small>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label-custom">Estado Físico da Ferramenta / Material</label>
                        <select className="form-select-custom" value={estadoDevolucao} onChange={e => setEstadoDevolucao(e.target.value)}>
                            <option value="Novo">Novo</option>
                            <option value="Bom Estado">Bom Estado</option>
                            <option value="Marcas de Uso">Marcas de Uso</option>
                            <option value="Com Defeito">Com Defeito</option>
                            <option value="Quebrado / Sucata">Quebrado / Sucata</option>
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn-ghost" onClick={() => setShowDevolucao(false)}>Cancelar</button>
                    <button className="btn btn-success fw-bold text-white shadow-sm" onClick={registrarDevolucao} disabled={requerMedida ? !medidaFinal : quantidadeDevolvida === ''}><i className="bi bi-check2-circle me-2"></i>Confirmar Devolução</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}