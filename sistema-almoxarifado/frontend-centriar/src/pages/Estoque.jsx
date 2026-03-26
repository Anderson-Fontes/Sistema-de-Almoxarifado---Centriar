import React, { useState, useEffect } from 'react';
import { Offcanvas } from 'react-bootstrap';
import api from '../services/api';

const categoriaBadge = {
    'EPI':        { cls: 'badge-epi',        icon: 'bi-shield-fill-check' },
    'Consumível': { cls: 'badge-consumivel', icon: 'bi-box-seam-fill' },
    'Ferramenta': { cls: 'badge-ferramenta', icon: 'bi-wrench-adjustable' },
    'Gás':        { cls: 'badge-gas',        icon: 'bi-fire' },
    'Cobre':      { cls: 'badge-cobre',      icon: 'bi-layers-fill' },
    'Outros':     { cls: 'badge-outros',     icon: 'bi-grid-3x3-gap-fill' },
};

const pesoPorMetroCobre = {
    '1/4': 0.114, '3/8': 0.181, '1/2': 0.255, '5/8': 0.330, '3/4': 0.418
};

const estadoInicialForm = {
    id: null, codigo_identificacao: '', nome: '', categoria: 'EPI',
    numero_ca: '', validade_ca: '', quantidade: 1, estoque_minimo: 5,
    peso: '', peso_minimo: '', comprimento: '', bitola: '1/4', estado: 'Novo'
};

const coresEstado = {
    'Novo': 'text-success',
    'Bom Estado': 'text-primary',
    'Marcas de Uso': 'text-warning',
    'Com Defeito': 'text-danger',
    'Quebrado / Sucata': 'text-danger fw-bold'
};

// Função para calcular quantos dias faltam para uma data
const calcularDiasVencimento = (dataIso) => {
    if (!dataIso) return null;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const vencimento = new Date(dataIso);
    vencimento.setHours(0, 0, 0, 0);
    
    const diffTime = vencimento - hoje;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function Estoque() {
    const [materiais, setMateriais] = useState([]);
    const [busca, setBusca] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(estadoInicialForm);
    const [categoriaFiltro, setCategoriaFiltro] = useState('');

    const carregarMateriais = () => {
        api.get('/epis').then(r => setMateriais(r.data)).catch(console.error);
    };

    useEffect(() => { carregarMateriais(); }, []);

    const abrirPainelNovo = () => { setFormData(estadoInicialForm); setShowForm(true); };

    const prepararEdicao = (m) => {
        setFormData({ 
            ...m, 
            validade_ca: m.validade_ca ? m.validade_ca.split('T')[0] : '', 
            bitola: m.bitola || '1/4', 
            estado: m.estado || 'Novo' 
        });
        setShowForm(true);
    };

    const excluirMaterial = async (id, nome) => {
        if (window.confirm(`Tem certeza que deseja excluir "${nome}"?\n\nO histórico de quem usou será mantido nos relatórios, mas o item sumirá do estoque definitivamente.`)) {
            try {
                await api.delete(`/epis/${id}`);
                carregarMateriais();
            } catch (error) {
                alert('Erro ao tentar excluir o material.');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let novoForm = { ...formData, [name]: value };

        if (name === 'categoria') {
            if (value === 'Gás') {
                novoForm = { ...novoForm, comprimento: '', bitola: '', peso: '', peso_minimo: '' };
            } else if (value === 'Cobre') {
                novoForm = { ...novoForm, peso: '', comprimento: '', bitola: '1/4', peso_minimo: '' };
            } else {
                novoForm = { ...novoForm, peso: '', peso_minimo: '', comprimento: '', bitola: '' };
            }
        }

        if (novoForm.categoria === 'Cobre' && (name === 'peso' || name === 'bitola')) {
            const pesoInfo = parseFloat(novoForm.peso || 0);
            const fator = pesoPorMetroCobre[novoForm.bitola || '1/4'] || 0;
            novoForm.comprimento = (pesoInfo > 0 && fator > 0) ? (pesoInfo / fator).toFixed(2) : '';
        }

        setFormData(novoForm);
    };

    const salvarMaterial = (e) => {
        e.preventDefault();
        const req = formData.id
            ? api.put(`/epis/${formData.id}`, formData)
            : api.post('/epis', formData);
        req.then(() => { setShowForm(false); carregarMateriais(); })
           .catch(() => alert('Erro ao salvar.'));
    };

    const materiaisFiltrados = materiais.filter(m => {
        const matchBusca =
            m.nome.toLowerCase().includes(busca.toLowerCase()) ||
            (m.codigo_identificacao && m.codigo_identificacao.toLowerCase().includes(busca.toLowerCase())) ||
            m.categoria.toLowerCase().includes(busca.toLowerCase());
        const matchCategoria = categoriaFiltro === '' || m.categoria === categoriaFiltro;
        return matchBusca && matchCategoria;
    });

    const itensEmAlerta = materiais.filter(m => {
        if (m.categoria === 'Gás' || m.categoria === 'Cobre') {
            const pesoAtual = parseFloat(m.peso || 0);
            const pesoMin = parseFloat(m.peso_minimo || 0);
            return pesoMin > 0 && pesoAtual <= pesoMin;
        } else {
            return parseInt(m.quantidade || 0) <= parseInt(m.estoque_minimo || 0);
        }
    });

    // Filtra C.A.s vencidos ou vencendo em até 30 dias para o Banner Amarelo
    const casEmAlerta = materiais.filter(m => {
        if (m.categoria !== 'EPI' || !m.validade_ca) return false;
        const dias = calcularDiasVencimento(m.validade_ca);
        return dias !== null && dias <= 30;
    });

    const getStockPct = (m) => {
        if (m.categoria === 'Gás' || m.categoria === 'Cobre') {
            const min = parseFloat(m.peso_minimo || 0);
            const atual = parseFloat(m.peso || 0);
            if (min === 0) return 100;
            return Math.min(100, Math.round((atual / (min * 3)) * 100));
        }
        const min = parseInt(m.estoque_minimo || 0);
        const atual = parseInt(m.quantidade || 0);
        if (min === 0) return 100;
        return Math.min(100, Math.round((atual / (min * 2)) * 100));
    };

    const getStockColor = (m) => {
        const pct = getStockPct(m);
        if (pct <= 50) return '#ef4444';
        if (pct <= 75) return '#f59e0b';
        return '#10b981';
    };

    return (
        <div>
            {/* ─── ALERTA DE ESTOQUE ─── */}
            {itensEmAlerta.length > 0 && (
                <div className="alert-banner" style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '16px', borderRadius: '12px', display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ color: '#ef4444', fontSize: '24px' }}><i className="bi bi-exclamation-triangle-fill"></i></div>
                    <div>
                        <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: '4px' }}>Reposição de Estoque Necessária</div>
                        <div style={{ color: '#b91c1c', fontSize: '14px' }}>{itensEmAlerta.length} {itensEmAlerta.length === 1 ? 'item atingiu' : 'itens atingiram'} o nível mínimo crítico.</div>
                    </div>
                </div>
            )}

            {/* ─── ALERTA DE C.A. VENCENDO ─── */}
            {casEmAlerta.length > 0 && (
                <div className="alert-banner" style={{ background: '#fffbeb', border: '1px solid #fcd34d', padding: '16px', borderRadius: '12px', display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ color: '#d97706', fontSize: '24px' }}><i className="bi bi-shield-exclamation"></i></div>
                    <div>
                        <div style={{ fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>Atenção: Validade de C.A.</div>
                        <div style={{ color: '#b45309', fontSize: '14px' }}>
                            {casEmAlerta.length} {casEmAlerta.length === 1 ? 'EPI está' : 'EPIs estão'} com o Certificado de Aprovação vencido ou vencendo nos próximos 30 dias.
                        </div>
                    </div>
                </div>
            )}

            {/* ─── KPI CARDS ─── */}
            <div className="kpi-grid">
                <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}><i className="bi bi-box-seam-fill"></i></div><div className="kpi-value">{materiais.length}</div><div className="kpi-label">Itens Cadastrados</div></div>
                <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}><i className="bi bi-check2-circle"></i></div><div className="kpi-value">{materiais.length - itensEmAlerta.length}</div><div className="kpi-label">Em Nível Adequado</div></div>
                <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}><i className="bi bi-arrow-down-circle-fill"></i></div><div className="kpi-value text-danger">{itensEmAlerta.length}</div><div className="kpi-label">Abaixo do Mínimo</div></div>
                <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}><i className="bi bi-shield-exclamation"></i></div><div className="kpi-value text-warning">{casEmAlerta.length}</div><div className="kpi-label">C.A. em Alerta</div></div>
            </div>

            {/* ─── PAINEL PRINCIPAL ─── */}
            <div className="panel">
                <div className="panel-header">
                    <div className="panel-title">
                        <i className="bi bi-archive-fill"></i> Inventário de Materiais
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 4 }}>{materiaisFiltrados.length} itens</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <select className="form-select-custom" style={{ width: 'auto', fontSize: 12.5, padding: '7px 32px 7px 12px' }} value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)}>
                            <option value="">Todas as categorias</option>
                            {Object.keys(categoriaBadge).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="search-box"><i className="bi bi-search"></i><input className="search-input" placeholder="Buscar item..." value={busca} onChange={e => setBusca(e.target.value)} /></div>
                        <button className="btn-primary-custom" onClick={abrirPainelNovo}><i className="bi bi-plus-lg"></i> Novo Item</button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descrição / Estado</th>
                                <th>Categoria</th>
                                <th>Medidas</th>
                                <th style={{ textAlign: 'center' }}>Nível de Estoque</th>
                                <th style={{ textAlign: 'right' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materiaisFiltrados.map(mat => {
                                const badge = categoriaBadge[mat.categoria] || categoriaBadge['Outros'];
                                const pct = getStockPct(mat);
                                const cor = getStockColor(mat);
                                
                                const isGasOuCobre = mat.categoria === 'Gás' || mat.categoria === 'Cobre';
                                const baixo = isGasOuCobre 
                                    ? parseFloat(mat.peso || 0) <= parseFloat(mat.peso_minimo || 0)
                                    : parseInt(mat.quantidade || 0) <= parseInt(mat.estoque_minimo || 0);

                                let medidas = null;
                                if (mat.peso && mat.comprimento) medidas = `${mat.peso}kg / ${mat.comprimento}m`;
                                else if (mat.peso) medidas = `${mat.peso} kg`;
                                else if (mat.comprimento) medidas = `${mat.comprimento} m`;

                                const corDoEstado = coresEstado[mat.estado] || 'text-muted';
                                
                                // Lógica detalhada de cores e contagem de dias do C.A. na tabela
                                let textoCA = null;
                                if (mat.categoria === 'EPI' && mat.numero_ca) {
                                    const diasCA = calcularDiasVencimento(mat.validade_ca);
                                    if (diasCA === null) {
                                        textoCA = <span className="text-muted ms-2">| C.A.: {mat.numero_ca} (Sem data informada)</span>;
                                    } else if (diasCA < 0) {
                                        textoCA = <span className="text-danger fw-bold ms-2">| C.A.: {mat.numero_ca} (Vencido há {Math.abs(diasCA)} dias)</span>;
                                    } else if (diasCA === 0) {
                                        textoCA = <span className="text-danger fw-bold ms-2">| C.A.: {mat.numero_ca} (Vence HOJE)</span>;
                                    } else if (diasCA <= 30) {
                                        textoCA = <span className="text-warning fw-bold ms-2">| C.A.: {mat.numero_ca} (Vence em {diasCA} dias)</span>;
                                    } else {
                                        textoCA = <span className="text-success ms-2">| C.A.: {mat.numero_ca} (Faltam {diasCA} dias)</span>;
                                    }
                                }

                                return (
                                    <tr key={mat.id}>
                                        <td><span className="cell-mono">{mat.codigo_identificacao || '—'}</span></td>
                                        <td>
                                            <div className="cell-main">{mat.nome}</div>
                                            <div className="cell-sub" style={{ fontSize: '11.5px', marginTop: '2px' }}>
                                                Estado: <span className={corDoEstado}>{mat.estado || 'Não informado'}</span>
                                                {textoCA}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge-pill ${badge.cls}`}><i className={`bi ${badge.icon}`} style={{ fontSize: 10 }}></i> {mat.categoria}</span>
                                        </td>
                                        <td>
                                            {medidas ? <span style={{ fontSize: 12.5, fontFamily: 'monospace', color: '#475569', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{medidas}</span> : <span style={{ color: '#cbd5e1' }}>—</span>}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div className="stock-indicator" style={{ justifyContent: 'center' }}>
                                                <div className="stock-bar" style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div className="stock-bar-fill" style={{ width: `${pct}%`, height: '100%', background: cor, borderRadius: '3px' }}></div>
                                                </div>
                                                <span className="stock-value fw-bold" style={{ color: cor, minWidth: '40px', textAlign: 'left' }}>
                                                    {baixo && <i className="bi bi-exclamation-circle-fill" style={{ fontSize: 10, marginRight: 3 }}></i>}
                                                    {isGasOuCobre ? `${mat.peso || 0}kg` : `${mat.quantidade} un`}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button className="btn-ghost" onClick={() => prepararEdicao(mat)} title="Editar"><i className="bi bi-pencil-square"></i></button>
                                                <button className="btn-ghost" style={{ color: '#ef4444', borderColor: 'transparent' }} onClick={() => excluirMaterial(mat.id, mat.nome)} title="Excluir"><i className="bi bi-trash3-fill"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {materiaisFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state">
                                            <div className="empty-state-icon"><i className="bi bi-search"></i></div>
                                            <div className="empty-state-title">Nenhum item encontrado</div>
                                            <div className="empty-state-text">Tente outro termo ou categoria</div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ─── OFFCANVAS (Formulário Lateral) ─── */}
            <Offcanvas show={showForm} onHide={() => setShowForm(false)} placement="end" style={{ width: '450px' }}>
                <Offcanvas.Header closeButton style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <Offcanvas.Title className="fw-bold fs-5">
                        {formData.id ? <><i className="bi bi-pencil-square text-warning me-2"></i>Editar Material</> : <><i className="bi bi-box-seam text-primary me-2"></i>Cadastrar Material</>}
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-4">
                    <form onSubmit={salvarMaterial}>
                        <div className="mb-3">
                            <label className="form-label-custom">Código (SKU) / ID Cilindro</label>
                            <input className="form-control-custom" type="text" name="codigo_identificacao" placeholder="Ex: CIL-045" value={formData.codigo_identificacao} onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label-custom">Descrição do Material <span className="text-danger">*</span></label>
                            <input className="form-control-custom" type="text" name="nome" required placeholder="Ex: Capacete de Segurança" value={formData.nome} onChange={handleChange} />
                        </div>

                        <div className="row mb-4">
                            <div className="col-6">
                                <label className="form-label-custom">Categoria</label>
                                <select className="form-select-custom" name="categoria" value={formData.categoria} onChange={handleChange}>
                                    <option value="EPI">Proteção (EPI)</option>
                                    <option value="Consumível">Consumível</option>
                                    <option value="Ferramenta">Ferramenta</option>
                                    <option value="Gás">Gás / Fluidos</option>
                                    <option value="Cobre">Cobre</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="form-label-custom">Estado Físico</label>
                                <select className="form-select-custom" name="estado" value={formData.estado} onChange={handleChange}>
                                    <option value="Novo">Novo</option>
                                    <option value="Bom Estado">Bom Estado</option>
                                    <option value="Marcas de Uso">Marcas de Uso</option>
                                    <option value="Com Defeito">Com Defeito</option>
                                    <option value="Quebrado / Sucata">Quebrado / Sucata</option>
                                </select>
                            </div>
                        </div>

                        {/* ─── LÓGICAS CONDICIONAIS DE PESO E QTD ─── */}
                        {formData.categoria === 'Gás' && (
                            <div className="form-highlight form-highlight-warning" style={{ background: '#fffbeb', borderColor: '#fcd34d' }}>
                                <label className="form-label-custom text-warning-emphasis"><i className="bi bi-speedometer2 me-1"></i> Controle de Fluido (KG)</label>
                                <div className="form-row">
                                    <div style={{ width: '50%' }}><label className="form-label-custom text-primary" style={{ fontSize: 9.5 }}>Peso na Balança (kg)</label><input className="form-control-custom" type="number" step="0.01" name="peso" placeholder="Ex: 11.5" value={formData.peso} onChange={handleChange} /></div>
                                    <div style={{ width: '50%' }}><label className="form-label-custom text-danger" style={{ fontSize: 9.5 }}>Alerta: Peso Mín. (kg)</label><input className="form-control-custom" type="number" step="0.01" name="peso_minimo" placeholder="Ex: 2.0" value={formData.peso_minimo} onChange={handleChange} /></div>
                                </div>
                            </div>
                        )}

                        {formData.categoria === 'Cobre' && (
                            <div className="form-highlight form-highlight-warning" style={{ background: '#fffbeb', borderColor: '#fcd34d' }}>
                                <label className="form-label-custom text-warning-emphasis"><i className="bi bi-calculator me-1"></i> Calculadora por Balança</label>
                                <div className="form-row mb-2">
                                    <div style={{ width: '50%' }}><label className="form-label-custom" style={{ fontSize: 9.5 }}>Bitola</label><select className="form-select-custom" name="bitola" value={formData.bitola} onChange={handleChange}><option value="1/4">1/4"</option><option value="3/8">3/8"</option><option value="1/2">1/2"</option><option value="5/8">5/8"</option><option value="3/4">3/4"</option></select></div>
                                    <div style={{ width: '50%' }}><label className="form-label-custom text-primary" style={{ fontSize: 9.5 }}>Peso na Balança (kg)</label><input className="form-control-custom" type="number" step="0.01" name="peso" placeholder="Ex: 1.71" value={formData.peso} onChange={handleChange} /></div>
                                </div>
                                <div className="form-row">
                                    <div style={{ width: '50%' }}><label className="form-label-custom" style={{ fontSize: 9.5 }}>Metros (Calculado)</label><input className="form-control-custom bg-light" type="text" readOnly placeholder="Automático" value={formData.comprimento} /></div>
                                    <div style={{ width: '50%' }}><label className="form-label-custom text-danger" style={{ fontSize: 9.5 }}>Alerta Mín. (kg)</label><input className="form-control-custom" type="number" step="0.01" name="peso_minimo" placeholder="Ex: 0.5" value={formData.peso_minimo} onChange={handleChange} /></div>
                                </div>
                            </div>
                        )}

                        {(formData.categoria !== 'Gás' && formData.categoria !== 'Cobre') && (
                            <div className="form-row" style={{ marginBottom: '16px' }}>
                                <div className="form-highlight form-highlight-warning" style={{ marginBottom: 0, width: '50%' }}><label className="form-label-custom">Estoque Mínimo</label><input className="form-control-custom" type="number" name="estoque_minimo" min="0" value={formData.estoque_minimo} onChange={handleChange} /></div>
                                <div className="form-highlight" style={{ marginBottom: 0, width: '50%', borderColor: 'rgba(99,102,241,0.25)', background: 'rgba(99,102,241,0.04)' }}><label className="form-label-custom" style={{ color: 'var(--primary-light)' }}>Qtd Atual</label><input className="form-control-custom" type="number" name="quantidade" required min="0" value={formData.quantidade} onChange={handleChange} /></div>
                            </div>
                        )}

                        <div className="form-group border-top pt-3 mt-3">
                            <label className="form-label-custom">Certificado de Aprovação (C.A.)</label>
                            <input className="form-control-custom" type="text" name="numero_ca" value={formData.numero_ca} onChange={handleChange} placeholder="Opcional (Apenas EPIs)" />
                        </div>
                        <div className="form-group">
                            <label className="form-label-custom">Validade do C.A.</label>
                            <input className="form-control-custom" type="date" name="validade_ca" value={formData.validade_ca} onChange={handleChange} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
                            <button type="submit" className="btn-primary-custom" style={{ justifyContent: 'center', padding: '11px', fontSize: 14, width: '100%', borderRadius: 10 }}>{formData.id ? 'Salvar Alterações' : 'Confirmar Cadastro'}</button>
                            <button type="button" className="btn-ghost" style={{ justifyContent: 'center', padding: '11px', fontSize: 14, width: '100%', borderRadius: 10 }} onClick={() => setShowForm(false)}>Cancelar</button>
                        </div>
                    </form>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}