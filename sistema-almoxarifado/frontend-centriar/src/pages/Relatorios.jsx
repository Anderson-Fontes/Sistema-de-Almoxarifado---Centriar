import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Paleta de cores por categoria — consistente com o Estoque.jsx
const categoriaCores = {
    'EPI':        '#fbbf24',
    'Consumível': '#60a5fa',
    'Ferramenta': '#a78bfa',
    'Gás':        '#f87171',
    'Cobre':      '#34d399',
    'Outros':     '#94a3b8',
};

export default function Relatorios() {
    const [materiais, setMateriais] = useState([]);
    const [colaboradores, setColaboradores] = useState([]);
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [colaboradorSelecionado, setColaboradorSelecionado] = useState('');

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [resMateriais, resColaboradores] = await Promise.all([
                    api.get('/epis').catch(() => ({ data: [] })),
                    api.get('/colaboradores').catch(() => ({ data: [] }))
                ]);

                let dadosMovimentacoes = [];
                try {
                    const resMov = await api.get('/movimentacoes');
                    dadosMovimentacoes = resMov.data;
                } catch {
                    dadosMovimentacoes = [
                        { id: 1, colaborador_id: 1, epi_nome: 'Luva de Raspa', tipo: 'Saída', quantidade: 2, data_hora: new Date().toISOString(), status: 'Em Posse' },
                        { id: 2, colaborador_id: 1, epi_nome: 'Capacete de Obra', tipo: 'Devolução', quantidade: 1, data_hora: new Date(Date.now() - 86400000).toISOString(), status: 'Devolvido' },
                        { id: 3, colaborador_id: 2, epi_nome: 'Gás R410A', tipo: 'Consumo', quantidade: 1, data_hora: new Date().toISOString(), status: 'Consumido' }
                    ];
                }

                setMateriais(resMateriais.data);
                setMovimentacoes(dadosMovimentacoes);

                const cols = resColaboradores.data.length > 0
                    ? resColaboradores.data
                    : [{ id: 1, nome: 'João Silva', setor: 'Manutenção' }, { id: 2, nome: 'Maria Santos', setor: 'Obras' }];
                setColaboradores(cols);
                setColaboradorSelecionado(cols[0].id.toString());

                setLoading(false);
            } catch {
                setLoading(false);
            }
        };
        carregarDados();
    }, []);

    // ─── ESTATÍSTICAS ───
    const totalItens      = materiais.length;
    const unidadesTotais  = materiais.reduce((acc, m) => acc + Number(m.quantidade || 0), 0);
    const itensEmAlerta   = materiais.filter(m => Number(m.quantidade || 0) <= Number(m.estoque_minimo || 0));

    const mesAtual = new Date().getMonth();
    const consumoMes = movimentacoes
        .filter(m => new Date(m.data_hora).getMonth() === mesAtual && (m.tipo === 'Saída' || m.tipo === 'Consumo'))
        .reduce((acc, m) => acc + Number(m.quantidade || 0), 0);

    // Distribuição por categoria
    const categoriasCount = materiais.reduce((acc, m) => {
        acc[m.categoria] = (acc[m.categoria] || 0) + 1;
        return acc;
    }, {});
    const categoriasOrdenadas = Object.entries(categoriasCount)
        .sort((a, b) => b[1] - a[1])
        .map(([nome, count]) => ({
            nome, count,
            percentual: totalItens > 0 ? Math.round((count / totalItens) * 100) : 0,
            cor: categoriaCores[nome] || '#94a3b8',
        }));

    // Histórico do colaborador selecionado
    const historicoColaborador = movimentacoes.filter(
        m => m.colaborador_id.toString() === colaboradorSelecionado
    );
    const itensEmPosse = historicoColaborador.filter(m => m.status === 'Em Posse').length;

    const colaboradorAtual = colaboradores.find(c => c.id.toString() === colaboradorSelecionado);

    const formatarData = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    const tipoBadge = {
        'Saída':     { cls: 'badge-em-uso',    icon: 'bi-box-arrow-right' },
        'Devolução': { cls: 'badge-devolvido', icon: 'bi-box-arrow-in-left' },
        'Consumo':   { cls: 'badge-gas',       icon: 'bi-fire' },
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', gap: 10, color: 'var(--text-muted)' }}>
                <span style={{ fontSize: 13 }}>A processar dados analíticos...</span>
            </div>
        );
    }

    return (
        <div>
            {/* ─── KPI CARDS ─── */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>
                        <i className="bi bi-boxes"></i>
                    </div>
                    <div className="kpi-value">{unidadesTotais}</div>
                    <div className="kpi-label">Unidades em Estoque</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}>
                        <i className="bi bi-calendar2-check-fill"></i>
                    </div>
                    <div className="kpi-value">{consumoMes}</div>
                    <div className="kpi-label">Itens Consumidos este Mês</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                        <i className="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <div className="kpi-value">{itensEmAlerta.length}</div>
                    <div className="kpi-label">Itens Abaixo do Mínimo</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}>
                        <i className="bi bi-diagram-3-fill"></i>
                    </div>
                    <div className="kpi-value">{totalItens}</div>
                    <div className="kpi-label">Tipos de Material</div>
                </div>
            </div>

            {/* ─── LINHA 1: Distribuição + Prioridade de Compra ─── */}
            <div className="relatorio-grid" style={{ marginBottom: 14 }}>

                {/* Distribuição por Categoria */}
                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-title">
                            <i className="bi bi-bar-chart-fill"></i>
                            Distribuição por Categoria
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {totalItens} tipos
                        </span>
                    </div>
                    <div style={{ padding: '18px 20px' }}>
                        {categoriasOrdenadas.length > 0 ? categoriasOrdenadas.map((cat, i) => (
                            <div key={i} className="cat-progress-wrap">
                                <div className="cat-progress-label">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                        <div style={{
                                            width: 8, height: 8, borderRadius: '50%',
                                            background: cat.cor, flexShrink: 0,
                                            boxShadow: `0 0 6px ${cat.cor}66`
                                        }} />
                                        <span className="cat-progress-name">{cat.nome}</span>
                                    </div>
                                    <span className="cat-progress-count">{cat.count} · {cat.percentual}%</span>
                                </div>
                                <div className="cat-progress-track">
                                    <div className="cat-progress-fill" style={{ width: `${cat.percentual}%`, background: cat.cor }} />
                                </div>
                            </div>
                        )) : (
                            <div className="empty-state" style={{ padding: '30px 0' }}>
                                <div className="empty-state-title">Nenhum dado registado</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Prioridade de Compra */}
                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-title" style={{ color: '#fca5a5' }}>
                            <i className="bi bi-exclamation-triangle-fill" style={{ color: '#f87171' }}></i>
                            Prioridade de Compra
                        </div>
                        <span style={{
                            fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 700,
                            background: 'rgba(239,68,68,0.1)', color: '#f87171',
                            border: '1px solid rgba(239,68,68,0.2)'
                        }}>
                            {itensEmAlerta.length} itens
                        </span>
                    </div>
                    <div style={{ overflowX: 'auto', maxHeight: 320, overflowY: 'auto' }}>
                        {itensEmAlerta.length > 0 ? (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Material</th>
                                        <th style={{ textAlign: 'center' }}>Atual</th>
                                        <th style={{ textAlign: 'center' }}>Mínimo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itensEmAlerta.slice(0, 10).map(item => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="cell-main" style={{ fontSize: 13 }}>{item.nome}</div>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className="badge-pill badge-alerta">
                                                    {item.quantidade}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className="cell-mono" style={{ fontSize: 12 }}>
                                                    {item.estoque_minimo || 0}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                                    <i className="bi bi-check-circle-fill"></i>
                                </div>
                                <div className="empty-state-title" style={{ color: '#34d399' }}>Estoque abastecido!</div>
                                <div className="empty-state-text">Nenhum item abaixo do mínimo</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── LINHA 2: Ficha de Colaborador ─── */}
            <div className="panel">
                <div className="panel-header">
                    <div className="panel-title">
                        <i className="bi bi-person-lines-fill"></i>
                        Ficha por Colaborador
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {colaboradorAtual && itensEmPosse > 0 && (
                            <span className="badge-pill badge-em-uso" style={{ fontSize: 11 }}>
                                <i className="bi bi-exclamation-circle-fill" style={{ fontSize: 9 }}></i>
                                {itensEmPosse} em posse
                            </span>
                        )}
                        <select
                            className="form-select-custom"
                            style={{ width: 'auto', fontSize: 13, padding: '7px 36px 7px 12px' }}
                            value={colaboradorSelecionado}
                            onChange={e => setColaboradorSelecionado(e.target.value)}
                        >
                            {colaboradores.map(c => (
                                <option key={c.id} value={c.id}>{c.nome} — {c.setor}</option>
                            ))}
                        </select>
                        <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => window.print()}>
                            <i className="bi bi-printer"></i>
                            Imprimir
                        </button>
                    </div>
                </div>

                {/* Chips de resumo */}
                {colaboradorAtual && (
                    <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <div className="colaborador-ficha-chip" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)' }}>
                            <i className="bi bi-box-seam-fill" style={{ color: '#fbbf24', fontSize: 13 }}></i>
                            <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Em Posse</span>
                            <span style={{ color: '#fbbf24', fontSize: 16, fontWeight: 800, letterSpacing: '-0.5px', marginLeft: 4 }}>{itensEmPosse}</span>
                        </div>
                        <div className="colaborador-ficha-chip">
                            <i className="bi bi-clock-history" style={{ color: 'var(--primary-light)', fontSize: 13 }}></i>
                            <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Total de Registos</span>
                            <span style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 800, letterSpacing: '-0.5px', marginLeft: 4 }}>{historicoColaborador.length}</span>
                        </div>
                        <div className="colaborador-ficha-chip">
                            <i className="bi bi-building" style={{ color: 'var(--text-secondary)', fontSize: 13 }}></i>
                            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{colaboradorAtual.setor}</span>
                        </div>
                    </div>
                )}

                {/* Tabela de histórico */}
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Data e Hora</th>
                                <th>Material / EPI</th>
                                <th style={{ textAlign: 'center' }}>Operação</th>
                                <th style={{ textAlign: 'center' }}>Qtd</th>
                                <th style={{ textAlign: 'center' }}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historicoColaborador.map((mov, i) => {
                                const badge = tipoBadge[mov.tipo] || { cls: 'badge-outros', icon: 'bi-question' };
                                const statusColor = mov.status === 'Em Posse' ? '#fbbf24' : mov.status === 'Devolvido' ? '#34d399' : 'var(--text-muted)';
                                return (
                                    <tr key={i}>
                                        <td>
                                            <span className="cell-mono" style={{ fontSize: 12 }}>{formatarData(mov.data_hora)}</span>
                                        </td>
                                        <td>
                                            <div className="cell-main" style={{ fontSize: 13 }}>{mov.epi_nome}</div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className={`badge-pill ${badge.cls}`}>
                                                <i className={`bi ${badge.icon}`} style={{ fontSize: 9 }}></i>
                                                {mov.tipo}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className="cell-mono">{mov.quantidade}</span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: statusColor }}>
                                                {mov.status === 'Em Posse' && <i className="bi bi-exclamation-circle-fill" style={{ marginRight: 4, fontSize: 10 }}></i>}
                                                {mov.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {historicoColaborador.length === 0 && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="empty-state">
                                            <div className="empty-state-icon"><i className="bi bi-person-x"></i></div>
                                            <div className="empty-state-title">Nenhum registo</div>
                                            <div className="empty-state-text">Este colaborador não possui movimentações registadas</div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}