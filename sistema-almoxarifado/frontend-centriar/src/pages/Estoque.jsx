import React, { useState, useEffect } from 'react';
import { Offcanvas } from 'react-bootstrap';
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

    // 💡 Adicionado: Trava de Perfil
    const isAdmin = user?.perfil === 'ADMIN';

    const carregarMateriais = () => { api.get('/epis').then(r => setMateriais(r.data)).catch(console.error); };
    useEffect(() => { carregarMateriais(); }, []);

    const abrirPainelNovo = () => { 
        if (!isAdmin) return; // Segurança
        setFormData(estadoInicialForm); 
        setShowForm(true); 
    };

    const prepararEdicao = (m) => {
        if (!isAdmin) return; // Segurança
        setFormData({ 
            ...m, validade_ca: m.validade_ca ? m.validade_ca.split('T')[0] : '', 
            bitola: m.bitola || '1/4', estado: m.estado || 'Novo', nivel_pacote: m.nivel_pacote || '',
            btu: m.btu || '12000', gas_refrigerante: m.gas_refrigerante || 'R-410A', voltagem: m.voltagem || '220V Monofásico', tecnologia: m.tecnologia || 'Inverter'
        });
        setShowForm(true);
    };

    const excluirMaterial = async (id, nome) => {
        if (!isAdmin) return; // Segurança
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
        if (!isAdmin) return; // Segurança
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
            {itensEmAlerta.length > 0 && (
                <div className="alert-banner" style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '16px', borderRadius: '12px', display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ color: '#ef4444', fontSize: '24px' }}><i className="bi bi-exclamation-triangle-fill"></i></div>
                    <div><div style={{ fontWeight: 700, color: '#991b1b', marginBottom: '4px' }}>Reposição de Estoque Necessária</div><div style={{ color: '#b91c1c', fontSize: '14px' }}>{itensEmAlerta.length} {itensEmAlerta.length === 1 ? 'item atingiu' : 'itens atingiram'} o nível mínimo crítico.</div></div>
                </div>
            )}

            {casEmAlerta.length > 0 && (
                <div className="alert-banner" style={{ background: '#fffbeb', border: '1px solid #fcd34d', padding: '16px', borderRadius: '12px', display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ color: '#d97706', fontSize: '24px' }}><i className="bi bi-shield-exclamation"></i></div>
                    <div>
                        <div style={{ fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>Atenção: Validade de C.A.</div>
                        <div style={{ color: '#b45309', fontSize: '14px' }}>{casEmAlerta.length} {casEmAlerta.length === 1 ? 'EPI está' : 'EPIs estão'} com o Certificado de Aprovação vencido ou vencendo nos próximos 30 dias.</div>
                    </div>
                </div>
            )}

            <div className="kpi-grid">
                <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}><i className="bi bi-box-seam-fill"></i></div><div className="kpi-value">{materiais.length}</div><div className="kpi-label">Itens Cadastrados</div></div>
                <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399' }}><i className="bi bi-check2-circle"></i></div><div className="kpi-value">{materiais.length - itensEmAlerta.length}</div><div className="kpi-label">Em Nível Adequado</div></div>
                <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}><i className="bi bi-arrow-down-circle-fill"></i></div><div className="kpi-value text-danger">{itensEmAlerta.length}</div><div className="kpi-label">Abaixo do Mínimo</div></div>
                <div className="kpi-card"><div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}><i className="bi bi-shield-exclamation"></i></div><div className="kpi-value text-warning">{casEmAlerta.length}</div><div className="kpi-label">C.A. em Alerta</div></div>
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
                        
                        {/* 💡 Trava: Botão "Novo Item" só aparece para Admin */}
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
                                            {/* 💡 Trava: Botões de ação só aparecem para Admin */}
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
        </div>
    );
}