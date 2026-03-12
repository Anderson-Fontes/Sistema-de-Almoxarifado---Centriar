import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Relatorios() {
    const [materiais, setMateriais] = useState([]);
    const [colaboradores, setColaboradores] = useState([]);
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [colaboradorSelecionado, setColaboradorSelecionado] = useState('');

    useEffect(() => {
        const carregarDados = async () => {
            try {
                // Tenta carregar tudo, incluindo as movimentações (que faremos na próxima etapa)
                const [resMateriais, resColaboradores] = await Promise.all([
                    api.get('/epis').catch(() => ({ data: [] })),
                    api.get('/colaboradores').catch(() => ({ data: [] }))
                ]);
                
                let dadosMovimentacoes = [];
                try {
                    const resMov = await api.get('/movimentacoes');
                    dadosMovimentacoes = resMov.data;
                } catch (e) {
                    // Como a API de movimentações ainda não existe, criamos dados visuais de teste
                    dadosMovimentacoes = [
                        { id: 1, colaborador_id: 1, epi_nome: 'Luva de Raspa', tipo: 'Saída', quantidade: 2, data_hora: new Date().toISOString(), status: 'Em Posse' },
                        { id: 2, colaborador_id: 1, epi_nome: 'Capacete de Obra', tipo: 'Devolução', quantidade: 1, data_hora: new Date(Date.now() - 86400000).toISOString(), status: 'Devolvido' },
                        { id: 3, colaborador_id: 2, epi_nome: 'Gás R410A', tipo: 'Consumo', quantidade: 1, data_hora: new Date().toISOString(), status: 'Consumido' }
                    ];
                }

                setMateriais(resMateriais.data);
                setColaboradores(resColaboradores.data);
                setMovimentacoes(dadosMovimentacoes);
                
                if (resColaboradores.data.length > 0) {
                    setColaboradorSelecionado(resColaboradores.data[0].id.toString());
                } else {
                    // Se não houver colaboradores na BD para o teste visual
                    setColaboradorSelecionado('1');
                    setColaboradores([{ id: 1, nome: 'João Silva', setor: 'Manutenção' }, { id: 2, nome: 'Maria Santos', setor: 'Obras' }]);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Erro ao gerar relatórios:', error);
                setLoading(false);
            }
        };
        carregarDados();
    }, []);

    // ─── CÁLCULOS E ESTATÍSTICAS ───
    const totalItensDiferentes = materiais.length;
    const unidadesTotais = materiais.reduce((acc, mat) => acc + Number(mat.quantidade), 0);
    const itensEmAlerta = materiais.filter(m => m.quantidade <= (m.estoque_minimo || 0));
    
    // Calcula o consumo do mês atual
    const mesAtual = new Date().getMonth();
    const consumoMes = movimentacoes.filter(m => {
        const dataMov = new Date(m.data_hora);
        return dataMov.getMonth() === mesAtual && (m.tipo === 'Saída' || m.tipo === 'Consumo');
    }).reduce((acc, mov) => acc + Number(mov.quantidade), 0);

    // Dados do Colaborador Selecionado
    const historicoColaborador = movimentacoes.filter(m => m.colaborador_id.toString() === colaboradorSelecionado);
    const itensEmPosse = historicoColaborador.filter(m => m.status === 'Em Posse').length;

    // Distribuição por Categorias
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

    const imprimirRelatorio = () => window.print();

    if (loading) {
        return <div className="p-5 text-center text-muted fw-bold">A processar dados analíticos...</div>;
    }

    return (
        <div className="p-4">
            {/* Cabeçalho */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold text-dark mb-0">Visão Estratégica</h4>
                    <span className="text-muted">Métricas, consumos e histórico detalhado</span>
                </div>
                <button className="btn btn-primary fw-bold shadow-sm rounded-3 px-4" onClick={imprimirRelatorio}>
                    <i className="bi bi-printer-fill me-2"></i> Exportar Relatório
                </button>
            </div>

            {/* ─── KPI CARDS ─── */}
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="card bg-white border-0 shadow-sm rounded-4 h-100 p-3" style={{ borderLeft: '5px solid #6366f1' }}>
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}>
                                <i className="bi bi-boxes"></i>
                            </div>
                            <div>
                                <div className="text-muted small fw-bold text-uppercase">Volume em Estoque</div>
                                <div className="fs-3 fw-bolder text-dark">{unidadesTotais} <span className="fs-6 text-muted fw-normal">un.</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-xl-3 col-md-6">
                    <div className="card bg-white border-0 shadow-sm rounded-4 h-100 p-3" style={{ borderLeft: '5px solid #10b981' }}>
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}>
                                <i className="bi bi-calendar2-check-fill"></i>
                            </div>
                            <div>
                                <div className="text-muted small fw-bold text-uppercase">Gasto este Mês</div>
                                <div className="fs-3 fw-bolder text-dark">{consumoMes} <span className="fs-6 text-muted fw-normal">itens</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card bg-white border-0 shadow-sm rounded-4 h-100 p-3" style={{ borderLeft: `5px solid ${itensEmAlerta.length > 0 ? '#ef4444' : '#10b981'}` }}>
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}>
                                <i className="bi bi-cart-x-fill"></i>
                            </div>
                            <div>
                                <div className="text-muted small fw-bold text-uppercase">Comprar Urgente</div>
                                <div className="fs-3 fw-bolder text-danger">{itensEmAlerta.length} <span className="fs-6 text-muted fw-normal">SKUs</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card bg-white border-0 shadow-sm rounded-4 h-100 p-3" style={{ borderLeft: '5px solid #f59e0b' }}>
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}>
                                <i className="bi bi-people-fill"></i>
                            </div>
                            <div>
                                <div className="text-muted small fw-bold text-uppercase">Equipa Ativa</div>
                                <div className="fs-3 fw-bolder text-dark">{colaboradores.length} <span className="fs-6 text-muted fw-normal">func.</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                {/* ─── GRÁFICO DE BARRAS ─── */}
                <div className="col-lg-7">
                    <div className="card bg-white border-0 shadow-sm rounded-4 h-100 p-4">
                        <h6 className="fw-bold text-dark mb-4"><i className="bi bi-bar-chart-fill text-primary me-2"></i>Distribuição por Categoria</h6>
                        <div>
                            {categoriasOrdenadas.map((cat, index) => (
                                <div key={index} className="mb-4">
                                    <div className="d-flex justify-content-between align-items-end mb-1">
                                        <span className="fw-bold text-dark">{cat.nome}</span>
                                        <span className="text-muted small fw-semibold">{cat.count} itens ({cat.percentual}%)</span>
                                    </div>
                                    <div className="progress bg-light" style={{ height: '12px', borderRadius: '10px' }}>
                                        <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" style={{ width: `${cat.percentual}%`, borderRadius: '10px' }}></div>
                                    </div>
                                </div>
                            ))}
                            {categoriasOrdenadas.length === 0 && <div className="text-center text-muted py-4">Sem dados registados.</div>}
                        </div>
                    </div>
                </div>

                {/* ─── PAINEL DE AÇÃO ─── */}
                <div className="col-lg-5">
                    <div className="card bg-white border border-danger border-opacity-25 shadow-sm rounded-4 h-100">
                        <div className="bg-danger bg-opacity-10 px-4 py-3 rounded-top-4 border-bottom border-danger border-opacity-10">
                            <h6 className="fw-bold text-danger mb-0"><i className="bi bi-exclamation-triangle-fill me-2"></i>Prioridade de Compra</h6>
                        </div>
                        <div className="p-0 table-responsive" style={{ maxHeight: '300px' }}>
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-white sticky-top">
                                    <tr>
                                        <th className="text-muted small ps-4">Material</th>
                                        <th className="text-center text-muted small">Estoque</th>
                                        <th className="text-center text-muted small pe-4">Mínimo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itensEmAlerta.slice(0, 10).map(item => (
                                        <tr key={item.id}>
                                            <td className="fw-bold text-dark ps-4">{item.nome}</td>
                                            <td className="text-center"><span className="badge bg-danger text-white rounded-pill px-3 py-2">{item.quantidade}</span></td>
                                            <td className="text-center text-muted fw-bold pe-4">{item.estoque_minimo || 0}</td>
                                        </tr>
                                    ))}
                                    {itensEmAlerta.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center py-5 text-success fw-bold">
                                                <i className="bi bi-check-circle-fill fs-2 d-block mb-2"></i>
                                                Estoque perfeitamente abastecido!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── FICHA DE COLABORADOR (HISTÓRICO) ─── */}
            <div className="card bg-white border-0 shadow-sm rounded-4 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <h6 className="fw-bold text-dark mb-0"><i className="bi bi-person-lines-fill text-primary me-2"></i>Histórico por Colaborador</h6>
                    
                    <div className="d-flex align-items-center gap-3 bg-light p-2 rounded-3 border">
                        <label className="text-muted small fw-bold text-nowrap ms-2">Selecionar Colaborador:</label>
                        <select 
                            className="form-select border-0 bg-white shadow-sm fw-bold text-dark" 
                            style={{ minWidth: '250px' }}
                            value={colaboradorSelecionado}
                            onChange={(e) => setColaboradorSelecionado(e.target.value)}
                        >
                            {colaboradores.map(c => (
                                <option key={c.id} value={c.id}>{c.nome} - {c.setor}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="d-flex gap-4 mb-4">
                    <div className="bg-warning bg-opacity-10 text-warning-emphasis border border-warning-subtle px-4 py-3 rounded-3">
                        <div className="small fw-bold text-uppercase mb-1">Materiais em Posse (Pendentes)</div>
                        <div className="fs-4 fw-bold">{itensEmPosse} itens</div>
                    </div>
                    <div className="bg-light border text-muted px-4 py-3 rounded-3">
                        <div className="small fw-bold text-uppercase mb-1">Total de Registos na Ficha</div>
                        <div className="fs-4 fw-bold">{historicoColaborador.length} movimentos</div>
                    </div>
                </div>

                <div className="table-responsive border rounded-3">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="text-muted small ps-4">Data e Hora</th>
                                <th className="text-muted small">Material / EPI</th>
                                <th className="text-muted small text-center">Operação</th>
                                <th className="text-muted small text-center">Qtd</th>
                                <th className="text-muted small text-center pe-4">Estado Atual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historicoColaborador.map((mov, index) => (
                                <tr key={index}>
                                    <td className="text-dark fw-medium ps-4">{new Date(mov.data_hora).toLocaleString('pt-PT')}</td>
                                    <td className="fw-bold text-dark">{mov.epi_nome}</td>
                                    <td className="text-center">
                                        <span className={`badge bg-opacity-10 text-dark border px-3 py-1 rounded-pill ${mov.tipo === 'Saída' ? 'bg-warning border-warning' : mov.tipo === 'Devolução' ? 'bg-success border-success' : 'bg-info border-info'}`}>
                                            {mov.tipo}
                                        </span>
                                    </td>
                                    <td className="text-center fw-bold text-dark">{mov.quantidade}</td>
                                    <td className="text-center pe-4">
                                        <span className={`fw-bold small ${mov.status === 'Em Posse' ? 'text-warning' : mov.status === 'Devolvido' ? 'text-success' : 'text-muted'}`}>
                                            {mov.status === 'Em Posse' ? <><i className="bi bi-exclamation-circle-fill me-1"></i> Em Posse</> : mov.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {historicoColaborador.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">
                                        Nenhum registo de movimentação para este colaborador.
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