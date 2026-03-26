import React, { useState, useEffect, useCallback } from 'react';
import { Offcanvas, Modal } from 'react-bootstrap';
import api from '../services/api';

export default function Movimentacoes() {
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [materiais, setMateriais] = useState([]);
    const [colaboradores, setColaboradores] = useState([]);
    const [filtroStatus, setFiltroStatus] = useState('');
    const [busca, setBusca] = useState('');

    const [showNovaRetirada, setShowNovaRetirada] = useState(false);
    const [showDevolucao, setShowDevolucao] = useState(false);
    const [itemDevolucao, setItemDevolucao] = useState(null);

    const [formRetirada, setFormRetirada] = useState({ epi_id: '', colaborador_id: '', quantidade_retirada: 1, medida_inicial: '' });
    const [medidaFinal, setMedidaFinal] = useState('');

    const carregarDados = useCallback(() => {
        api.get('/movimentacoes').then(r => setMovimentacoes(r.data)).catch(console.error);
        api.get('/epis').then(r => setMateriais(r.data.filter(m => m.quantidade > 0 || parseFloat(m.peso) > 0))).catch(console.error);
        api.get('/colaboradores').then(r => setColaboradores(r.data.filter(c => c.status === 'Ativo'))).catch(console.error);
    }, []);

    useEffect(() => { carregarDados(); }, [carregarDados]);

    const handleMaterialChange = (e) => {
        const mat = materiais.find(m => m.id === parseInt(e.target.value));
        setFormRetirada({ ...formRetirada, epi_id: e.target.value, medida_inicial: mat?.peso || mat?.comprimento || '' });
    };

    const registrarRetirada = (e) => {
        e.preventDefault();
        const mat = materiais.find(m => m.id === parseInt(formRetirada.epi_id));
        const payload = { ...formRetirada, nome_material_salvo: mat?.nome };

        api.post('/movimentacoes/retirar', payload)
            .then(() => {
                setShowNovaRetirada(false);
                setFormRetirada({ epi_id: '', colaborador_id: '', quantidade_retirada: 1, medida_inicial: '' });
                carregarDados();
            })
            .catch(() => alert('Erro ao registrar retirada.'));
    };

    const abrirDevolucao = (mov) => { setItemDevolucao(mov); setMedidaFinal(''); setShowDevolucao(true); };

    const registrarDevolucao = () => {
        const payload = {
            epi_id: itemDevolucao.epi_id,
            quantidade_retirada: itemDevolucao.quantidade_retirada,
            medida_inicial: itemDevolucao.medida_inicial,
            medida_final: medidaFinal || null,
            categoria: itemDevolucao.categoria
        };
        api.put(`/movimentacoes/${itemDevolucao.id}/devolver`, payload)
            .then(() => { setShowDevolucao(false); carregarDados(); })
            .catch(() => alert('Erro ao registrar devolução.'));
    };

    const excluirMovimentacao = async (id) => {
        if (window.confirm("Atenção: Você está excluindo este registro do histórico.\n\nIsso NÃO alterará o saldo do estoque atual, apenas apagará a linha deste relatório. Deseja continuar?")) {
            try {
                await api.delete(`/movimentacoes/${id}`);
                carregarDados();
            } catch (error) {
                alert('Erro ao excluir movimentação.');
            }
        }
    };

    const formatarData = (d) => d ? new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : null;

    const emUso = movimentacoes.filter(m => m.status === 'EM_USO').length;
    const devolvidos = movimentacoes.filter(m => m.status === 'DEVOLVIDO').length;

    const movsFiltrados = movimentacoes.filter(m => {
        const matchStatus = filtroStatus === '' || m.status === filtroStatus;
        const matchBusca = busca === '' || m.colaborador_nome?.toLowerCase().includes(busca.toLowerCase()) || m.material_nome_atual?.toLowerCase().includes(busca.toLowerCase()) || m.epi_nome?.toLowerCase().includes(busca.toLowerCase());
        return matchStatus && matchBusca;
    });

    const materialSelecionado = materiais.find(m => m.id === parseInt(formRetirada.epi_id));
    const requerMedida = itemDevolucao?.categoria === 'Gás' || itemDevolucao?.categoria === 'Cobre';

    return (
        <div>
            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}><i className="bi bi-arrow-left-right"></i></div><div className="kpi-value">{movimentacoes.length}</div><div className="kpi-label">Movimentações Totais</div></div>
                <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}><i className="bi bi-person-walking"></i></div><div className="kpi-value">{emUso}</div><div className="kpi-label">Itens em Campo</div></div>
                <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}><i className="bi bi-check2-all"></i></div><div className="kpi-value">{devolvidos}</div><div className="kpi-label">Devoluções Concluídas</div></div>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <div className="panel-title"><i className="bi bi-journal-text"></i> Histórico e Cautelas <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 4 }}>{movsFiltrados.length} registros</span></div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {[{ val: '', label: 'Todos' }, { val: 'EM_USO', label: 'Em Uso' }, { val: 'DEVOLVIDO', label: 'Devolvidos' }].map(f => (
                                <button key={f.val} className={filtroStatus === f.val ? 'btn-primary-custom' : 'btn-ghost'} style={{ padding: '6px 12px', fontSize: 12, boxShadow: 'none' }} onClick={() => setFiltroStatus(f.val)}>{f.label}</button>
                            ))}
                        </div>
                        <div className="search-box"><i className="bi bi-search"></i><input className="search-input" placeholder="Colaborador ou material..." value={busca} onChange={e => setBusca(e.target.value)} /></div>
                        <button className="btn-primary-custom" onClick={() => setShowNovaRetirada(true)}><i className="bi bi-box-arrow-right"></i> Nova Retirada</button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead><tr><th>Colaborador</th><th>Material / Ferramenta</th><th>Retirada</th><th>Devolução</th><th>Consumo</th><th style={{ textAlign: 'center' }}>Status</th><th style={{ textAlign: 'right' }}>Ações</th></tr></thead>
                        <tbody>
                            {movsFiltrados.map(mov => (
                                <tr key={mov.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                                                {mov.colaborador_nome ? mov.colaborador_nome.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div className="cell-main">{mov.colaborador_nome || 'Desconhecido / Excluído'}</div>
                                        </div>
                                    </td>
                                    <td><div className="cell-main">{mov.material_nome_atual || mov.epi_nome}</div><div className="cell-sub">Qtd: {mov.quantidade_retirada} {mov.medida_inicial && ` · Saiu com: ${mov.medida_inicial}kg`}</div></td>
                                    <td><div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{formatarData(mov.data_retirada) ?? '—'}</div></td>
                                    <td><div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{formatarData(mov.data_devolucao) ?? <span style={{ opacity: 0.3 }}>—</span>}</div></td>
                                    <td>{mov.consumo ? <span className="badge-pill badge-gas"><i className="bi bi-graph-down"></i> {mov.consumo}kg</span> : <span style={{ color: 'var(--text-muted)', opacity: 0.3 }}>—</span>}</td>
                                    <td style={{ textAlign: 'center' }}><span className={`badge-pill ${mov.status === 'EM_USO' ? 'badge-epi' : 'badge-cobre'}`}><i className={`bi ${mov.status === 'EM_USO' ? 'bi-hourglass-split' : 'bi-check-circle-fill'}`} style={{ fontSize: 10 }}></i> {mov.status === 'EM_USO' ? 'Em Uso' : 'Devolvido'}</span></td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            {mov.status === 'EM_USO' && <button className="btn-ghost text-success border border-success border-opacity-25" onClick={() => abrirDevolucao(mov)} title="Registrar Devolução"><i className="bi bi-check2-circle"></i></button>}
                                            <button className="btn-ghost" style={{ color: '#ef4444', borderColor: 'transparent' }} onClick={() => excluirMovimentacao(mov.id)} title="Excluir Registro"><i className="bi bi-trash3-fill"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {movsFiltrados.length === 0 && <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-icon"><i className="bi bi-inbox"></i></div><div className="empty-state-title">Nenhuma movimentação encontrada</div><div className="empty-state-text">Ajuste os filtros ou registre uma nova retirada</div></div></td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ─── OFFCANVAS: NOVA RETIRADA ─── */}
            <Offcanvas show={showNovaRetirada} onHide={() => setShowNovaRetirada(false)} placement="end">
                <Offcanvas.Header closeButton><Offcanvas.Title><i className="bi bi-box-arrow-right text-primary me-2"></i>Registrar Retirada</Offcanvas.Title></Offcanvas.Header>
                <Offcanvas.Body>
                    <form onSubmit={registrarRetirada}>
                        <div className="form-group mb-3"><label className="form-label-custom">Colaborador <span style={{ color: '#f87171' }}>*</span></label><select className="form-select-custom fw-bold" required value={formRetirada.colaborador_id} onChange={e => setFormRetirada({ ...formRetirada, colaborador_id: e.target.value })}><option value="">Selecione quem vai retirar...</option>{colaboradores.map(c => <option key={c.id} value={c.id}>{c.nome} — {c.setor}</option>)}</select></div>
                        <div className="form-group mb-3"><label className="form-label-custom">Material / Ferramenta <span style={{ color: '#f87171' }}>*</span></label><select className="form-select-custom fw-bold" required value={formRetirada.epi_id} onChange={handleMaterialChange}><option value="">Selecione o item disponível...</option>{materiais.map(m => <option key={m.id} value={m.id}>{m.nome} (Disp: {m.categoria === 'Gás' || m.categoria === 'Cobre' ? `${m.peso}kg` : m.quantidade})</option>)}</select></div>
                        <div className="form-group mb-3"><label className="form-label-custom">Quantidade <span style={{ color: '#f87171' }}>*</span></label><input className="form-control-custom fw-bold text-primary" type="number" min="1" required value={formRetirada.quantidade_retirada} onChange={e => setFormRetirada({ ...formRetirada, quantidade_retirada: e.target.value })} /></div>
                        
                        {formRetirada.medida_inicial && (
                            <div className="form-highlight form-highlight-warning mb-3 border-warning bg-warning bg-opacity-10">
                                <i className="bi bi-info-circle-fill me-2"></i> Este material possui medição física. Ele será retirado do estoque com <strong>{formRetirada.medida_inicial}kg</strong>.
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
                            <button type="submit" className="btn-primary-custom" style={{ justifyContent: 'center', padding: '11px', fontSize: 14, width: '100%', borderRadius: 10 }}><i className="bi bi-check2-circle"></i> Confirmar Retirada</button>
                            <button type="button" className="btn-ghost" style={{ justifyContent: 'center', padding: '11px', fontSize: 14, width: '100%', borderRadius: 10 }} onClick={() => setShowNovaRetirada(false)}>Cancelar</button>
                        </div>
                    </form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* ─── MODAL: DEVOLUÇÃO ─── */}
            <Modal show={showDevolucao} onHide={() => setShowDevolucao(false)} centered>
                <Modal.Header closeButton><Modal.Title><i className="bi bi-check2-circle" style={{ color: '#34d399', marginRight: 8 }}></i>Registrar Devolução</Modal.Title></Modal.Header>
                <Modal.Body>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', marginBottom: 18 }}>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Item sendo devolvido</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{itemDevolucao?.material_nome_atual || itemDevolucao?.epi_nome}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>Colaborador: <strong>{itemDevolucao?.colaborador_nome}</strong></div>
                    </div>
                    {requerMedida && (
                        <div className="form-highlight form-highlight-danger">
                            <label className="form-label-custom text-danger">Medida na devolução (kg) <span style={{ color: '#f87171' }}>*</span></label>
                            <input className="form-control-custom fw-bold" type="number" step="0.01" placeholder={`Saiu com ${itemDevolucao?.medida_inicial}kg. Voltou com...`} value={medidaFinal} onChange={e => setMedidaFinal(e.target.value)} required style={{ borderColor: 'rgba(239,68,68,0.35)' }} />
                            <div className="form-note text-danger" style={{ marginTop: 8 }}><i className="bi bi-calculator" style={{ marginRight: 4 }}></i>O sistema atualizará o estoque com o peso que sobrou na garrafa.</div>
                        </div>
                    )}
                    {!requerMedida && <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0 }}>Confirma a devolução deste item? O estoque será reposto automaticamente.</p>}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn-ghost" onClick={() => setShowDevolucao(false)}>Cancelar</button>
                    <button className="btn btn-success fw-bold text-white shadow-sm" style={{ padding: '9px 20px', fontSize: 13.5 }} onClick={registrarDevolucao} disabled={requerMedida && !medidaFinal}><i className="bi bi-check2-circle me-2"></i>Confirmar Devolução</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}