import React, { useState, useEffect } from 'react';
import api from '../services/api';

const categoriaColors = {
    'EPI':            { fill: '#fbbf24', bg: 'rgba(245,158,11,0.12)'  },
    'Consumível':     { fill: '#60a5fa', bg: 'rgba(59,130,246,0.12)'  },
    'Ferramenta':     { fill: '#a78bfa', bg: 'rgba(139,92,246,0.12)'  },
    'Gás':            { fill: '#f87171', bg: 'rgba(239,68,68,0.12)'   },
    'Cobre':          { fill: '#34d399', bg: 'rgba(16,185,129,0.12)'  },
    'Cabo/Mangueira': { fill: '#db2777', bg: 'rgba(219,39,119,0.12)'  },
    'Outros':         { fill: '#94a3b8', bg: 'rgba(148,163,184,0.08)' },
};

export default function Relatorios() {
    const [materiais, setMateriais] = useState([]);
    const [colaboradores, setColaboradores] = useState([]);
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [colaboradorSelecionado, setColaboradorSelecionado] = useState(''); 
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

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
                setLoading(false);
            } catch (error) {
                console.error('Erro ao gerar relatórios:', error);
                setLoading(false);
            }
        };
        carregarDados();
    }, []);

    const totalItensDiferentes = materiais.length;
    const unidadesTotais = materiais.reduce((acc, mat) => acc + Number(mat.quantidade), 0);

    const itensEmAlerta = materiais.filter(m => {
        if (m.categoria === 'Gás' || m.categoria === 'Cobre')
            return parseFloat(m.peso_minimo || 0) > 0 && parseFloat(m.peso || 0) <= parseFloat(m.peso_minimo || 0);
        return parseFloat(m.quantidade || 0) <= parseFloat(m.estoque_minimo || 0) && parseFloat(m.estoque_minimo || 0) > 0;
    });

    const mesAtual = new Date().getMonth();
    const consumoMes = movimentacoes
        .filter(m => new Date(m.data_retirada).getMonth() === mesAtual)
        .reduce((acc, mov) => acc + Number(mov.quantidade_retirada), 0);

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

    const historicoFiltrado = movimentacoes.filter(m => {
        const passaColaborador = colaboradorSelecionado === '' || m.colaborador_id?.toString() === colaboradorSelecionado;
        
        let passaDataInicio = true;
        let passaDataFim = true;
        
        if (dataInicio) {
            const dataMov = new Date(m.data_retirada);
            const inicio = new Date(dataInicio + 'T00:00:00');
            passaDataInicio = dataMov >= inicio;
        }
        
        if (dataFim) {
            const dataMov = new Date(m.data_retirada);
            const fim = new Date(dataFim + 'T23:59:59');
            passaDataFim = dataMov <= fim;
        }

        return passaColaborador && passaDataInicio && passaDataFim;
    });

    const itensEmPosse = historicoFiltrado.filter(m => m.status === 'EM_USO').length;

    const nomeColabFiltro = colaboradorSelecionado ? colaboradores.find(c => c.id.toString() === colaboradorSelecionado)?.nome : '';
    const tituloRelatorio = nomeColabFiltro ? `RELATÓRIO DO COLABORADOR: ${nomeColabFiltro}` : `RELATÓRIO GERAL: TODOS OS COLABORADORES`;
    
    let textoPeriodo = 'TODO O HISTÓRICO';
    if (dataInicio && dataFim) {
        textoPeriodo = `${new Date(dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')} A ${new Date(dataFim + 'T23:59:59').toLocaleDateString('pt-BR')}`;
    } else if (dataInicio) {
        textoPeriodo = `A PARTIR DE ${new Date(dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')}`;
    } else if (dataFim) {
        textoPeriodo = `ATÉ ${new Date(dataFim + 'T23:59:59').toLocaleDateString('pt-BR')}`;
    }

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
            {/* ─── CABEÇALHO EXCLUSIVO PARA IMPRESSÃO (PDF) ─── */}
            <div className="print-only mb-4" style={{ display: 'none', textAlign: 'center' }}>
                <h2 style={{ color: '#0f172a', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 8px 0', fontSize: '24px' }}>
                    {tituloRelatorio}
                </h2>
                <h5 style={{ color: '#475569', fontWeight: 700, margin: '0 0 24px 0', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', fontSize: '16px' }}>
                    PERÍODO: {textoPeriodo}
                </h5>
                <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                    Documento gerado pelo sistema Centriar ERP em: {new Date().toLocaleString('pt-BR')}
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4 print-hide">
                <h4 className="fw-bold mb-0 text-dark"><i className="bi bi-bar-chart-fill text-primary me-2"></i> Dashboard Analítico</h4>
                <button className="btn-primary-custom" onClick={() => window.print()}>
                    <i className="bi bi-printer-fill"></i> Imprimir Relatório
                </button>
            </div>

            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}><i className="bi bi-boxes"></i></div>
                    <div className="kpi-value">{unidadesTotais}</div>
                    <div className="kpi-label">Volume em Estoque</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}><i className="bi bi-calendar2-check-fill"></i></div>
                    <div className="kpi-value">{consumoMes}</div>
                    <div className="kpi-label">Movimentado no Mês</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}><i className="bi bi-cart-x-fill"></i></div>
                    <div className="kpi-value" style={{ color: itensEmAlerta.length > 0 ? '#f87171' : 'var(--text-primary)' }}>{itensEmAlerta.length}</div>
                    <div className="kpi-label">Comprar Urgente</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}><i className="bi bi-grid-3x3-gap-fill"></i></div>
                    <div className="kpi-value">{totalItensDiferentes}</div>
                    <div className="kpi-label">SKUs Cadastrados</div>
                </div>
            </div>

            <div className="relatorio-grid print-hide" style={{ marginBottom: 24 }}>
                <div className="panel" style={{ marginTop: 0 }}>
                    <div className="panel-header"><div className="panel-title"><i className="bi bi-pie-chart-fill"></i> Distribuição por Categoria</div></div>
                    <div style={{ padding: '18px 20px' }}>
                        {categoriasOrdenadas.length === 0 ? (
                            <div className="empty-state"><div className="empty-state-icon"><i className="bi bi-bar-chart"></i></div><div className="empty-state-title">Sem dados registrados</div></div>
                        ) : categoriasOrdenadas.map((cat, i) => {
                            const cor = categoriaColors[cat.nome] || categoriaColors['Outros'];
                            return (
                                <div key={i} className="cat-progress-wrap">
                                    <div className="cat-progress-label"><span className="cat-progress-name">{cat.nome}</span><span className="cat-progress-count">{cat.count} itens · {cat.percentual}%</span></div>
                                    <div className="cat-progress-track"><div className="cat-progress-fill" style={{ width: `${cat.percentual}%`, background: cor.fill }} /></div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="panel" style={{ marginTop: 0, borderColor: 'rgba(239,68,68,0.18)' }}>
                    <div className="panel-header" style={{ background: 'rgba(239,68,68,0.05)', borderBottomColor: 'rgba(239,68,68,0.1)' }}>
                        <div className="panel-title" style={{ color: '#fca5a5' }}><i className="bi bi-exclamation-triangle-fill" style={{ color: '#f87171' }}></i> Prioridade de Compra</div>
                        {itensEmAlerta.length > 0 && <span className="badge-pill badge-gas">{itensEmAlerta.length} SKUs</span>}
                    </div>
                    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                        {itensEmAlerta.length === 0 ? (
                            <div className="empty-state"><div className="empty-state-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}><i className="bi bi-check-circle-fill"></i></div><div className="empty-state-title" style={{ color: '#34d399' }}>Estoque abastecido!</div><div className="empty-state-text">Todos os itens estão acima do mínimo</div></div>
                        ) : (
                            <table className="data-table">
                                <thead><tr><th>Material</th><th style={{ textAlign: 'center' }}>Estoque</th><th style={{ textAlign: 'center' }}>Mínimo</th></tr></thead>
                                <tbody>
                                    {itensEmAlerta.slice(0, 10).map(item => (
                                        <tr key={item.id}>
                                            <td><div className="cell-main">{item.nome}</div></td>
                                            <td style={{ textAlign: 'center' }}><span className="badge-pill badge-gas"><i className="bi bi-exclamation-circle-fill" style={{ fontSize: 9 }}></i>{item.categoria === 'Gás' || item.categoria === 'Cobre' ? `${item.peso || 0}kg` : `${item.quantidade}`}</span></td>
                                            <td style={{ textAlign: 'center' }}><span className="cell-mono">{item.estoque_minimo || item.peso_minimo || 0}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            <div className="panel">
                <div className="panel-header print-hide" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
                    <div className="panel-title w-100 border-bottom pb-3 mb-1"><i className="bi bi-card-list"></i> Auditoria de Retiradas e Destinos</div>
                    <div className="row w-100 g-3">
                        <div className="col-md-4">
                            <label className="form-label-custom" style={{ fontSize: 11 }}>Colaborador</label>
                            <select className="form-select-custom" value={colaboradorSelecionado} onChange={e => setColaboradorSelecionado(e.target.value)}>
                                <option value="">👨‍👩‍👧‍👦 Todos os Colaboradores</option>
                                {colaboradores.map(c => <option key={c.id} value={c.id}>{c.nome} — {c.setor}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label-custom" style={{ fontSize: 11 }}>Data Inicial</label>
                            <input type="date" className="form-control-custom" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label-custom" style={{ fontSize: 11 }}>Data Final</label>
                            <input type="date" className="form-control-custom" value={dataFim} onChange={e => setDataFim(e.target.value)} />
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button className="btn-ghost w-100" style={{ height: 38 }} onClick={() => { setColaboradorSelecionado(''); setDataInicio(''); setDataFim(''); }}>
                                <i className="bi bi-eraser-fill me-1"></i> Limpar
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'var(--surface-1)' }}>
                    <div className="colaborador-ficha-chip" style={{ borderColor: 'rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.05)' }}>
                        <i className="bi bi-tools" style={{ color: '#fbbf24', fontSize: 14 }}></i>
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Pendente / Em Posse</div>
                            <div style={{ fontSize: 17, fontWeight: 800, color: '#fbbf24', lineHeight: 1.2 }}>{itensEmPosse}</div>
                        </div>
                    </div>
                    <div className="colaborador-ficha-chip">
                        <i className="bi bi-journal-text" style={{ color: 'var(--primary-light)', fontSize: 14 }}></i>
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Total de Registros (Filtro)</div>
                            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{historicoFiltrado.length}</div>
                        </div>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Colaborador</th>
                                <th>Material / Destino</th>
                                <th>Data Retirada</th>
                                <th style={{ textAlign: 'center' }}>Qtd / Peso</th>
                                <th style={{ textAlign: 'center' }}>Data Devolução</th>
                                <th style={{ textAlign: 'center' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historicoFiltrado.map((mov, i) => {
                                const isContinuo = !mov.destino || mov.destino.toLowerCase() === 'uso contínuo' || mov.destino.toLowerCase() === 'uso continuo';
                                return (
                                    <tr key={i}>
                                        <td className="fw-bold text-dark">{mov.colaborador_nome || 'Excluído'}</td>
                                        <td>
                                            <div className="cell-main">{mov.material_nome_atual || mov.epi_nome || 'Material Excluído'}</div>
                                            <div style={{ marginTop: 4 }}>
                                                {isContinuo ? (
                                                    <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary px-2 py-1" style={{ fontSize: 10 }}>
                                                        <i className="bi bi-infinity me-1"></i> Uso Contínuo
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-2 py-1" style={{ fontSize: 10, whiteSpace: 'normal', maxWidth: '200px', textAlign: 'left' }}>
                                                        <i className="bi bi-geo-alt-fill me-1"></i> {mov.destino}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td><span className="cell-mono">{formatarData(mov.data_retirada)}</span></td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className="cell-mono fw-bold">{mov.quantidade_retirada}{mov.medida_inicial ? ` (${mov.medida_inicial}kg)` : ''}</span>
                                            {mov.consumo > 0 && <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, marginTop: 4 }}>Gasto: {mov.consumo}</div>}
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
                                );
                            })}
                            {historicoFiltrado.length === 0 && (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state">
                                            <div className="empty-state-icon"><i className="bi bi-funnel"></i></div>
                                            <div className="empty-state-title">Nenhum registro encontrado</div>
                                            <div className="empty-state-text">Tente limpar os filtros de data ou colaborador.</div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                @media print {
                    .print-hide, .sidebar, .topbar { display: none !important; }
                    .print-only { display: block !important; }
                    .main-content { padding: 0 !important; background: white; margin: 0 !important; }
                    .panel { border: none !important; box-shadow: none !important; margin: 0 !important; padding: 0 !important; }
                    body { background: white; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}</style>
        </div>
    );
}