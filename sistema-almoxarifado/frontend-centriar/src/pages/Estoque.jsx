import React, { useState, useEffect } from 'react';
import { Offcanvas, Modal } from 'react-bootstrap';
import api from '../services/api';

const categoriaBadge = {
    'EPI':            { cls: 'badge-epi',         icon: 'bi-shield-fill-check' },
    'Consumível':     { cls: 'badge-consumivel', icon: 'bi-box-seam-fill' },
    'Ferramenta':     { cls: 'badge-ferramenta', icon: 'bi-wrench-adjustable' },
    'Gás':            { cls: 'badge-gas',        icon: 'bi-fire' },
    'Cobre':          { cls: 'badge-cobre',      icon: 'bi-layers-fill' },
    'Cabo/Mangueira': { cls: 'badge-cabo',       icon: 'bi-plug-fill' },
    'Compressor':     { cls: 'badge-compressor', icon: 'bi-cpu-fill' }, 
    'Outros':         { cls: 'badge-outros',     icon: 'bi-grid-3x3-gap-fill' },
};

const pesoPorMetroCobre = { '1/4': 0.114, '3/8': 0.181, '1/2': 0.255, '5/8': 0.330, '3/4': 0.418 };

const estadoInicialForm = {
    id: null, codigo_identificacao: '', nome: '', categoria: 'EPI',
    numero_ca: '', validade_ca: '', quantidade: 1, estoque_minimo: 5,
    peso: '', peso_minimo: '', comprimento: '', bitola: '1/4', estado: 'Novo', nivel_pacote: '',
    btu: '12000', gas_refrigerante: 'R-410A', voltagem: '220V Monofásico', tecnologia: 'Inverter'
};

const coresEstado = { 'Novo': 'text-success', 'Bom Estado': 'text-primary', 'Marcas de Uso': 'text-warning', 'Com Defeito': 'text-danger', 'Quebrado / Sucata': 'text-danger fw-bold' };

const calcularDiasVencimento = (dataIso) => {
    if (!dataIso) return null;
    try {
        const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
        const dataLimpa = dataIso.split('T')[0];
        const vencimento = new Date(dataLimpa + 'T12:00:00'); vencimento.setHours(0, 0, 0, 0);
        const dias = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));
        return isNaN(dias) ? null : dias;
    } catch (e) {
        return null;
    }
};

export default function Estoque({ user }) {
    const [materiais, setMateriais] = useState([]);
    const [busca, setBusca] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(estadoInicialForm);
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    
    // Estados dos Alertas
    const [trocasEmAlerta, setTrocasEmAlerta] = useState([]); 
    const [showModalAlertas, setShowModalAlertas] = useState(false);
    const [abaAlerta, setAbaAlerta] = useState('todos');
    const [colaboradorExpandido, setColaboradorExpandido] = useState(null); 
    const [categoriaExpandida, setCategoriaExpandida] = useState(null); // NOVO: Controla a sanfona de categorias de estoque

    const isAdmin = user?.perfil === 'ADMIN';

    const carregarMateriais = () => { 
        api.get('/epis').then(r => setMateriais(r.data)).catch(console.error); 
        api.get('/fichas-epi/alertas').then(r => setTrocasEmAlerta(r.data)).catch(console.error);
    };
    
    useEffect(() => { carregarMateriais(); }, []);

    const abrirPainelNovo = () => { 
        if (!isAdmin) return;
        setFormData(estadoInicialForm); 
        setShowForm(true); 
    };

    const prepararEdicao = (m) => {
        if (!isAdmin) return;
        setFormData({ 
            ...m, validade_ca: m.validade_ca ? m.validade_ca.split('T')[0] : '', 
            bitola: m.bitola || '1/4', estado: m.estado || 'Novo', nivel_pacote: m.nivel_pacote || '',
            btu: m.btu || '12000', gas_refrigerante: m.gas_refrigerante || 'R-410A', voltagem: m.voltagem || '220V Monofásico', tecnologia: m.tecnologia || 'Inverter'
        });
        setShowForm(true);
    };

    const excluirMaterial = async (id, nome) => {
        if (!isAdmin) return; 
        if (window.confirm(`Tem certeza que deseja excluir "${nome}"?\n\nO histórico de quem usou será mantido.`)) {
            try { await api.delete(`/epis/${id}`); carregarMateriais(); } catch (error) { alert('Erro ao excluir.'); }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let novoForm = { ...formData, [name]: value };

        if (name === 'categoria') {
            const baseLimpa = { peso: '', peso_minimo: '', comprimento: '', bitola: '', nivel_pacote: '', btu: '', gas_refrigerante: '', voltagem: '', tecnologia: '' };
            if (value === 'Gás') novoForm = { ...novoForm, ...baseLimpa };
            else if (value === 'Cobre') novoForm = { ...novoForm, ...baseLimpa, bitola: '1/4' };
            else if (value === 'Compressor') novoForm = { ...novoForm, ...baseLimpa, btu: '12000', gas_refrigerante: 'R-410A', voltagem: '220V Monofásico', tecnologia: 'Inverter' };
            else novoForm = { ...novoForm, ...baseLimpa };
        }

        if (novoForm.categoria === 'Cobre' && (name === 'peso' || name === 'bitola')) {
            const pesoInfo = parseFloat(novoForm.peso || 0);
            const fator = pesoPorMetroCobre[novoForm.bitola || '1/4'] || 0;
            novoForm.comprimento = (pesoInfo > 0 && fator > 0) ? (pesoInfo / fator).toFixed(2) : '';
        }
        setFormData(novoForm);
    };

    const alternarModoControle = (modo) => {
        if (modo === 'unidade') setFormData({ ...formData, nivel_pacote: '', quantidade: 1, estoque_minimo: 5 });
        else setFormData({ ...formData, nivel_pacote: 'Cheio', quantidade: 0, estoque_minimo: 0 });
    };

    const salvarMaterial = (e) => {
        e.preventDefault();
        if (!isAdmin) return;
        const req = formData.id ? api.put(`/epis/${formData.id}`, formData) : api.post('/epis', formData);
        req.then(() => { setShowForm(false); carregarMateriais(); }).catch(() => alert('Erro ao salvar.'));
    };

    const materiaisFiltrados = materiais.filter(m => {
        const matchBusca = m.nome.toLowerCase().includes(busca.toLowerCase()) || (m.codigo_identificacao && m.codigo_identificacao.toLowerCase().includes(busca.toLowerCase())) || m.categoria.toLowerCase().includes(busca.toLowerCase());
        const matchCategoria = categoriaFiltro === '' || m.categoria === categoriaFiltro;
        return matchBusca && matchCategoria;
    });

    const itensEmAlerta = materiais.filter(m => {
        if (m.categoria === 'Gás' || m.categoria === 'Cobre') return parseFloat(m.peso_minimo || 0) > 0 && parseFloat(m.peso || 0) <= parseFloat(m.peso_minimo || 0);
        else if (m.nivel_pacote) return m.nivel_pacote === 'Abaixo da Metade' || m.nivel_pacote === 'Vazio';
        else return parseFloat(m.estoque_minimo || 0) > 0 && parseFloat(m.quantidade || 0) <= parseFloat(m.estoque_minimo || 0);
    });

    const casEmAlerta = materiais.filter(m => {
        if (m.categoria !== 'EPI' || !m.validade_ca) return false;
        const dias = calcularDiasVencimento(m.validade_ca);
        return dias !== null && dias <= 30;
    });

    const getStockPct = (m) => {
        if (m.nivel_pacote) {
            const niveis = { 'Cheio': 100, 'Acima da Metade': 80, 'Na Metade': 60, 'Abaixo da Metade': 30, 'Vazio': 0 };
            return niveis[m.nivel_pacote] ?? 0;
        }
        if (m.categoria === 'Gás' || m.categoria === 'Cobre') {
            const min = parseFloat(m.peso_minimo || 0); const atual = parseFloat(m.peso || 0);
            return min === 0 ? 100 : Math.min(100, Math.round((atual / (min * 3)) * 100));
        }
        const min = parseFloat(m.estoque_minimo || 0); const atual = parseFloat(m.quantidade || 0);
        return min === 0 ? 100 : Math.min(100, Math.round((atual / (min * 2)) * 100));
    };

    const getStockColor = (m) => {
        const pct = getStockPct(m);
        if (pct <= 30) return '#ef4444'; 
        if (pct <= 60) return '#f59e0b'; 
        return '#10b981'; 
    };

    return (
        <div>
            {/* ── BARRA COMPACTA DE ALERTAS DO SISTEMA ── */}
            {(itensEmAlerta.length > 0 || casEmAlerta.length > 0 || trocasEmAlerta.length > 0) && (
                <div style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 700,
                            fontSize: '13.5px',
                            color: 'var(--text-primary)'
                        }}>
                            <i className="bi bi-bell-fill text-warning" style={{ fontSize: '16px' }}></i>
                            Central de Alertas:
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {itensEmAlerta.length > 0 && (
                                <button
                                    onClick={() => { setAbaAlerta('estoque'); setShowModalAlertas(true); }}
                                    style={{
                                        background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)',
                                        borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 700,
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                                    }}
                                >
                                    <i className="bi bi-box-seam"></i> {itensEmAlerta.length} estoque baixo
                                </button>
                            )}

                            {casEmAlerta.length > 0 && (
                                <button
                                    onClick={() => { setAbaAlerta('ca'); setShowModalAlertas(true); }}
                                    style={{
                                        background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)',
                                        borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 700,
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                                    }}
                                >
                                    <i className="bi bi-shield-exclamation"></i> {casEmAlerta.length} C.A. em risco
                                </button>
                            )}

                            {trocasEmAlerta.length > 0 && (
                                <button
                                    onClick={() => { setAbaAlerta('trocas'); setShowModalAlertas(true); }}
                                    style={{
                                        background: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.25)',
                                        borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 700,
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                                    }}
                                >
                                    <i className="bi bi-person-badge"></i> {trocasEmAlerta.length} trocas de EPI
                                </button>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            className="btn-ghost"
                            style={{ fontSize: '12.5px', padding: '6px 12px', fontWeight: 700, color: 'var(--primary-light)' }}
                            onClick={() => { setAbaAlerta('todos'); setShowModalAlertas(true); }}
                        >
                            <i className="bi bi-arrows-angle-expand me-1"></i> Abrir Pop-up
                        </button>
                    </div>
                </div>
            )}

            <div className="kpi-grid">
                <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}><i className="bi bi-box-seam-fill"></i></div><div className="kpi-value">{materiais.length}</div><div className="kpi-label">Itens Cadastrados</div></div>
                <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}><i className="bi bi-check2-circle"></i></div><div className="kpi-value">{materiais.length - itensEmAlerta.length}</div><div className="kpi-label">Em Nível Adequado</div></div>
                <div className="kpi-card" style={{ cursor: 'pointer' }} onClick={() => { setAbaAlerta('estoque'); setShowModalAlertas(true); }}><div className="kpi-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}><i className="bi bi-arrow-down-circle-fill"></i></div><div className="kpi-value text-danger">{itensEmAlerta.length}</div><div className="kpi-label">Abaixo do Mínimo</div></div>
                <div className="kpi-card" style={{ cursor: 'pointer' }} onClick={() => { setAbaAlerta('ca'); setShowModalAlertas(true); }}><div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}><i className="bi bi-shield-exclamation"></i></div><div className="kpi-value text-warning">{casEmAlerta.length}</div><div className="kpi-label">C.A. em Alerta</div></div>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <div className="panel-title"><i className="bi bi-archive-fill"></i> Inventário de Materiais</div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <select className="form-select-custom" style={{ width: 'auto', fontSize: 12.5 }} value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)}>
                            <option value="">Todas as categorias</option>
                            {Object.keys(categoriaBadge).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="search-box"><i className="bi bi-search"></i><input className="search-input" placeholder="Buscar item..." value={busca} onChange={e => setBusca(e.target.value)} /></div>
                        
                        {isAdmin && (
                            <button className="btn-primary-custom" onClick={abrirPainelNovo}><i className="bi bi-plus-lg"></i> Novo Item</button>
                        )}
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr><th>Código</th><th>Descrição / Estado</th><th>Categoria</th><th style={{ textAlign: 'center' }}>Nível de Estoque</th><th style={{ textAlign: 'right' }}>Ações</th></tr>
                        </thead>
                        <tbody>
                            {materiaisFiltrados.map(mat => {
                                const badge = categoriaBadge[mat.categoria] || categoriaBadge['Outros'];
                                const pct = getStockPct(mat);
                                const cor = getStockColor(mat);
                                const isLinear = mat.categoria === 'Cabo/Mangueira';
                                const isGasOuCobre = mat.categoria === 'Gás' || mat.categoria === 'Cobre';
                                const isPacote = !!mat.nivel_pacote;

                                let textoCA = null;
                                if (mat.categoria === 'EPI' && mat.numero_ca) {
                                    const diasCA = calcularDiasVencimento(mat.validade_ca);
                                    let dataFormatada = '';
                                    if (mat.validade_ca) {
                                        const dataLimpa = mat.validade_ca.split('T')[0];
                                        dataFormatada = new Date(dataLimpa + 'T12:00:00').toLocaleDateString('pt-BR');
                                    }
                                    if (diasCA === null) textoCA = <div className="text-muted mt-1"><i className="bi bi-shield-check"></i> C.A.: {mat.numero_ca} (Sem validade informada)</div>;
                                    else if (diasCA < 0) textoCA = <div className="text-danger fw-bold mt-1"><i className="bi bi-shield-x"></i> C.A.: {mat.numero_ca} (Vencido em {dataFormatada})</div>;
                                    else if (diasCA === 0) textoCA = <div className="text-danger fw-bold mt-1"><i className="bi bi-shield-exclamation"></i> C.A.: {mat.numero_ca} (Vence HOJE: {dataFormatada})</div>;
                                    else if (diasCA <= 30) textoCA = <div className="text-warning fw-bold mt-1"><i className="bi bi-shield-exclamation"></i> C.A.: {mat.numero_ca} (Vence em {dataFormatada} - Faltam {diasCA} dias)</div>;
                                    else textoCA = <div className="text-success mt-1"><i className="bi bi-shield-check"></i> C.A.: {mat.numero_ca} (Válido até {dataFormatada})</div>;
                                }

                                let textoCompressor = null;
                                if (mat.categoria === 'Compressor') {
                                    textoCompressor = (
                                        <div className="mt-1" style={{ fontSize: '11px', color: '#0284c7', fontWeight: 600 }}>
                                            <i className="bi bi-cpu-fill me-1"></i> 
                                            {mat.btu} BTUs | {mat.gas_refrigerante} | {mat.voltagem} | {mat.tecnologia}
                                        </div>
                                    );
                                }

                                return (
                                    <tr key={mat.id}>
                                        <td><span className="cell-mono">{mat.codigo_identificacao || '—'}</span></td>
                                        <td>
                                            <div className="cell-main">{mat.nome}</div>
                                            <div className="cell-sub" style={{ fontSize: '11.5px', marginTop: '2px' }}>
                                                Estado: <span className={coresEstado[mat.estado] || 'text-muted'}>{mat.estado || 'Não informado'}</span>
                                                {textoCA}
                                                {textoCompressor}
                                            </div>
                                        </td>
                                        <td><span className={`badge-pill ${badge.cls}`}><i className={`bi ${badge.icon}`} style={{ fontSize: 10 }}></i> {mat.categoria}</span></td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div className="stock-indicator" style={{ justifyContent: 'center' }}>
                                                <div className="stock-bar" style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                                                    <div className="stock-bar-fill" style={{ width: `${pct}%`, height: '100%', background: cor, borderRadius: '3px' }}></div>
                                                </div>
                                                <span className="stock-value fw-bold" style={{ color: cor, minWidth: '40px', textAlign: 'left' }}>
                                                    {isGasOuCobre ? `${mat.peso || 0}kg` : isLinear ? `${mat.quantidade} m` : isPacote ? mat.nivel_pacote : `${mat.quantidade} un`}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            {isAdmin ? (
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button className="btn-ghost" onClick={() => prepararEdicao(mat)}><i className="bi bi-pencil-square"></i></button>
                                                    <button className="btn-ghost" style={{ color: '#ef4444' }} onClick={() => excluirMaterial(mat.id, mat.nome)}><i className="bi bi-trash3-fill"></i></button>
                                                </div>
                                            ) : (
                                                <span className="badge bg-light text-muted" style={{ fontSize: '10px' }}>Somente Leitura</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── OFFCANVAS DE CADASTRO/EDIÇÃO ── */}
            <Offcanvas show={showForm} onHide={() => setShowForm(false)} placement="end" style={{ width: '450px' }}>
                <Offcanvas.Header closeButton style={{ background: '#f8fafc' }}>
                    <Offcanvas.Title className="fw-bold fs-5">{formData.id ? <><i className="bi bi-pencil-square text-warning me-2"></i>Editar Material</> : <><i className="bi bi-box-seam text-primary me-2"></i>Cadastrar Material</>}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-4">
                    <form onSubmit={salvarMaterial}>
                        <div className="mb-3"><label className="form-label-custom">Código (SKU) / Modelo / P.N.</label><input className="form-control-custom" type="text" name="codigo_identificacao" value={formData.codigo_identificacao} onChange={handleChange} placeholder="Ex: PH215X2C" /></div>
                        <div className="mb-3"><label className="form-label-custom">Descrição do Material <span className="text-danger">*</span></label><input className="form-control-custom" type="text" name="nome" required value={formData.nome} onChange={handleChange} /></div>
                        <div className="row mb-4">
                            <div className="col-6">
                                <label className="form-label-custom">Categoria</label>
                                <select className="form-select-custom" name="categoria" value={formData.categoria} onChange={handleChange}>
                                    <option value="EPI">Proteção (EPI)</option>
                                    <option value="Consumível">Consumível</option>
                                    <option value="Ferramenta">Ferramenta</option>
                                    <option value="Compressor">Compressor</option>
                                    <option value="Gás">Gás / Fluidos</option>
                                    <option value="Cobre">Cobre</option>
                                    <option value="Cabo/Mangueira">Cabo / Mangueira</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="form-label-custom">Estado Físico</label>
                                <select className="form-select-custom" name="estado" value={formData.estado} onChange={handleChange}><option value="Novo">Novo</option><option value="Bom Estado">Bom Estado</option><option value="Marcas de Uso">Marcas de Uso</option><option value="Com Defeito">Com Defeito</option><option value="Quebrado / Sucata">Quebrado / Sucata</option></select>
                            </div>
                        </div>

                        {formData.categoria === 'Compressor' && (
                            <div className="form-highlight" style={{ background: '#f0f9ff', borderColor: '#7dd3fc', marginBottom: '16px' }}>
                                <label className="form-label-custom text-primary" style={{color: '#0284c7'}}><i className="bi bi-cpu-fill me-1"></i> Especificações Técnicas</label>
                                <div className="row g-2 mt-1">
                                    <div className="col-6">
                                        <label className="form-label-custom" style={{fontSize: '10px'}}>Capacidade (BTUs)</label>
                                        <select className="form-select-custom" style={{fontSize: '13px'}} name="btu" value={formData.btu} onChange={handleChange}>
                                            <option value="9000">9.000 BTUs</option>
                                            <option value="12000">12.000 BTUs</option>
                                            <option value="18000">18.000 BTUs</option>
                                            <option value="24000">24.000 BTUs</option>
                                            <option value="30000">30.000 BTUs</option>
                                            <option value="36000">36.000 BTUs</option>
                                            <option value="60000">60.000 BTUs</option>
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label-custom" style={{fontSize: '10px'}}>Gás Refrigerante</label>
                                        <select className="form-select-custom" style={{fontSize: '13px'}} name="gas_refrigerante" value={formData.gas_refrigerante} onChange={handleChange}>
                                            <option value="R-410A">R-410A</option>
                                            <option value="R-22">R-22</option>
                                            <option value="R-32">R-32</option>
                                            <option value="R-134a">R-134a</option>
                                            <option value="R-404A">R-404A</option>
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label-custom" style={{fontSize: '10px'}}>Voltagem</label>
                                        <select className="form-select-custom" style={{fontSize: '13px'}} name="voltagem" value={formData.voltagem} onChange={handleChange}>
                                            <option value="220V Monofásico">220V Mono</option>
                                            <option value="220V Trifásico">220V Tri</option>
                                            <option value="380V Trifásico">380V Tri</option>
                                            <option value="110V">110V</option>
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label-custom" style={{fontSize: '10px'}}>Tecnologia</label>
                                        <select className="form-select-custom" style={{fontSize: '13px'}} name="tecnologia" value={formData.tecnologia} onChange={handleChange}>
                                            <option value="Inverter">Inverter</option>
                                            <option value="On/Off">On/Off (Convencional)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {formData.categoria === 'Gás' && (
                            <div className="form-highlight form-highlight-warning" style={{ background: '#fffbeb', borderColor: '#fcd34d' }}>
                                <label className="form-label-custom text-warning-emphasis"><i className="bi bi-speedometer2 me-1"></i> Controle de Fluido (KG)</label>
                                <div className="form-row">
                                    <div style={{ width: '50%' }}><label className="form-label-custom text-primary" style={{ fontSize: 9.5 }}>Peso Atual (kg)</label><input className="form-control-custom" type="number" step="0.01" name="peso" value={formData.peso} onChange={handleChange} /></div>
                                    <div style={{ width: '50%' }}><label className="form-label-custom text-danger" style={{ fontSize: 9.5 }}>Alerta: Peso Mín. (kg)</label><input className="form-control-custom" type="number" step="0.01" name="peso_minimo" value={formData.peso_minimo} onChange={handleChange} /></div>
                                </div>
                            </div>
                        )}

                        {formData.categoria === 'Cobre' && (
                            <div className="form-highlight form-highlight-warning" style={{ background: '#fffbeb', borderColor: '#fcd34d' }}>
                                <label className="form-label-custom text-warning-emphasis"><i className="bi bi-calculator me-1"></i> Calculadora por Balança</label>
                                <div className="form-row mb-2">
                                    <div style={{ width: '50%' }}><label className="form-label-custom" style={{ fontSize: 9.5 }}>Bitola</label><select className="form-select-custom" name="bitola" value={formData.bitola} onChange={handleChange}><option value="1/4">1/4"</option><option value="3/8">3/8"</option><option value="1/2">1/2"</option><option value="5/8">5/8"</option><option value="3/4">3/4"</option></select></div>
                                    <div style={{ width: '50%' }}><label className="form-label-custom text-primary" style={{ fontSize: 9.5 }}>Peso na Balança (kg)</label><input className="form-control-custom" type="number" step="0.01" name="peso" value={formData.peso} onChange={handleChange} /></div>
                                </div>
                                <div className="form-row">
                                    <div style={{ width: '50%' }}><label className="form-label-custom" style={{ fontSize: 9.5 }}>Metros (Calculado)</label><input className="form-control-custom bg-light" type="text" readOnly value={formData.comprimento} /></div>
                                    <div style={{ width: '50%' }}><label className="form-label-custom text-danger" style={{ fontSize: 9.5 }}>Alerta Mín. (kg)</label><input className="form-control-custom" type="number" step="0.01" name="peso_minimo" value={formData.peso_minimo} onChange={handleChange} /></div>
                                </div>
                            </div>
                        )}

                        {formData.categoria !== 'Gás' && formData.categoria !== 'Cobre' && (
                            <div style={{ marginBottom: '16px' }}>
                                {formData.categoria !== 'Cabo/Mangueira' && formData.categoria !== 'Compressor' && (
                                    <div className="mb-3 d-flex gap-2">
                                        <button type="button" className={`btn ${!formData.nivel_pacote ? 'btn-primary' : 'btn-outline-primary'} flex-grow-1`} style={{ fontSize: 13, fontWeight: 600 }} onClick={() => alternarModoControle('unidade')}><i className="bi bi-123 me-2"></i>Por Unidade</button>
                                        <button type="button" className={`btn ${formData.nivel_pacote ? 'btn-primary' : 'btn-outline-primary'} flex-grow-1`} style={{ fontSize: 13, fontWeight: 600 }} onClick={() => alternarModoControle('pacote')}><i className="bi bi-box-seam me-2"></i>Por Pacote</button>
                                    </div>
                                )}

                                {!formData.nivel_pacote ? (
                                    <div className="form-row">
                                        <div className="form-highlight form-highlight-warning" style={{ marginBottom: 0, width: '50%' }}>
                                            <label className="form-label-custom">{formData.categoria === 'Cabo/Mangueira' ? 'Alerta Mín. (m)' : 'Estoque Mínimo'}</label>
                                            <input className="form-control-custom" type="number" step={formData.categoria === 'Cabo/Mangueira' ? "0.01" : "1"} name="estoque_minimo" min="0" value={formData.estoque_minimo} onChange={handleChange} />
                                        </div>
                                        <div className="form-highlight" style={{ marginBottom: 0, width: '50%', borderColor: 'rgba(99,102,241,0.25)', background: 'rgba(99,102,241,0.04)' }}>
                                            <label className="form-label-custom" style={{ color: 'var(--primary-light)' }}>{formData.categoria === 'Cabo/Mangueira' ? 'Comprimento Total (m)' : 'Qtd Atual (Unidades)'}</label>
                                            <input className="form-control-custom" type="number" step={formData.categoria === 'Cabo/Mangueira' ? "0.01" : "1"} name="quantidade" required min="0" value={formData.quantidade} onChange={handleChange} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="form-highlight" style={{ borderColor: 'rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.05)' }}>
                                        <label className="form-label-custom text-primary"><i className="bi bi-box-seam-fill me-1"></i>Nível Atual da Caixa/Pacote</label>
                                        <select className="form-select-custom fw-bold text-dark" name="nivel_pacote" value={formData.nivel_pacote} onChange={handleChange}><option value="Cheio">Cheio (100%)</option><option value="Acima da Metade">Acima da Metade (~75%)</option><option value="Na Metade">Na Metade (50%)</option><option value="Abaixo da Metade">Abaixo da Metade (Alerta)</option><option value="Vazio">Vazio (Alerta)</option></select>
                                    </div>
                                )}
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
                            <button type="submit" className="btn-primary-custom" style={{ justifyContent: 'center', padding: '11px', fontSize: 14, borderRadius: 10 }}>{formData.id ? 'Salvar Alterações' : 'Confirmar Cadastro'}</button>
                            <button type="button" className="btn-ghost" style={{ justifyContent: 'center', padding: '11px', fontSize: 14, borderRadius: 10 }} onClick={() => setShowForm(false)}>Cancelar</button>
                        </div>
                    </form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* ── POP-UP CENTRAL DE ALERTAS DETALHADOS ── */}
            <Modal
                show={showModalAlertas}
                onHide={() => setShowModalAlertas(false)}
                centered
                size="lg"
                contentClassName="bg-dark border-0"
            >
                <Modal.Header
                    closeButton
                    closeVariant="white"
                    style={{ background: 'var(--surface-3)', borderBottom: '1px solid var(--border)', borderRadius: '16px 16px 0 0', padding: '16px 22px' }}
                >
                    <Modal.Title style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.12)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
                            <i className="bi bi-bell-fill"></i>
                        </div>
                        Central de Alertas e Pendências
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ background: 'var(--surface-2)', padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
                        <button className={`btn btn-sm ${abaAlerta === 'todos' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setAbaAlerta('todos')} style={{ borderRadius: '8px', fontWeight: 700 }}>
                            Todos ({itensEmAlerta.length + casEmAlerta.length + trocasEmAlerta.length})
                        </button>
                        <button className={`btn btn-sm ${abaAlerta === 'estoque' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setAbaAlerta('estoque')} style={{ borderRadius: '8px', fontWeight: 700 }}>
                            Estoque Mínimo ({itensEmAlerta.length})
                        </button>
                        <button className={`btn btn-sm ${abaAlerta === 'ca' ? 'btn-warning text-dark' : 'btn-outline-warning'}`} onClick={() => setAbaAlerta('ca')} style={{ borderRadius: '8px', fontWeight: 700 }}>
                            Validade C.A. ({casEmAlerta.length})
                        </button>
                        <button className={`btn btn-sm ${abaAlerta === 'trocas' ? 'btn-info text-white' : 'btn-outline-info'}`} onClick={() => setAbaAlerta('trocas')} style={{ borderRadius: '8px', fontWeight: 700 }}>
                            Trocas de EPI ({trocasEmAlerta.length})
                        </button>
                    </div>

                    {/* 1. SEÇÃO DE ESTOQUE MÍNIMO (COM ACORDEÃO POR CATEGORIA) */}
                    {(abaAlerta === 'todos' || abaAlerta === 'estoque') && itensEmAlerta.length > 0 && (
                        <div className="mb-4">
                            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#ef4444', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="bi bi-box-seam-fill"></i> Reposição de Estoque Necessária
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {(() => {
                                    // Agrupa os itens pela Categoria
                                    const estoqueAgrupado = itensEmAlerta.reduce((acc, m) => {
                                        if (!acc[m.categoria]) acc[m.categoria] = [];
                                        acc[m.categoria].push(m);
                                        return acc;
                                    }, {});

                                    return Object.keys(estoqueAgrupado).map(categoria => {
                                        const itens = estoqueAgrupado[categoria];
                                        const isExpandido = categoriaExpandida === categoria;

                                        return (
                                            <div key={categoria} style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderLeft: '4px solid #ef4444', borderRadius: '8px', overflow: 'hidden' }}>
                                                {/* Cabeçalho Clicável da Categoria */}
                                                <div
                                                    onClick={() => setCategoriaExpandida(isExpandido ? null : categoria)}
                                                    style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isExpandido ? 'rgba(239,68,68,0.05)' : 'transparent' }}
                                                >
                                                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <i className={`bi ${isExpandido ? 'bi-chevron-down' : 'bi-chevron-right'}`} style={{ color: '#ef4444', fontSize: 12 }}></i>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            {categoriaBadge[categoria] ? <i className={`bi ${categoriaBadge[categoria].icon}`}></i> : <i className="bi bi-tag-fill"></i>} 
                                                            {categoria}
                                                        </span>
                                                    </div>
                                                    <span style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', padding: '2px 8px', borderRadius: '20px', fontWeight: 700, fontSize: '11px' }}>
                                                        {itens.length} item(ns)
                                                    </span>
                                                </div>

                                                {/* Lista Interna dos Materiais da Categoria */}
                                                {isExpandido && (
                                                    <div style={{ padding: '8px 14px 12px 34px', borderTop: '1px solid var(--border)' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                            {itens.map(m => (
                                                                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border)', paddingBottom: '6px', paddingTop: '4px' }}>
                                                                    <div>
                                                                        <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 700 }}>
                                                                            <i className="bi bi-arrow-return-right me-1" style={{ opacity: 0.5 }}></i> {m.nome}
                                                                        </div>
                                                                        {m.codigo_identificacao && <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: 16 }}>SKU / PN: {m.codigo_identificacao}</div>}
                                                                    </div>
                                                                    <div style={{ textAlign: 'right' }}>
                                                                        <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 800 }}>Atual: {m.categoria === 'Gás' || m.categoria === 'Cobre' ? `${m.peso}kg` : m.nivel_pacote ? m.nivel_pacote : `${m.quantidade} un`}</div>
                                                                        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Mínimo: {m.categoria === 'Gás' || m.categoria === 'Cobre' ? `${m.peso_minimo}kg` : m.nivel_pacote ? 'Metade' : `${m.estoque_minimo} un`}</div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    )}

                    {/* 2. SEÇÃO DE VALIDADE DE C.A. */}
                    {(abaAlerta === 'todos' || abaAlerta === 'ca') && casEmAlerta.length > 0 && (
                        <div className="mb-4">
                            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#f59e0b', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="bi bi-shield-exclamation"></i> Certificados de Aprovação (C.A.) em Risco
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {casEmAlerta.map(m => {
                                    const dias = calcularDiasVencimento(m.validade_ca);
                                    const isVencido = dias < 0;
                                    const isHoje = dias === 0;
                                    const corTag = isVencido || isHoje ? '#ef4444' : '#f59e0b';
                                    const bgTag = isVencido || isHoje ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)';
                                    const dataFmt = new Date(m.validade_ca.split('T')[0] + 'T12:00:00').toLocaleDateString('pt-BR');

                                    return (
                                        <div key={m.id} style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderLeft: `4px solid ${corTag}`, borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-primary)' }}>{m.nome}</div>
                                                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Número do C.A.: {m.numero_ca || 'Não cadastrado'}</div>
                                            </div>
                                            <span style={{ background: bgTag, color: corTag, border: `1px solid ${corTag}40`, padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '11px' }}>
                                                {isVencido ? `VENCIDO HÁ ${Math.abs(dias)} DIAS (${dataFmt})` : isHoje ? 'VENCE HOJE' : `VENCE EM ${dias} DIAS (${dataFmt})`}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 3. SEÇÃO DE TROCAS DE EPI (COM ACORDEÃO POR NOME) */}
                    {(abaAlerta === 'todos' || abaAlerta === 'trocas') && trocasEmAlerta.length > 0 && (
                        <div className="mb-2">
                            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#3b82f6', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="bi bi-person-badge-fill"></i> Substituição de EPIs por Colaborador
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {(() => {
                                    // Agrupa os itens pelo nome do colaborador
                                    const trocasAgrupadas = trocasEmAlerta.reduce((acc, t) => {
                                        if (!acc[t.colaborador_nome]) acc[t.colaborador_nome] = [];
                                        acc[t.colaborador_nome].push(t);
                                        return acc;
                                    }, {});

                                    return Object.keys(trocasAgrupadas).map(nome => {
                                        const epis = trocasAgrupadas[nome];
                                        const isExpandido = colaboradorExpandido === nome;
                                        const temAtrasado = epis.some(e => calcularDiasVencimento(e.proxima_troca) <= 0);

                                        return (
                                            <div key={nome} style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderLeft: `4px solid ${temAtrasado ? '#ef4444' : '#3b82f6'}`, borderRadius: '8px', overflow: 'hidden' }}>
                                                {/* Cabeçalho Clicável */}
                                                <div
                                                    onClick={() => setColaboradorExpandido(isExpandido ? null : nome)}
                                                    style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isExpandido ? 'rgba(59,130,246,0.05)' : 'transparent' }}
                                                >
                                                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <i className={`bi ${isExpandido ? 'bi-chevron-down' : 'bi-chevron-right'}`} style={{ color: '#3b82f6', fontSize: 12 }}></i>
                                                        {nome}
                                                    </div>
                                                    <span style={{ background: temAtrasado ? 'rgba(239,68,68,0.12)' : 'rgba(59,130,246,0.12)', color: temAtrasado ? '#ef4444' : '#3b82f6', padding: '2px 8px', borderRadius: '20px', fontWeight: 700, fontSize: '11px' }}>
                                                        {epis.length} item(ns)
                                                    </span>
                                                </div>

                                                {/* Lista Interna (EPIs Específicos) */}
                                                {isExpandido && (
                                                    <div style={{ padding: '8px 14px 12px 34px', borderTop: '1px solid var(--border)' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                            {epis.map(t => {
                                                                const dias = calcularDiasVencimento(t.proxima_troca);
                                                                const isVencido = dias < 0;
                                                                const isHoje = dias === 0;
                                                                const corTag = isVencido || isHoje ? '#ef4444' : '#3b82f6';
                                                                const dataFmt = new Date(t.proxima_troca.split('T')[0] + 'T12:00:00').toLocaleDateString('pt-BR');

                                                                return (
                                                                    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border)', paddingBottom: '6px', paddingTop: '4px' }}>
                                                                        <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
                                                                            <i className="bi bi-arrow-return-right me-1" style={{ opacity: 0.5 }}></i> {t.epi_nome || t.nome_manual}
                                                                        </div>
                                                                        <span style={{ color: corTag, fontWeight: 700, fontSize: '11px' }}>
                                                                            {isVencido ? `ATRASADO (${dataFmt})` : isHoje ? 'HOJE' : `EM ${dias} DIAS (${dataFmt})`}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    )}

                    {((abaAlerta === 'estoque' && itensEmAlerta.length === 0) ||
                      (abaAlerta === 'ca' && casEmAlerta.length === 0) ||
                      (abaAlerta === 'trocas' && trocasEmAlerta.length === 0) ||
                      (abaAlerta === 'todos' && itensEmAlerta.length === 0 && casEmAlerta.length === 0 && trocasEmAlerta.length === 0)) && (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                            <i className="bi bi-check-circle-fill text-success d-block mb-2" style={{ fontSize: '32px' }}></i>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Nenhum alerta pendente nesta categoria!</div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}