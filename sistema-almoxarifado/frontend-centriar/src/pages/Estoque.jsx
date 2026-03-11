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

const estadoInicialForm = {
    id: null, codigo_identificacao: '', nome: '', categoria: 'EPI',
    numero_ca: '', validade_ca: '', quantidade: 1, estoque_minimo: 5,
    peso: '', comprimento: ''
};

export default function Estoque() {
    const [materiais, setMateriais] = useState([]);
    const [busca, setBusca] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(estadoInicialForm);
    const [categoriaFiltro, setCategoriaFiltro] = useState('');

    const carregarMateriais = () => {
        api.get('/epis')
            .then(r => setMateriais(r.data))
            .catch(console.error);
    };

    useEffect(() => { carregarMateriais(); }, []);

    const abrirPainelNovo = () => { setFormData(estadoInicialForm); setShowForm(true); };

    const prepararEdicao = (m) => {
        setFormData({ ...m, validade_ca: m.validade_ca ? m.validade_ca.split('T')[0] : '' });
        setShowForm(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'categoria' && value !== 'Gás' && value !== 'Cobre') {
            setFormData(p => ({ ...p, categoria: value, peso: '', comprimento: '' }));
        } else {
            setFormData(p => ({ ...p, [name]: value }));
        }
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

    const itensEmAlerta = materiais.filter(m => m.quantidade <= (m.estoque_minimo || 0));

    const getStockPct = (m) => {
        const min = m.estoque_minimo || 0;
        if (min === 0) return 100;
        return Math.min(100, Math.round((m.quantidade / (min * 2)) * 100));
    };

    const getStockColor = (m) => {
        const pct = getStockPct(m);
        if (pct <= 50) return '#ef4444';
        if (pct <= 75) return '#f59e0b';
        return '#10b981';
    };

    const formatDate = (d) => {
        if (!d) return null;
        return new Date(d).toLocaleDateString('pt-BR');
    };

    return (
        <div>
            {/* ─── ALERTA ─── */}
            {itensEmAlerta.length > 0 && (
                <div className="alert-banner">
                    <div className="alert-banner-icon">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <div>
                        <div className="alert-banner-title">Reposição de Estoque Necessária</div>
                        <div className="alert-banner-text">
                            {itensEmAlerta.length} {itensEmAlerta.length === 1 ? 'item atingiu' : 'itens atingiram'} o nível mínimo:{' '}
                            {itensEmAlerta.slice(0, 3).map(i => i.nome).join(', ')}
                            {itensEmAlerta.length > 3 && ` e mais ${itensEmAlerta.length - 3}...`}
                        </div>
                    </div>
                </div>
            )}

            {/* ─── KPI CARDS ─── */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>
                        <i className="bi bi-box-seam-fill"></i>
                    </div>
                    <div className="kpi-value">{materiais.length}</div>
                    <div className="kpi-label">Itens Cadastrados</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}>
                        <i className="bi bi-check2-circle"></i>
                    </div>
                    <div className="kpi-value">{materiais.filter(m => m.quantidade > (m.estoque_minimo || 0)).length}</div>
                    <div className="kpi-label">Em Nível Adequado</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                        <i className="bi bi-arrow-down-circle-fill"></i>
                    </div>
                    <div className="kpi-value">{itensEmAlerta.length}</div>
                    <div className="kpi-label">Abaixo do Mínimo</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}>
                        <i className="bi bi-layers-fill"></i>
                    </div>
                    <div className="kpi-value">{materiais.reduce((a, m) => a + Number(m.quantidade), 0)}</div>
                    <div className="kpi-label">Unidades Totais</div>
                </div>
            </div>

            {/* ─── PAINEL PRINCIPAL ─── */}
            <div className="panel">
                {/* Toolbar */}
                <div className="panel-header">
                    <div className="panel-title">
                        <i className="bi bi-archive-fill"></i>
                        Inventário de Materiais
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 4 }}>
                            {materiaisFiltrados.length} itens
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        {/* Filtro por categoria */}
                        <select
                            className="form-select-custom"
                            style={{ width: 'auto', fontSize: 12.5, padding: '7px 32px 7px 12px' }}
                            value={categoriaFiltro}
                            onChange={e => setCategoriaFiltro(e.target.value)}
                        >
                            <option value="">Todas as categorias</option>
                            {Object.keys(categoriaBadge).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        {/* Busca */}
                        <div className="search-box">
                            <i className="bi bi-search"></i>
                            <input
                                className="search-input"
                                placeholder="Buscar item..."
                                value={busca}
                                onChange={e => setBusca(e.target.value)}
                            />
                        </div>

                        <button className="btn-primary-custom" onClick={abrirPainelNovo}>
                            <i className="bi bi-plus-lg"></i>
                            Novo Item
                        </button>
                    </div>
                </div>

                {/* Tabela */}
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descrição do Material</th>
                                <th>Categoria</th>
                                <th>Medidas</th>
                                <th>C.A. / Validade</th>
                                <th style={{ textAlign: 'center' }}>Estoque</th>
                                <th style={{ textAlign: 'right' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materiaisFiltrados.map(mat => {
                                const badge = categoriaBadge[mat.categoria] || categoriaBadge['Outros'];
                                const pct = getStockPct(mat);
                                const cor = getStockColor(mat);
                                const baixo = mat.quantidade <= (mat.estoque_minimo || 0);

                                let medidas = null;
                                if (mat.peso && mat.comprimento) medidas = `${mat.peso}kg / ${mat.comprimento}m`;
                                else if (mat.peso) medidas = `${mat.peso} kg`;
                                else if (mat.comprimento) medidas = `${mat.comprimento} m`;

                                return (
                                    <tr key={mat.id}>
                                        <td>
                                            <span className="cell-mono">{mat.codigo_identificacao || '—'}</span>
                                        </td>
                                        <td>
                                            <div className="cell-main">{mat.nome}</div>
                                            {mat.estoque_minimo > 0 && (
                                                <div className="cell-sub">Mín: {mat.estoque_minimo} un.</div>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge-pill ${badge.cls}`}>
                                                <i className={`bi ${badge.icon}`} style={{ fontSize: 10 }}></i>
                                                {mat.categoria}
                                            </span>
                                        </td>
                                        <td>
                                            {medidas
                                                ? <span style={{ fontSize: 12.5, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{medidas}</span>
                                                : <span style={{ color: 'var(--text-muted)', opacity: 0.35 }}>—</span>
                                            }
                                        </td>
                                        <td>
                                            {mat.numero_ca
                                                ? <>
                                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>CA {mat.numero_ca}</div>
                                                    {mat.validade_ca && <div className="cell-sub">{formatDate(mat.validade_ca)}</div>}
                                                  </>
                                                : <span style={{ color: 'var(--text-muted)', opacity: 0.35 }}>—</span>
                                            }
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div className="stock-indicator" style={{ justifyContent: 'center' }}>
                                                <div className="stock-bar">
                                                    <div className="stock-bar-fill" style={{ width: `${pct}%`, background: cor }}></div>
                                                </div>
                                                <span className="stock-value" style={{ color: cor }}>
                                                    {baixo && <i className="bi bi-exclamation-circle-fill" style={{ fontSize: 10, marginRight: 3 }}></i>}
                                                    {mat.quantidade}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button className="btn-ghost" onClick={() => prepararEdicao(mat)}>
                                                <i className="bi bi-pencil-square"></i>
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {materiaisFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan={7}>
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

            {/* ─── OFFCANVAS ─── */}
            <Offcanvas show={showForm} onHide={() => setShowForm(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        {formData.id
                            ? <><i className="bi bi-pencil-square" style={{ color: '#fbbf24', marginRight: 8 }}></i>Editar Material</>
                            : <><i className="bi bi-box-seam" style={{ color: 'var(--primary-light)', marginRight: 8 }}></i>Cadastrar Material</>
                        }
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <form onSubmit={salvarMaterial}>
                        <div className="form-group">
                            <label className="form-label-custom">Código (SKU)</label>
                            <input className="form-control-custom" type="text" name="codigo_identificacao"
                                placeholder="Opcional" value={formData.codigo_identificacao} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label-custom">Descrição do Material <span style={{ color: '#f87171' }}>*</span></label>
                            <input className="form-control-custom" type="text" name="nome" required
                                placeholder="Ex: Luva de Raspa" value={formData.nome} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label className="form-label-custom">Categoria</label>
                            <select className="form-select-custom" name="categoria" value={formData.categoria} onChange={handleChange}>
                                <option value="EPI">Equipamento de Proteção (EPI)</option>
                                <option value="Consumível">Consumível</option>
                                <option value="Ferramenta">Ferramenta</option>
                                <option value="Gás">Gás</option>
                                <option value="Cobre">Cobre</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>

                        {(formData.categoria === 'Gás' || formData.categoria === 'Cobre') && (
                            <div className="form-highlight form-highlight-warning">
                                <label className="form-label-custom">Medidas físicas</label>
                                <div className="form-row">
                                    <div>
                                        <label className="form-label-custom" style={{ fontSize: 9.5 }}>Peso (kg)</label>
                                        <input className="form-control-custom" type="number" step="0.01" name="peso"
                                            placeholder="0.00" value={formData.peso} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label className="form-label-custom" style={{ fontSize: 9.5 }}>Comprimento (m)</label>
                                        <input className="form-control-custom" type="number" step="0.01" name="comprimento"
                                            placeholder="0.00" value={formData.comprimento} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label-custom">Certificado de Aprovação (C.A.)</label>
                            <input className="form-control-custom" type="text" name="numero_ca"
                                value={formData.numero_ca} onChange={handleChange} placeholder="Número do C.A." />
                        </div>

                        <div className="form-group">
                            <label className="form-label-custom">Validade do C.A.</label>
                            <input className="form-control-custom" type="date" name="validade_ca"
                                value={formData.validade_ca} onChange={handleChange} />
                        </div>

                        <hr className="form-section-divider" />

                        <div className="form-row">
                            <div className="form-highlight form-highlight-warning" style={{ marginBottom: 0 }}>
                                <label className="form-label-custom">Estoque Mínimo</label>
                                <input className="form-control-custom" type="number" name="estoque_minimo" min="0"
                                    value={formData.estoque_minimo} onChange={handleChange} />
                                <div className="form-note">Gatilho de alerta</div>
                            </div>
                            <div className="form-highlight" style={{ marginBottom: 0, borderColor: 'rgba(99,102,241,0.25)', background: 'rgba(99,102,241,0.04)' }}>
                                <label className="form-label-custom" style={{ color: 'var(--primary-light)' }}>Quantidade Atual</label>
                                <input className="form-control-custom" type="number" name="quantidade" required min="0"
                                    value={formData.quantidade} onChange={handleChange} />
                                <div className="form-note">Unidades em estoque</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
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