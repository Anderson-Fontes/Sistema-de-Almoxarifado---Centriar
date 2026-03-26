import React, { useState, useEffect } from 'react';
import api from '../services/api';

const categoriaColors = {
    'EPI':        { fill: '#fbbf24', bg: 'rgba(245,158,11,0.12)'  },
    'Consumível': { fill: '#60a5fa', bg: 'rgba(59,130,246,0.12)'  },
    'Ferramenta': { fill: '#a78bfa', bg: 'rgba(139,92,246,0.12)'  },
    'Gás':        { fill: '#f87171', bg: 'rgba(239,68,68,0.12)'   },
    'Cobre':      { fill: '#34d399', bg: 'rgba(16,185,129,0.12)'  },
    'Outros':     { fill: '#94a3b8', bg: 'rgba(148,163,184,0.08)' },
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
                const [resMat, resColab, resMov] = await Promise.all([
                    api.get('/epis'),
                    api.get('/colaboradores'),
                    api.get('/movimentacoes')
                ]);
                setMateriais(resMat.data);
                setColaboradores(resColab.data);
                setMovimentacoes(resMov.data);
                if (resColab.data.length > 0) {
                    setColaboradorSelecionado(resColab.data[0].id.toString());
                }
                setLoading(false);
            } catch (error) {
                console.error('Erro ao gerar relatórios:', error);
                setLoading(false);
            }
        };
        carregarDados();
    }, []);

    // ─── CÁLCULOS ───
    const totalItensDiferentes = materiais.length;
    const unidadesTotais = materiais.reduce((acc, mat) => acc + Number(mat.quantidade), 0);

    const itensEmAlerta = materiais.filter(m => {
        if (m.categoria === 'Gás' || m.categoria === 'Cobre')
            return parseFloat(m.peso_minimo || 0) > 0 && parseFloat(m.peso || 0) <= parseFloat(m.peso_minimo || 0);
        return parseInt(m.quantidade || 0) <= parseInt(m.estoque_minimo || 0);
    });

    const mesAtual = new Date().getMonth();
    const consumoMes = movimentacoes
        .filter(m => new Date(m.data_retirada).getMonth() === mesAtual)
        .reduce((acc, mov) => acc + Number(mov.quantidade_retirada), 0);

    const historicoColaborador = movimentacoes.filter(
        m => m.colaborador_id?.toString() === colaboradorSelecionado
    );
    const itensEmPosse = historicoColaborador.filter(m => m.status === 'EM_USO').length;

    const categoriasCount = materiais.reduce((acc, mat) => {
        acc[mat.categoria] = (acc[mat.categoria] || 0) + 1;
        return acc;
    }, {});

    const categoriasOrdenadas = Object.entries(categoriasCount)
        .sort((a, b) => b[1] - a[1])
        .map(([nome, count]) => ({
            nome,
            count,
            percentual: totalItensDiferentes > 0 ? Math.round((count / totalItensDiferentes) * 100) : 0
        }));

    const formatarData = (d) =>
        d ? new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12, color: 'var(--text-muted)', fontSize: 14 }}>
                <i className="bi bi-arrow-repeat" style={{ fontSize: 20, animation: 'spin 1s linear infinite' }}></i>
                A processar dados analíticos...
            </div>
        );
    }

    return (
        <div>
            {/* ─── KPI CARDS ─── */}
            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>
                        <i className="bi bi-boxes"></i>
                    </div>
                    <div className="kpi-value">{unidadesTotais}</div>
                    <div className="kpi-label">Volume em Estoque</div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}>
                        <i className="bi bi-calendar2-check-fill"></i>
                    </div>
                    <div className="kpi-value">{consumoMes}</div>
                    <div className="kpi-label">Movimentado no Mês</div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                        <i className="bi bi-cart-x-fill"></i>
                    </div>
                    <div className="kpi-value" style={{ color: itensEmAlerta.length > 0 ? '#f87171' : 'var(--text-primary)' }}>
                        {itensEmAlerta.length}
                    </div>
                    <div className="kpi-label">Comprar Urgente</div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}>
                        <i className="bi bi-grid-3x3-gap-fill"></i>
                    </div>
                    <div className="kpi-value">{totalItensDiferentes}</div>
                    <div className="kpi-label">SKUs Cadastrados</div>
                </div>
            </div>

            {/* ─── LINHA 2: CATEGORIAS + ALERTA DE COMPRA ─── */}
            <div className="relatorio-grid" style={{ marginBottom: 14 }}>

                {/* Distribuição por Categoria */}
                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-title">
                            <i className="bi bi-bar-chart-fill"></i>
                            Distribuição por Categoria
                        </div>
                    </div>
                    <div style={{ padding: '18px 20px' }}>
                        {categoriasOrdenadas.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon"><i className="bi bi-bar-chart"></i></div>
                                <div className="empty-state-title">Sem dados registrados</div>
                            </div>
                        ) : categoriasOrdenadas.map((cat, i) => {
                            const cor = categoriaColors[cat.nome] || categoriaColors['Outros'];
                            return (
                                <div key={i} className="cat-progress-wrap">
                                    <div className="cat-progress-label">
                                        <span className="cat-progress-name">{cat.nome}</span>
                                        <span className="cat-progress-count">{cat.count} itens · {cat.percentual}%</span>
                                    </div>
                                    <div className="cat-progress-track">
                                        <div
                                            className="cat-progress-fill"
                                            style={{ width: `${cat.percentual}%`, background: cor.fill }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Prioridade de Compra */}
                <div className="panel" style={{ borderColor: 'rgba(239,68,68,0.18)' }}>
                    <div className="panel-header" style={{ background: 'rgba(239,68,68,0.05)', borderBottomColor: 'rgba(239,68,68,0.1)' }}>
                        <div className="panel-title" style={{ color: '#fca5a5' }}>
                            <i className="bi bi-exclamation-triangle-fill" style={{ color: '#f87171' }}></i>
                            Prioridade de Compra
                        </div>
                        {itensEmAlerta.length > 0 && (
                            <span className="badge-pill badge-gas">{itensEmAlerta.length} SKUs</span>
                        )}
                    </div>
                    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                        {itensEmAlerta.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}>
                                    <i className="bi bi-check-circle-fill"></i>
                                </div>
                                <div className="empty-state-title" style={{ color: '#34d399' }}>Estoque abastecido!</div>
                                <div className="empty-state-text">Todos os itens estão acima do mínimo</div>
                            </div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Material</th>
                                        <th style={{ textAlign: 'center' }}>Estoque</th>
                                        <th style={{ textAlign: 'center' }}>Mínimo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itensEmAlerta.slice(0, 10).map(item => (
                                        <tr key={item.id}>
                                            <td><div className="cell-main">{item.nome}</div></td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className="badge-pill badge-gas">
                                                    <i className="bi bi-exclamation-circle-fill" style={{ fontSize: 9 }}></i>
                                                    {item.categoria === 'Gás' || item.categoria === 'Cobre'
                                                        ? `${item.peso || 0}kg`
                                                        : `${item.quantidade} un`}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className="cell-mono">
                                                    {item.estoque_minimo || item.peso_minimo || 0}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── FICHA DO COLABORADOR ─── */}
            <div className="panel">
                <div className="panel-header">
                    <div className="panel-title">
                        <i className="bi bi-person-lines-fill"></i>
                        Histórico por Colaborador
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <select
                            className="form-select-custom"
                            style={{ width: 'auto', minWidth: 240, fontSize: 12.5, padding: '7px 36px 7px 12px' }}
                            value={colaboradorSelecionado}
                            onChange={e => setColaboradorSelecionado(e.target.value)}
                        >
                            {colaboradores.map(c => (
                                <option key={c.id} value={c.id}>{c.nome} — {c.setor}</option>
                            ))}
                        </select>
                        <button className="btn-ghost" onClick={() => window.print()}>
                            <i className="bi bi-printer-fill"></i>
                            Imprimir
                        </button>
                    </div>
                </div>

                {/* Mini KPIs do colaborador */}
                <div style={{ display: 'flex', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'var(--surface-1)' }}>
                    <div className="colaborador-ficha-chip" style={{ borderColor: 'rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.05)' }}>
                        <i className="bi bi-person-walking" style={{ color: '#fbbf24', fontSize: 14 }}></i>
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Em Posse</div>
                            <div style={{ fontSize: 17, fontWeight: 800, color: '#fbbf24', lineHeight: 1.2 }}>{itensEmPosse}</div>
                        </div>
                    </div>
                    <div className="colaborador-ficha-chip">
                        <i className="bi bi-journal-text" style={{ color: 'var(--primary-light)', fontSize: 14 }}></i>
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Total de Registros</div>
                            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{historicoColaborador.length}</div>
                        </div>
                    </div>
                </div>

                {/* Tabela */}
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Data Retirada</th>
                                <th>Material / Ferramenta</th>
                                <th style={{ textAlign: 'center' }}>Qtd / Peso</th>
                                <th style={{ textAlign: 'center' }}>Data Devolução</th>
                                <th style={{ textAlign: 'center' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historicoColaborador.map((mov, i) => (
                                <tr key={i}>
                                    <td>
                                        <span className="cell-mono">{formatarData(mov.data_retirada)}</span>
                                    </td>
                                    <td>
                                        <div className="cell-main">{mov.material_nome_atual || mov.epi_nome || 'Material Excluído'}</div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className="cell-mono">
                                            {mov.quantidade_retirada}{mov.medida_inicial ? ` (${mov.medida_inicial}kg)` : ''}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                                            {mov.data_devolucao ? formatarData(mov.data_devolucao) : <span style={{ opacity: 0.3 }}>—</span>}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`badge-pill ${mov.status === 'EM_USO' ? 'badge-epi' : 'badge-cobre'}`}>
                                            <i className={`bi ${mov.status === 'EM_USO' ? 'bi-hourglass-split' : 'bi-check-circle-fill'}`} style={{ fontSize: 9 }}></i>
                                            {mov.status === 'EM_USO' ? 'Em Uso' : 'Devolvido'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {historicoColaborador.length === 0 && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="empty-state">
                                            <div className="empty-state-icon"><i className="bi bi-person-slash"></i></div>
                                            <div className="empty-state-title">Sem registros para este colaborador</div>
                                            <div className="empty-state-text">Nenhuma movimentação foi encontrada</div>
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