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
    peso: '', peso_minimo: '', comprimento: '', bitola: '1/4'
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
        setFormData({ ...m, validade_ca: m.validade_ca ? m.validade_ca.split('T')[0] : '', bitola: m.bitola || '1/4' });
        setShowForm(true);
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

        if (novoForm.categoria === 'Cobre') {
            if (name === 'peso' || name === 'bitola') {
                const pesoInfo = parseFloat(novoForm.peso || 0);
                const bitola = novoForm.bitola || '1/4';
                const fator = pesoPorMetroCobre[bitola] || 0;
                novoForm.comprimento = (pesoInfo > 0 && fator > 0) ? (pesoInfo / fator).toFixed(2) : '';
            }
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
            return parseFloat(m.peso_minimo || 0) > 0 && parseFloat(m.peso || 0) <= parseFloat(m.peso_minimo || 0);
        }
        return parseInt(m.quantidade || 0) <= parseInt(m.estoque_minimo || 0);
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
                            {itensEmAlerta.length} {itensEmAlerta.length === 1 ? 'item atingiu' : 'itens atingiram'} o nível mínimo crítico (Peso ou Quantidade).
                        </div>
                    </div>
                    {/* Lista rápida dos itens em alerta */}
                    <div style={{ marginLeft: 'auto', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {itensEmAlerta.slice(0, 4).map(m => (
                            <span key={m.id} style={{
                                fontSize: 11, fontWeight: 600, padding: '3px 9px',
                                background: 'rgba(239,68,68,0.12)', color: '#fca5a5',
                                border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20
                            }}>
                                {m.nome}
                            </span>
                        ))}
                        {itensEmAlerta.length > 4 && (
                            <span style={{
                                fontSize: 11, fontWeight: 600, padding: '3px 9px',
                                background: 'rgba(239,68,68,0.08)', color: '#f87171',
                                border: '1px solid rgba(239,68,68,0.15)', borderRadius: 20
                            }}>
                                +{itensEmAlerta.length - 4} mais
                            </span>
                        )}
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
                    <div className="kpi-value">{materiais.length - itensEmAlerta.length}</div>
                    <div className="kpi-label">Em Nível Adequado</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                        <i className="bi bi-arrow-down-circle-fill"></i>
                    </div>
                    <div className="kpi-value" style={{ color: itensEmAlerta.length > 0 ? '#f87171' : 'var(--text-primary)' }}>
                        {itensEmAlerta.length}
                    </div>
                    <div className="kpi-label">Abaixo do Mínimo</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}>
                        <i className="bi bi-layers-fill"></i>
                    </div>
                    <div className="kpi-value">{materiais.reduce((a, m) => a + Number(m.quantidade || 0), 0)}</div>
                    <div className="kpi-label">Unidades Físicas Totais</div>
                </div>
            </div>

            {/* ─── PAINEL PRINCIPAL ─── */}
            <div className="panel">
                <div className="panel-header">
                    <div className="panel-title">
                        <i className="bi bi-archive-fill"></i>
                        Inventário de Materiais
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 4 }}>
                            {materiaisFiltrados.length} itens
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
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
                        <div className="search-box">
                            <i className="bi bi-search"></i>
                            <input className="search-input" placeholder="Buscar item..." value={busca} onChange={e => setBusca(e.target.value)} />
                        </div>
                        <button className="btn-primary-custom" onClick={abrirPainelNovo}>
                            <i className="bi bi-plus-lg"></i> Novo Item
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
                                <th>Medidas / Status</th>
                                <th style={{ textAlign: 'center' }}>Nível de Estoque</th>
                                <th style={{ textAlign: 'right' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materiaisFiltrados.map(mat => {
                                const badge = categoriaBadge[mat.categoria] || categoriaBadge['Outros'];
                                const pct   = getStockPct(mat);
                                const cor   = getStockColor(mat);
                                const isGasOuCobre = mat.categoria === 'Gás' || mat.categoria === 'Cobre';
                                const baixo = isGasOuCobre
                                    ? parseFloat(mat.peso || 0) <= parseFloat(mat.peso_minimo || 0)
                                    : parseInt(mat.quantidade || 0) <= parseInt(mat.estoque_minimo || 0);

                                let medidas = null;
                                if (mat.peso && mat.comprimento) medidas = `${mat.peso} kg · ${mat.comprimento} m`;
                                else if (mat.peso)       medidas = `${mat.peso} kg`;
                                else if (mat.comprimento) medidas = `${mat.comprimento} m`;

                                return (
                                    <tr key={mat.id}>
                                        <td>
                                            <span className="cell-mono">{mat.codigo_identificacao || '—'}</span>
                                        </td>
                                        <td>
                                            <div className="cell-main">{mat.nome}</div>
                                            {isGasOuCobre
                                                ? mat.peso_minimo > 0 && <div className="cell-sub">Alerta: {mat.peso_minimo} kg</div>
                                                : mat.estoque_minimo > 0 && <div className="cell-sub">Alerta: {mat.estoque_minimo} un.</div>
                                            }
                                            {/* Validade CA */}
                                            {mat.validade_ca && (
                                                <div className="cell-sub" style={{ marginTop: 3 }}>
                                                    <i className="bi bi-patch-check" style={{ marginRight: 3, fontSize: 10 }}></i>
                                                    CA válido até {formatDate(mat.validade_ca)}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge-pill ${badge.cls}`}>
                                                <i className={`bi ${badge.icon}`} style={{ fontSize: 10 }}></i>
                                                {mat.categoria}
                                            </span>
                                        </td>

                                        {/* ─── COLUNA MEDIDAS — totalmente dark ─── */}
                                        <td>
                                            {medidas ? (
                                                <span style={{
                                                    fontSize: 12,
                                                    fontFamily: 'var(--font-mono)',
                                                    color: 'var(--text-secondary)',
                                                    background: 'var(--surface-4)',
                                                    border: '1px solid var(--border)',
                                                    padding: '3px 8px',
                                                    borderRadius: 6,
                                                    letterSpacing: '0.2px',
                                                    display: 'inline-block'
                                                }}>
                                                    {medidas}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>—</span>
                                            )}
                                        </td>

                                        {/* ─── COLUNA NÍVEL DE ESTOQUE ─── */}
                                        <td style={{ textAlign: 'center' }}>
                                            <div className="stock-indicator" style={{ justifyContent: 'center' }}>
                                                <div className="stock-bar">
                                                    <div className="stock-bar-fill" style={{ width: `${pct}%`, background: cor }} />
                                                </div>
                                                <span className="stock-value" style={{ color: cor }}>
                                                    {baixo && (
                                                        <i className="bi bi-exclamation-circle-fill" style={{ fontSize: 10, marginRight: 3 }}></i>
                                                    )}
                                                    {isGasOuCobre ? `${mat.peso || 0} kg` : `${mat.quantidade} un`}
                                                </span>
                                            </div>
                                        </td>

                                        <td style={{ textAlign: 'right' }}>
                                            <button className="btn-ghost" onClick={() => prepararEdicao(mat)}>
                                                <i className="bi bi-pencil-square"></i> Editar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {materiaisFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state">
                                            <div className="empty-state-icon"><i className="bi bi-box-seam"></i></div>
                                            <div className="empty-state-title">Nenhum item encontrado</div>
                                            <div className="empty-state-text">Ajuste os filtros ou cadastre um novo material</div>
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
                            : <><i className="bi bi-box-seam-fill" style={{ color: 'var(--primary-light)', marginRight: 8 }}></i>Cadastrar Material</>
                        }
                    </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <form onSubmit={salvarMaterial}>

                        {/* Código SKU */}
                        <div className="form-group">
                            <label className="form-label-custom">Código (SKU) / ID Cilindro</label>
                            <input
                                className="form-control-custom"
                                type="text"
                                name="codigo_identificacao"
                                placeholder="Ex: CIL-045"
                                value={formData.codigo_identificacao}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Nome */}
                        <div className="form-group">
                            <label className="form-label-custom">
                                Descrição do Material <span style={{ color: '#f87171' }}>*</span>
                            </label>
                            <input
                                className="form-control-custom"
                                type="text"
                                name="nome"
                                required
                                placeholder="Ex: Cilindro Gás R410A"
                                value={formData.nome}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Categoria */}
                        <div className="form-group">
                            <label className="form-label-custom">Categoria</label>
                            <select className="form-select-custom" name="categoria" value={formData.categoria} onChange={handleChange}>
                                <option value="EPI">Equipamento de Proteção (EPI)</option>
                                <option value="Consumível">Consumível Geral</option>
                                <option value="Ferramenta">Ferramenta</option>
                                <option value="Gás">Gás / Fluidos</option>
                                <option value="Cobre">Tubulação de Cobre</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>

                        {/* ─── GÁS ─── */}
                        {formData.categoria === 'Gás' && (
                            <div className="form-highlight form-highlight-warning">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: 7,
                                        background: 'rgba(245,158,11,0.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#fbbf24', fontSize: 13, flexShrink: 0
                                    }}>
                                        <i className="bi bi-speedometer2"></i>
                                    </div>
                                    <label className="form-label-custom" style={{ color: '#fbbf24', margin: 0 }}>
                                        Controle de Fluido (KG)
                                    </label>
                                </div>
                                <div className="form-row">
                                    <div>
                                        <label className="form-label-custom" style={{ color: 'var(--primary-light)' }}>
                                            Peso na Balança (kg)
                                        </label>
                                        <input
                                            className="form-control-custom"
                                            type="number" step="0.01" name="peso"
                                            placeholder="Ex: 11.5"
                                            value={formData.peso}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label-custom" style={{ color: '#f87171' }}>
                                            Alerta: Peso Mín. (kg)
                                        </label>
                                        <input
                                            className="form-control-custom"
                                            type="number" step="0.01" name="peso_minimo"
                                            placeholder="Ex: 2.0"
                                            value={formData.peso_minimo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─── COBRE ─── */}
                        {formData.categoria === 'Cobre' && (
                            <div className="form-highlight form-highlight-warning">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: 7,
                                        background: 'rgba(16,185,129,0.12)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#34d399', fontSize: 13, flexShrink: 0
                                    }}>
                                        <i className="bi bi-calculator"></i>
                                    </div>
                                    <label className="form-label-custom" style={{ color: '#34d399', margin: 0 }}>
                                        Calculadora por Balança
                                    </label>
                                </div>

                                {/* Linha 1: Bitola + Peso */}
                                <div className="form-row" style={{ marginBottom: 10 }}>
                                    <div>
                                        <label className="form-label-custom">Bitola</label>
                                        <select className="form-select-custom" name="bitola" value={formData.bitola} onChange={handleChange}>
                                            <option value="1/4">1/4"</option>
                                            <option value="3/8">3/8"</option>
                                            <option value="1/2">1/2"</option>
                                            <option value="5/8">5/8"</option>
                                            <option value="3/4">3/4"</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label-custom" style={{ color: 'var(--primary-light)' }}>
                                            Peso na Balança (kg)
                                        </label>
                                        <input
                                            className="form-control-custom"
                                            type="number" step="0.01" name="peso"
                                            placeholder="Ex: 1.71"
                                            value={formData.peso}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Linha 2: Metros calculado + Alerta mínimo */}
                                <div className="form-row">
                                    <div>
                                        <label className="form-label-custom" style={{ color: '#34d399' }}>
                                            Metros (Calculado)
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                className="form-control-custom"
                                                type="text"
                                                readOnly
                                                placeholder="Automático"
                                                value={formData.comprimento ? `${formData.comprimento} m` : ''}
                                                style={{
                                                    background: 'var(--surface-2)',
                                                    color: formData.comprimento ? '#34d399' : 'var(--text-muted)',
                                                    cursor: 'default',
                                                    fontFamily: 'var(--font-mono)',
                                                    fontWeight: 600,
                                                    fontSize: 13,
                                                    borderColor: formData.comprimento ? 'rgba(16,185,129,0.25)' : 'var(--border)'
                                                }}
                                            />
                                            {formData.comprimento && (
                                                <i className="bi bi-calculator-fill" style={{
                                                    position: 'absolute', right: 10, top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: '#34d399', fontSize: 11, opacity: 0.6
                                                }} />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="form-label-custom" style={{ color: '#f87171' }}>
                                            Alerta Mín. (kg)
                                        </label>
                                        <input
                                            className="form-control-custom"
                                            type="number" step="0.01" name="peso_minimo"
                                            placeholder="Ex: 0.5"
                                            value={formData.peso_minimo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─── EPI / FERRAMENTA / OUTROS ─── */}
                        {(formData.categoria !== 'Gás' && formData.categoria !== 'Cobre') && (
                            <div className="form-row" style={{ marginBottom: 16 }}>
                                <div className="form-highlight form-highlight-warning" style={{ marginBottom: 0 }}>
                                    <label className="form-label-custom">Estoque Mínimo</label>
                                    <input
                                        className="form-control-custom"
                                        type="number" name="estoque_minimo" min="0"
                                        value={formData.estoque_minimo}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-highlight" style={{
                                    marginBottom: 0,
                                    borderColor: 'rgba(99,102,241,0.2)',
                                    background: 'rgba(99,102,241,0.06)'
                                }}>
                                    <label className="form-label-custom" style={{ color: 'var(--primary-light)' }}>
                                        Qtd. Atual
                                    </label>
                                    <input
                                        className="form-control-custom"
                                        type="number" name="quantidade" required min="0"
                                        value={formData.quantidade}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Divisor */}
                        <hr className="form-section-divider" />

                        {/* CA */}
                        <div className="form-group">
                            <label className="form-label-custom">Certificado de Aprovação (C.A.)</label>
                            <input
                                className="form-control-custom"
                                type="text" name="numero_ca"
                                placeholder="Opcional"
                                value={formData.numero_ca}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label-custom">Validade do C.A.</label>
                            <input
                                className="form-control-custom"
                                type="date" name="validade_ca"
                                value={formData.validade_ca}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Botões */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 28 }}>
                            <button
                                type="submit"
                                className="btn-primary-custom"
                                style={{ justifyContent: 'center', padding: '11px', fontSize: 14, width: '100%', borderRadius: 10 }}
                            >
                                <i className={`bi ${formData.id ? 'bi-floppy-fill' : 'bi-check2-circle'}`}></i>
                                {formData.id ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                            </button>
                            <button
                                type="button"
                                className="btn-ghost"
                                style={{ justifyContent: 'center', padding: '11px', fontSize: 14, width: '100%', borderRadius: 10 }}
                                onClick={() => setShowForm(false)}
                            >
                                Cancelar
                            </button>
                        </div>

                    </form>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}