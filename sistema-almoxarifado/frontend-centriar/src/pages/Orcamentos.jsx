import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';

// Formatação de moeda BRL
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
};

export default function Orcamentos() {
  const [abaAtiva, setAbaAtiva] = useState('editor'); // 'editor', 'historico', 'precos', 'comparador'
  
  // Lista de orçamentos salvos no localStorage
  const [historicoOrcamentos, setHistoricoOrcamentos] = useState(() => {
    const saved = localStorage.getItem('@Centriar:orcamentos_historico');
    return saved ? JSON.parse(saved) : [];
  });

  // Estado do Orçamento em edição atual
  const [orcamentoId, setOrcamentoId] = useState(null);
  const [nomeOrcamento, setNomeOrcamento] = useState('');
  const [statusOrcamento, setStatusOrcamento] = useState('Pendente'); 
  const [itens, setItens] = useState([]);

  // Estado do formulário de inserção de itens
  const [form, setForm] = useState({
    produto: '', loja: '', valorUnitario: '', quantidade: 1,
    formaPagamento: 'Pix', parcelas: 1, linkProduto: '',
    statusItem: 'Aprovado', situacaoCompra: 'Aguardando Compra'
  });

  // Filtros Avançados - ABA 2
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroSituacao, setFiltroSituacao] = useState('');
  const [filtroLoja, setFiltroLoja] = useState('');

  // Filtros Avançados - ABA 3
  const [buscaMaterialPreco, setBuscaMaterialPreco] = useState('');
  const [filtroLojaPreco, setFiltroLojaPreco] = useState('');
  const [filtroSituacaoPreco, setFiltroSituacaoPreco] = useState('');

  // Estados do Gráfico de Evolução (Modal)
  const [modalGraficoProduto, setModalGraficoProduto] = useState('');
  const [showModalGrafico, setShowModalGrafico] = useState(false);
  const [lojasOcultasGrafico, setLojasOcultasGrafico] = useState([]);

  // 💡 ESTADOS DA ABA 4: COMPARADOR DE LOJAS / MERCADOS
  const [lojasComparativo, setLojasComparativo] = useState(['Loja / Mercado A', 'Loja / Mercado B']);
  const [novaLojaNome, setNovaLojaNome] = useState('');
  const [itensComparativo, setItensComparativo] = useState([]);
  const [formItemComp, setFormItemComp] = useState({ produto: '', quantidade: 1, precos: {} });

  useEffect(() => {
    localStorage.setItem('@Centriar:orcamentos_historico', JSON.stringify(historicoOrcamentos));
  }, [historicoOrcamentos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: value };
    if (name === 'formaPagamento' && (value === 'Pix' || value === 'Boleto à vista')) {
      newForm.parcelas = 1;
    }
    setForm(newForm);
  };

  const adicionarItem = (e) => {
    e.preventDefault();
    if (!form.produto || !form.loja || !form.valorUnitario) {
      alert('Preencha os campos obrigatórios: Produto, Loja e Valor.');
      return;
    }
    const valorConvertido = parseFloat(form.valorUnitario.toString().replace(',', '.'));
    if (isNaN(valorConvertido)) {
      alert('Digite um valor numérico válido.');
      return;
    }
    const novoItem = {
      id: Date.now(), ...form,
      valorUnitario: valorConvertido,
      quantidade: parseInt(form.quantidade), parcelas: parseInt(form.parcelas)
    };
    setItens([...itens, novoItem]);
    setForm({ ...form, produto: '', valorUnitario: '', quantidade: 1, linkProduto: '' });
  };

  const removerItem = (id) => setItens(itens.filter(item => item.id !== id));
  const alterarStatusItem = (id, novoStatus) => setItens(itens.map(item => item.id === id ? { ...item, statusItem: novoStatus } : item));
  const alterarSituacaoItem = (id, novaSituacao) => setItens(itens.map(item => item.id === id ? { ...item, situacaoCompra: novaSituacao } : item));
  const alterarQuantidadeItem = (id, novaQuantidade) => setItens(itens.map(item => item.id === id ? { ...item, quantidade: Math.max(1, novaQuantidade) } : item));

  const salvarOrcamento = () => {
    if (!nomeOrcamento.trim()) return alert('Por favor, informe um Nome/Identificação para este orçamento antes de salvar.');
    if (itens.length === 0) return alert('Adicione pelo menos um item ao orçamento.');

    const totalGeral = itens.reduce((acc, item) => acc + (item.valorUnitario * item.quantidade), 0);
    const totalAprovado = itens.filter(i => i.statusItem === 'Aprovado').reduce((acc, item) => acc + (item.valorUnitario * item.quantidade), 0);
    const totalMensalGeral = itens.filter(i => i.statusItem !== 'Reprovado').reduce((acc, item) => acc + ((item.valorUnitario * item.quantidade) / item.parcelas), 0);

    const orcamentoPayload = {
      id: orcamentoId || Date.now(), nome: nomeOrcamento, status: statusOrcamento,
      dataCriacao: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      itens, totalGeral, totalAprovado, totalMensalGeral
    };

    if (orcamentoId) {
      setHistoricoOrcamentos(historicoOrcamentos.map(o => o.id === orcamentoId ? orcamentoPayload : o));
      alert('Orçamento atualizado com sucesso!');
    } else {
      setHistoricoOrcamentos([orcamentoPayload, ...historicoOrcamentos]);
      alert('Orçamento salvo no histórico com sucesso!');
    }
    limparFormularioOrcamento();
  };

  const limparFormularioOrcamento = () => {
    setOrcamentoId(null); setNomeOrcamento(''); setStatusOrcamento('Pendente'); setItens([]);
    setForm({ produto: '', loja: '', valorUnitario: '', quantidade: 1, formaPagamento: 'Pix', parcelas: 1, linkProduto: '', statusItem: 'Aprovado', situacaoCompra: 'Aguardando Compra' });
  };

  const carregarOrcamentoParaEdicao = (orcamento) => {
    setOrcamentoId(orcamento.id); setNomeOrcamento(orcamento.nome); setStatusOrcamento(orcamento.status);
    const itensAtualizados = (orcamento.itens || []).map(i => ({ ...i, statusItem: i.statusItem || 'Aprovado', situacaoCompra: i.situacaoCompra || 'Aguardando Compra', quantidade: i.quantidade || 1 }));
    setItens(itensAtualizados);
    setAbaAtiva('editor');
  };

  const alterarStatusOrcamentoHistorico = (id, novoStatus) => setHistoricoOrcamentos(historicoOrcamentos.map(o => o.id === id ? { ...o, status: novoStatus } : o));
  const excluirOrcamentoHistorico = (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir o orçamento "${nome}"?`)) {
      setHistoricoOrcamentos(historicoOrcamentos.filter(o => o.id !== id));
      if (orcamentoId === id) limparFormularioOrcamento();
    }
  };

  const imprimirPagina = () => window.print();

  // 💡 FUNÇÕES DA ABA COMPARATIVO DE LOJAS
  const adicionarLojaComparativo = (e) => {
    e.preventDefault();
    if (!novaLojaNome.trim()) return;
    if (lojasComparativo.includes(novaLojaNome.trim())) {
      alert('Esta loja/mercado já está na lista de comparação.');
      return;
    }
    setLojasComparativo([...lojasComparativo, novaLojaNome.trim()]);
    setNovaLojaNome('');
  };

  const removerLojaComparativo = (nomeLoja) => {
    if (lojasComparativo.length <= 2) {
      alert('Mantenha pelo menos 2 lojas para realizar o comparativo.');
      return;
    }
    setLojasComparativo(lojasComparativo.filter(l => l !== nomeLoja));
  };

  const handlePrecoChangeComparativo = (nomeLoja, valor) => {
    setFormItemComp({
      ...formItemComp,
      precos: {
        ...formItemComp.precos,
        [nomeLoja]: valor
      }
    });
  };

  const adicionarItemComparativo = (e) => {
    e.preventDefault();
    if (!formItemComp.produto.trim()) {
      alert('Informe o nome do produto para comparar.');
      return;
    }

    const precosTratados = {};
    lojasComparativo.forEach(loja => {
      const valStr = (formItemComp.precos[loja] || '0').toString().replace(',', '.');
      precosTratados[loja] = parseFloat(valStr) || 0;
    });

    const novoItem = {
      id: Date.now(),
      produto: formItemComp.produto,
      quantidade: parseInt(formItemComp.quantidade) || 1,
      precos: precosTratados
    };

    setItensComparativo([...itensComparativo, novoItem]);
    setFormItemComp({ produto: '', quantidade: 1, precos: {} });
  };

  const removerItemComparativo = (id) => {
    setItensComparativo(itensComparativo.filter(i => i.id !== id));
  };

  // Cálculos do Comparador
  const totaisPorLojaComparativo = {};
  lojasComparativo.forEach(loja => {
    totaisPorLojaComparativo[loja] = itensComparativo.reduce((acc, item) => {
      const precoUnit = item.precos[loja] || 0;
      return acc + (precoUnit * item.quantidade);
    }, 0);
  });

  const totalOtimizadoComparativo = itensComparativo.reduce((acc, item) => {
    const precosValidos = lojasComparativo
      .map(loja => item.precos[loja])
      .filter(p => p > 0);
    const menorPreco = precosValidos.length > 0 ? Math.min(...precosValidos) : 0;
    return acc + (menorPreco * item.quantidade);
  }, 0);

  // Cálculos ABA 1
  const totalGeral = itens.reduce((acc, item) => acc + (item.valorUnitario * item.quantidade), 0);
  const totalAprovado = itens.filter(i => i.statusItem === 'Aprovado').reduce((acc, item) => acc + (item.valorUnitario * item.quantidade), 0);
  const totalMensalGeral = itens.filter(i => i.statusItem !== 'Reprovado').reduce((acc, item) => acc + ((item.valorUnitario * item.quantidade) / item.parcelas), 0);
  const orcamentoPorLoja = itens.reduce((acc, item) => {
    const loja = item.loja || 'Outros';
    const totalItem = item.valorUnitario * item.quantidade;
    if (!acc[loja]) acc[loja] = { itens: [], total: 0, totalAprovado: 0, valorParcelaMes: 0 };
    acc[loja].itens.push(item);
    acc[loja].total += totalItem;
    if (item.statusItem === 'Aprovado') acc[loja].totalAprovado += totalItem;
    if (item.statusItem !== 'Reprovado') acc[loja].valorParcelaMes += (totalItem / item.parcelas);
    return acc;
  }, {});

  const listaLojasUnicas = Array.from(new Set(historicoOrcamentos.flatMap(o => (o.itens || []).map(i => i.loja)).filter(Boolean)));

  // Cálculos ABA 2
  const historicoFiltrado = historicoOrcamentos.filter(o => {
    const matchTexto = o.nome.toLowerCase().includes(filtroTexto.toLowerCase()) || (o.itens || []).some(i => i.produto.toLowerCase().includes(filtroTexto.toLowerCase()) || i.loja.toLowerCase().includes(filtroTexto.toLowerCase()));
    const matchStatus = !filtroStatus || o.status === filtroStatus;
    const matchSituacao = !filtroSituacao || (o.itens || []).some(i => i.situacaoCompra === filtroSituacao);
    const matchLoja = !filtroLoja || (o.itens || []).some(i => i.loja === filtroLoja);
    return matchTexto && matchStatus && matchSituacao && matchLoja;
  });

  // Cálculos ABA 3
  const todosOsItensCotados = historicoOrcamentos.flatMap(o => 
    (o.itens || []).map(item => ({ ...item, nomeOrcamento: o.nome, dataOrcamento: o.dataCriacao, statusOrcamento: o.status }))
  );

  const itensFiltradosPreco = todosOsItensCotados.filter(i => {
    const matchProduto = i.produto.toLowerCase().includes(buscaMaterialPreco.toLowerCase());
    const matchLoja = !filtroLojaPreco || i.loja === filtroLojaPreco;
    const situacaoFinal = i.statusItem === 'Reprovado' ? 'Cancelado' : (i.situacaoCompra || 'Aguardando Compra');
    let matchSituacao = true;
    if (filtroSituacaoPreco === 'Cancelado') matchSituacao = situacaoFinal === 'Cancelado';
    else if (filtroSituacaoPreco) matchSituacao = situacaoFinal === filtroSituacaoPreco;
    return matchProduto && matchLoja && matchSituacao;
  });

  // Gráfico Dinâmico (Modal)
  const abrirModalGrafico = (nomeProduto) => {
    setModalGraficoProduto(nomeProduto);
    setLojasOcultasGrafico([]); 
    setShowModalGrafico(true);
  };

  const cotacoesGraficoCompleto = modalGraficoProduto 
    ? todosOsItensCotados.filter(i => i.produto.toLowerCase() === modalGraficoProduto.toLowerCase()).sort((a, b) => a.id - b.id) 
    : [];

  const lojasUnicasGrafico = Array.from(new Set(cotacoesGraficoCompleto.map(c => c.loja)));
  const cotacoesParaGrafico = cotacoesGraficoCompleto.filter(c => !lojasOcultasGrafico.includes(c.loja));

  const valoresGrafico = cotacoesParaGrafico.map(c => c.valorUnitario);
  const maxValorGrafico = valoresGrafico.length > 0 ? Math.max(...valoresGrafico) : 0;
  const minValorGrafico = valoresGrafico.length > 0 ? Math.min(...valoresGrafico) : 0;
  const diffValores = maxValorGrafico - minValorGrafico;

  const dataAtual = new Date().toLocaleDateString('pt-BR');

  return (
    <div className={`aba-${abaAtiva}`}>
      {/* ── ESTILOS EXCLUSIVOS PARA IMPRESSÃO / PDF ── */}
      <style>{`
        @media print {
          .sidebar, .topbar, .no-print, .nav-tabs-custom { display: none !important; }
          body, .app-container, .main-content, .page-content { background: #ffffff !important; margin: 0 !important; padding: 0 !important; width: 100% !important; display: block !important; }
          
          .aba-precos #documento-orcamento, .aba-precos #documento-comparador { display: none !important; }
          .aba-editor #documento-relatorio, .aba-editor #documento-comparador { display: none !important; }
          .aba-historico #documento-orcamento, .aba-historico #documento-relatorio, .aba-historico #documento-comparador { display: none !important; }
          .aba-comparador #documento-orcamento, .aba-comparador #documento-relatorio { display: none !important; }
          
          #documento-orcamento, #documento-relatorio, #documento-comparador { background: #ffffff !important; padding: 0 !important; }
          #documento-orcamento h2, #documento-orcamento h3, #documento-orcamento div, #documento-orcamento td, #documento-orcamento th, #documento-orcamento span, #documento-orcamento strong { color: #0f172a !important; }
          .print-link { color: #2563eb !important; text-decoration: underline !important; font-weight: 600 !important; }
          .print-text-green, .print-text-green * { color: #047857 !important; }
          .print-bg-green { background: #dcfce7 !important; border: 2px solid #10b981 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-bg-gray { background: #f8fafc !important; border: 2px solid #cbd5e1 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-card-loja { border: 1px solid #cbd5e1 !important; border-top: 4px solid #3b82f6 !important; background: #ffffff !important; margin-bottom: 24px !important; page-break-inside: avoid !important; }
          .print-loja-header { background: #f1f5f9 !important; border-bottom: 1px solid #cbd5e1 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-table th { border-bottom: 2px solid #cbd5e1 !important; text-align: left; padding: 10px 8px; font-size: 12px; color: #64748b !important; text-transform: uppercase; }
          .print-table td { border-bottom: 1px solid #e2e8f0 !important; padding: 12px 8px; font-size: 13px; }
        }
      `}</style>

      {/* ── NAVEGAÇÃO ENTRE ABAS DA PÁGINA ── */}
      <div className="nav-tabs-custom no-print mb-4" style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button className={`btn btn-sm ${abaAtiva === 'editor' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setAbaAtiva('editor')} style={{ borderRadius: '8px', fontWeight: 700 }}>
          <i className="bi bi-pencil-square me-2"></i> Formular / Editar Orçamento
        </button>
        <button className={`btn btn-sm ${abaAtiva === 'historico' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setAbaAtiva('historico')} style={{ borderRadius: '8px', fontWeight: 700 }}>
          <i className="bi bi-journal-bookmark-fill me-2"></i> Orçamentos Salvos ({historicoOrcamentos.length})
        </button>
        <button className={`btn btn-sm ${abaAtiva === 'comparador' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setAbaAtiva('comparador')} style={{ borderRadius: '8px', fontWeight: 700 }}>
          <i className="bi bi-arrow-left-right me-2"></i> Comparador de Lojas / Mercados
        </button>
        <button className={`btn btn-sm ${abaAtiva === 'precos' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setAbaAtiva('precos')} style={{ borderRadius: '8px', fontWeight: 700 }}>
          <i className="bi bi-truck me-2"></i> Relatórios de Entrega & Preços
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: EDITOR                                                             */}
      {/* ========================================================================= */}
      {abaAtiva === 'editor' && (
        <>
          <div className="panel mb-4 no-print">
            <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="panel-title" style={{ color: 'var(--primary-light)' }}><i className="bi bi-cart-plus-fill me-2"></i> {orcamentoId ? `Editando Orçamento #${orcamentoId}` : 'Montador de Orçamentos e Cotações'}</div>
              {orcamentoId && <button className="btn btn-sm btn-outline-warning" onClick={limparFormularioOrcamento}><i className="bi bi-plus-circle me-1"></i> Criar Novo Em Branco</button>}
            </div>
            <div style={{ padding: '20px' }}>
              <div className="row g-3 mb-4 p-3" style={{ background: 'var(--surface-2)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div className="col-md-6">
                  <label className="form-label-custom">Nome do Orçamento / Identificação da Obra <span className="text-danger">*</span></label>
                  <input className="form-control-custom" type="text" value={nomeOrcamento} onChange={e => setNomeOrcamento(e.target.value)} placeholder="Ex: Obra Residencial - Cliente Silva" />
                </div>
                <div className="col-md-3">
                  <label className="form-label-custom">Status Geral da Cotação</label>
                  <select className="form-select-custom fw-bold" value={statusOrcamento} onChange={e => setStatusOrcamento(e.target.value)} style={{ color: statusOrcamento === 'Aprovado' ? '#10b981' : statusOrcamento === 'Reprovado' ? '#ef4444' : '#f59e0b' }}>
                    <option value="Pendente">🟡 Pendente / Em Análise</option>
                    <option value="Aprovado">🟢 Aprovado para Compra</option>
                    <option value="Reprovado">🔴 Reprovado / Recusado</option>
                  </select>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button className="btn-primary-custom w-100" onClick={salvarOrcamento} style={{ justifyContent: 'center', padding: '10px' }}><i className="bi bi-save me-2"></i> {orcamentoId ? 'Atualizar Orçamento' : 'Salvar no Histórico'}</button>
                </div>
              </div>

              <form onSubmit={adicionarItem}>
                <div className="row g-3 align-items-end">
                  <div className="col-md-2"><label className="form-label-custom">Loja / Fornecedor <span className="text-danger">*</span></label><input className="form-control-custom" type="text" name="loja" value={form.loja} onChange={handleChange} required /></div>
                  <div className="col-md-3"><label className="form-label-custom">Produto / Material <span className="text-danger">*</span></label><input className="form-control-custom" type="text" name="produto" value={form.produto} onChange={handleChange} required /></div>
                  <div className="col-md-2"><label className="form-label-custom">Valor Unit. (R$) <span className="text-danger">*</span></label><input className="form-control-custom" type="text" name="valorUnitario" value={form.valorUnitario} onChange={handleChange} required /></div>
                  <div className="col-md-1"><label className="form-label-custom">Qtd.</label><input className="form-control-custom" type="number" min="1" name="quantidade" value={form.quantidade} onChange={handleChange} required /></div>
                  <div className="col-md-2"><label className="form-label-custom">Pagamento</label><select className="form-select-custom" name="formaPagamento" value={form.formaPagamento} onChange={handleChange}><option value="Pix">Pix / À Vista</option><option value="Cartão de Crédito">Cartão de Crédito</option><option value="Boleto Parcelado">Boleto Parcelado</option><option value="Faturado">Faturado (Empresa)</option></select></div>
                  <div className="col-md-1"><label className="form-label-custom">Parcelas</label><select className="form-select-custom" name="parcelas" value={form.parcelas} onChange={handleChange} disabled={form.formaPagamento === 'Pix' || form.formaPagamento === 'Boleto à vista'}>{[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}x</option>)}</select></div>
                  <div className="col-md-11"><label className="form-label-custom"><i className="bi bi-link-45deg me-1"></i> Link da Loja / Anúncio do Produto (Opcional)</label><input className="form-control-custom" type="url" name="linkProduto" value={form.linkProduto} onChange={handleChange} placeholder="https://www.loja.com.br/produto-xyz" /></div>
                  <div className="col-md-1"><button type="submit" className="btn-primary-custom w-100" style={{ justifyContent: 'center', padding: '10px' }} title="Adicionar Item"><i className="bi bi-plus-lg"></i></button></div>
                </div>
              </form>
            </div>
          </div>

          {itens.length > 0 && (
            <div id="documento-orcamento" className="print-area" style={{ background: 'var(--bg)', borderRadius: '12px', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h2 style={{ margin: 0, fontWeight: 900, color: 'var(--text-primary)', fontSize: '22px' }}>{nomeOrcamento || 'Orçamento sem nome'}</h2>
                    <span className="badge" style={{ fontSize: '11px', background: statusOrcamento === 'Aprovado' ? 'rgba(16,185,129,0.15)' : statusOrcamento === 'Reprovado' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: statusOrcamento === 'Aprovado' ? '#10b981' : statusOrcamento === 'Reprovado' ? '#ef4444' : '#f59e0b', border: `1px solid ${statusOrcamento === 'Aprovado' ? '#10b98140' : statusOrcamento === 'Reprovado' ? '#ef444440' : '#f59e0b40'}` }}>{statusOrcamento.toUpperCase()}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>Itens cotados: {itens.length} | Aprovados: {itens.filter(i => i.statusItem === 'Aprovado').length}</div>
                </div>
                <div className="no-print" style={{ display: 'flex', gap: '8px' }}><button className="btn-primary-custom" onClick={imprimirPagina} style={{ background: '#10b981', borderColor: '#059669', padding: '8px 16px' }}><i className="bi bi-printer-fill me-2"></i> Imprimir / PDF</button></div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-4"><div className="print-bg-green" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><div className="print-text-green" style={{ fontSize: '11px', color: '#059669', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>Valor Total Aprovado</div><div className="print-text-green" style={{ fontSize: '32px', fontWeight: 900, color: '#10b981', lineHeight: '1.2' }}>{formatarMoeda(totalAprovado)}</div></div></div>
                <div className="col-md-4"><div className="print-bg-gray" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>Custo Bruto Cotado (100%)</div><div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: '1.2' }}>{formatarMoeda(totalGeral)}</div></div></div>
                <div className="col-md-4"><div className="print-bg-gray" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>Fatura Mensal Projetada</div><div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: '1.2' }}>{formatarMoeda(totalMensalGeral)} <span style={{ fontSize: '14px', fontWeight: 700 }}>/mês</span></div></div></div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {Object.keys(orcamentoPorLoja).map((loja, index) => {
                  const dados = orcamentoPorLoja[loja];
                  return (
                    <div key={index} className="print-card-loja" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderTop: '4px solid var(--primary-light)', borderRadius: '12px', overflow: 'hidden' }}>
                      <div className="print-loja-header" style={{ background: 'var(--surface-2)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div className="no-print" style={{ width: '40px', height: '40px', background: 'var(--surface-3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="bi bi-shop text-primary" style={{ fontSize: '20px' }}></i></div><div><h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)' }}>{loja}</h3><div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{dados.itens.length} produto(s)</div></div></div>
                        <div style={{ textAlign: 'right' }}><div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Subtotal Aprovado na Loja</div><div style={{ fontSize: '18px', fontWeight: 900, color: '#10b981' }}>{formatarMoeda(dados.totalAprovado)}</div><div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Total Cotado: {formatarMoeda(dados.total)}</div></div>
                      </div>
                      <div style={{ padding: '0 20px 10px' }}>
                        <table className="print-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                          <thead><tr><th style={{ textAlign: 'left', padding: '10px 8px', fontSize: '12px' }}>Aprovação</th><th style={{ textAlign: 'left', padding: '10px 8px', fontSize: '12px' }}>Produto</th><th style={{ textAlign: 'left', padding: '10px 8px', fontSize: '12px' }}>Status da Compra</th><th style={{ textAlign: 'center', padding: '10px 8px', fontSize: '12px' }}>Qtd x Valor</th><th style={{ textAlign: 'left', padding: '10px 8px', fontSize: '12px' }}>Pgto</th><th style={{ textAlign: 'right', padding: '10px 8px', fontSize: '12px' }}>Total</th><th className="no-print"></th></tr></thead>
                          <tbody>
                            {dados.itens.map(item => {
                              const isReprovado = item.statusItem === 'Reprovado';
                              return (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)', opacity: isReprovado ? 0.45 : 1 }}>
                                  <td style={{ padding: '12px 8px', minWidth: '130px' }}>
                                    <select className="form-select-custom btn-sm no-print" value={item.statusItem || 'Aprovado'} onChange={(e) => alterarStatusItem(item.id, e.target.value)} style={{ fontSize: '11px', fontWeight: 800, padding: '4px 8px', color: item.statusItem === 'Aprovado' ? '#10b981' : item.statusItem === 'Reprovado' ? '#ef4444' : '#f59e0b' }}><option value="Aprovado">🟢 Aprovado</option><option value="Reprovado">🔴 Reprovado</option><option value="Pendente">🟡 Pendente</option></select>
                                    <span className="d-none d-print-inline fw-bold" style={{ fontSize: '11px', color: item.statusItem === 'Aprovado' ? '#10b981' : item.statusItem === 'Reprovado' ? '#ef4444' : '#f59e0b' }}>{item.statusItem || 'Aprovado'}</span>
                                  </td>
                                  <td style={{ padding: '12px 8px', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', textDecoration: isReprovado ? 'line-through' : 'none' }}>
                                    <div>{item.produto}</div>
                                    {item.linkProduto && <a href={item.linkProduto} target="_blank" rel="noopener noreferrer" className="print-link no-print" style={{ fontSize: '11px', color: '#3b82f6', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><i className="bi bi-box-arrow-up-right"></i> Link da Loja</a>}
                                  </td>
                                  <td style={{ padding: '12px 8px', minWidth: '160px' }}>
                                    {isReprovado ? (
                                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#ef4444' }}>🚫 Cancelado</span>
                                    ) : (
                                      <>
                                        <select className="form-select-custom btn-sm no-print" value={item.situacaoCompra || 'Aguardando Compra'} onChange={(e) => alterarSituacaoItem(item.id, e.target.value)} style={{ fontSize: '11.5px', fontWeight: 600 }}><option value="Aguardando Compra">⏳ Aguardando Compra</option><option value="Comprado">💳 Comprado / Pedido</option><option value="A Caminho">🚚 A Caminho / Transporte</option><option value="Entregue">✅ Entregue / Almoxarifado</option></select>
                                        <span className="d-none d-print-inline fw-semibold" style={{ fontSize: '11px' }}>{item.situacaoCompra || 'Aguardando Compra'}</span>
                                      </>
                                    )}
                                  </td>
                                  <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    <div className="d-flex align-items-center justify-content-center gap-2 no-print"><input type="number" min="1" value={item.quantidade} onChange={(e) => alterarQuantidadeItem(item.id, parseInt(e.target.value) || 1)} className="form-control-custom" style={{ width: '50px', padding: '2px 4px', textAlign: 'center', fontSize: '12px', height: '26px' }} disabled={isReprovado}/><span>x {formatarMoeda(item.valorUnitario)}</span></div>
                                    <span className="d-none d-print-inline"><strong>{item.quantidade}x</strong> {formatarMoeda(item.valorUnitario)}</span>
                                  </td>
                                  <td style={{ padding: '12px 8px' }}><div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.formaPagamento} {item.parcelas > 1 && <span style={{ color: 'var(--warning)', marginLeft: '6px' }}>({item.parcelas}x)</span>}</div></td>
                                  <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '14px', fontWeight: 800, color: isReprovado ? 'var(--text-muted)' : 'var(--text-primary)' }}>{formatarMoeda(item.valorUnitario * item.quantidade)}</td>
                                  <td className="no-print" style={{ textAlign: 'center' }}><button onClick={() => removerItem(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }} title="Remover Item"><i className="bi bi-x-circle-fill" style={{ fontSize: '16px' }}></i></button></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: HISTÓRICO DE ORÇAMENTOS (MINI-DASHBOARD NO CARTÃO)                 */}
      {/* ========================================================================= */}
      {abaAtiva === 'historico' && (
        <div className="panel">
          <div className="panel-header" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            <div className="panel-title" style={{ color: 'var(--primary-light)' }}><i className="bi bi-journal-bookmark-fill me-2"></i> Histórico e Acompanhamento de Orçamentos</div>
          </div>
          <div style={{ padding: '20px' }}>
            <div className="p-3 mb-4" style={{ background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div className="row g-3">
                <div className="col-md-3"><label className="form-label-custom">Buscar Nome/Produto</label><div className="search-box" style={{ width: '100%' }}><i className="bi bi-search"></i><input className="search-input" placeholder="Buscar..." value={filtroTexto} onChange={e => setFiltroTexto(e.target.value)} /></div></div>
                <div className="col-md-3"><label className="form-label-custom">Status Geral</label><select className="form-select-custom" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}><option value="">-- Todos --</option><option value="Pendente">Pendente</option><option value="Aprovado">Aprovado</option><option value="Reprovado">Reprovado</option></select></div>
                <div className="col-md-3"><label className="form-label-custom">Situação (Entregas)</label><select className="form-select-custom" value={filtroSituacao} onChange={e => setFiltroSituacao(e.target.value)}><option value="">-- Qualquer --</option><option value="Aguardando Compra">Aguardando Compra</option><option value="Comprado">Comprado</option><option value="A Caminho">A Caminho</option><option value="Entregue">Entregue</option></select></div>
                <div className="col-md-3"><label className="form-label-custom">Fornecedor</label><select className="form-select-custom" value={filtroLoja} onChange={e => setFiltroLoja(e.target.value)}><option value="">-- Todas --</option>{listaLojasUnicas.map((l, i) => <option key={i} value={l}>{l}</option>)}</select></div>
              </div>
            </div>

            {historicoFiltrado.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <i className="bi bi-inbox" style={{ fontSize: '40px', color: 'var(--text-muted)' }}></i>
                <div style={{ color: 'var(--text-primary)', marginTop: '12px', fontWeight: 700 }}>Nenhum orçamento encontrado com esses filtros</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {historicoFiltrado.map(orc => {
                  const itensSeguros = orc.itens || [];
                  const qtdTotal = itensSeguros.length;
                  const qtdAprovados = itensSeguros.filter(i => (i.statusItem || 'Aprovado') === 'Aprovado').length;
                  const qtdReprovados = itensSeguros.filter(i => i.statusItem === 'Reprovado').length;
                  const qtdPendentes = itensSeguros.filter(i => i.statusItem === 'Pendente').length;

                  const valor100 = itensSeguros.reduce((acc, i) => acc + (i.valorUnitario * i.quantidade), 0);
                  const valorAprovado = itensSeguros.filter(i => (i.statusItem || 'Aprovado') === 'Aprovado').reduce((acc, i) => acc + (i.valorUnitario * i.quantidade), 0);

                  const situacaoCount = itensSeguros.reduce((acc, i) => {
                    if (i.statusItem === 'Reprovado') return acc;
                    const sit = i.situacaoCompra || 'Aguardando Compra';
                    acc[sit] = (acc[sit] || 0) + 1;
                    return acc;
                  }, {});

                  return (
                    <div key={orc.id} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{orc.nome}</h4>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}><i className="bi bi-calendar3 me-1"></i> Data de Criação: {orc.dataCriacao}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <select className="form-select-custom btn-sm" value={orc.status} onChange={(e) => alterarStatusOrcamentoHistorico(orc.id, e.target.value)} style={{ width: 'auto', fontSize: '12px', padding: '4px 10px', fontWeight: 700, color: orc.status === 'Aprovado' ? '#10b981' : orc.status === 'Reprovado' ? '#ef4444' : '#f59e0b' }}>
                            <option value="Pendente">🟡 Pendente Geral</option><option value="Aprovado">🟢 Aprovado Geral</option><option value="Reprovado">🔴 Reprovado Geral</option>
                          </select>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => carregarOrcamentoParaEdicao(orc)}><i className="bi bi-pencil-square me-1"></i> Abrir / Editar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => excluirOrcamentoHistorico(orc.id, orc.nome)}><i className="bi bi-trash3-fill"></i></button>
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-md-4">
                          <div style={{ background: 'var(--surface-3)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', height: '100%' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}><i className="bi bi-cash-coin me-1"></i> Financeiro</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Custo Bruto (100%):</span><span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{formatarMoeda(valor100)}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px dashed var(--border)' }}><span style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>Total Aprovado:</span><span style={{ fontSize: '16px', fontWeight: 900, color: '#10b981' }}>{formatarMoeda(valorAprovado)}</span></div>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div style={{ background: 'var(--surface-3)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', height: '100%' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}><i className="bi bi-box-seam me-1"></i> Itens Cotados ({qtdTotal})</div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {qtdAprovados > 0 && <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>{qtdAprovados} Aprovados</span>}
                              {qtdReprovados > 0 && <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>{qtdReprovados} Reprovados</span>}
                              {qtdPendentes > 0 && <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>{qtdPendentes} Pendentes</span>}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div style={{ background: 'var(--surface-3)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', height: '100%' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}><i className="bi bi-truck me-1"></i> Situação de Compra</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {Object.keys(situacaoCount).length === 0 ? <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sem itens aprovados ou pendentes.</span> : null}
                              {situacaoCount['Aguardando Compra'] > 0 && <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>⏳ {situacaoCount['Aguardando Compra']}x Aguardando</div>}
                              {situacaoCount['Comprado'] > 0 && <div style={{ fontSize: '12px', fontWeight: 600, color: '#3b82f6' }}>💳 {situacaoCount['Comprado']}x Comprado</div>}
                              {situacaoCount['A Caminho'] > 0 && <div style={{ fontSize: '12px', fontWeight: 600, color: '#8b5cf6' }}>🚚 {situacaoCount['A Caminho']}x A Caminho</div>}
                              {situacaoCount['Entregue'] > 0 && <div style={{ fontSize: '12px', fontWeight: 600, color: '#10b981' }}>✅ {situacaoCount['Entregue']}x Entregue</div>}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💡 ABA 4: COMPARADOR DE LOJAS / MERCADOS (NOVA ABA COMPLETA)              */}
      {/* ========================================================================= */}
      {abaAtiva === 'comparador' && (
        <div className="panel" id="documento-comparador">
          <div className="panel-header" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div className="panel-title" style={{ color: 'var(--primary-light)' }}>
              <i className="bi bi-arrow-left-right me-2"></i> Comparador de Cotações e Lojas Lado a Lado
            </div>
            <button className="btn-primary-custom no-print" onClick={imprimirPagina} style={{ background: '#10b981', borderColor: '#059669' }}>
              <i className="bi bi-printer-fill me-2"></i> Imprimir Comparativo
            </button>
          </div>

          <div style={{ padding: '20px' }}>
            
            {/* CONFIGURAÇÃO DAS LOJAS A COMPARAR */}
            <div className="p-3 mb-4 no-print" style={{ background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                1. Lojas / Fornecedores em Comparação
              </div>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '14px' }}>
                {lojasComparativo.map((loja, idx) => (
                  <span key={idx} className="badge bg-primary d-inline-flex alignItems-center gap-2" style={{ padding: '8px 12px', fontSize: '12px', borderRadius: '8px' }}>
                    <i className="bi bi-shop"></i> {loja}
                    <i className="bi bi-x-circle-fill ms-1" style={{ cursor: 'pointer', color: '#f87171' }} onClick={() => removerLojaComparativo(loja)} title="Remover Loja"></i>
                  </span>
                ))}
              </div>

              <form onSubmit={adicionarLojaComparativo} className="row g-2 align-items-center">
                <div className="col-md-4">
                  <input className="form-control-custom" type="text" placeholder="Nome do mercado/loja (Ex: Atacadão, Frigelar...)" value={novaLojaNome} onChange={e => setNovaLojaNome(e.target.value)} />
                </div>
                <div className="col-md-2">
                  <button type="submit" className="btn btn-sm btn-outline-primary w-100" style={{ padding: '8px', fontWeight: 700 }}>
                    <i className="bi bi-plus-circle me-1"></i> Adicionar Loja
                  </button>
                </div>
              </form>
            </div>

            {/* FORMULÁRIO PARA ADICIONAR ITEM À TABELA COMPARATIVA */}
            <div className="p-3 mb-4 no-print" style={{ background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                2. Adicionar Produto para Comparação de Valores
              </div>

              <form onSubmit={adicionarItemComparativo}>
                <div className="row g-3 align-items-end">
                  <div className="col-md-4">
                    <label className="form-label-custom">Produto / Item <span className="text-danger">*</span></label>
                    <input className="form-control-custom" type="text" placeholder="Ex: Detergente 500ml / Compressor 12k" value={formItemComp.produto} onChange={e => setFormItemComp({ ...formItemComp, produto: e.target.value })} required />
                  </div>
                  <div className="col-md-1">
                    <label className="form-label-custom">Qtd.</label>
                    <input className="form-control-custom" type="number" min="1" value={formItemComp.quantidade} onChange={e => setFormItemComp({ ...formItemComp, quantidade: parseInt(e.target.value) || 1 })} required />
                  </div>

                  {/* Campos dinâmicos de preço para cada loja cadastrada */}
                  {lojasComparativo.map((loja, i) => (
                    <div className="col-md-2" key={i}>
                      <label className="form-label-custom" style={{ color: 'var(--primary-light)', fontSize: '11px' }}>
                        Preço Un. ({loja})
                      </label>
                      <input className="form-control-custom" type="text" placeholder="0.00" value={formItemComp.precos[loja] || ''} onChange={e => handlePrecoChangeComparativo(loja, e.target.value)} />
                    </div>
                  ))}

                  <div className="col-md-2">
                    <button type="submit" className="btn-primary-custom w-100" style={{ justifyContent: 'center', padding: '10px' }}>
                      <i className="bi bi-plus-lg me-1"></i> Adicionar à Tabela
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* TABELA COMPARATIVA LADO A LADO */}
            {itensComparativo.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 0', border: '2px dashed var(--border)', borderRadius: '12px' }}>
                <i className="bi bi-arrow-left-right" style={{ fontSize: '40px', color: 'var(--text-muted)' }}></i>
                <div style={{ color: 'var(--text-primary)', marginTop: '12px', fontWeight: 700 }}>Sua matriz de comparação está vazia</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Cadastre os produtos e os preços em cada loja acima para visualizar a diferença.</div>
              </div>
            ) : (
              <div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table print-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th style={{ textAlign: 'center' }}>Qtd</th>
                        {lojasComparativo.map((loja, idx) => (
                          <th key={idx} style={{ textAlign: 'right' }}>Preço Un. ({loja})</th>
                        ))}
                        <th style={{ textAlign: 'right', color: '#10b981' }}>Menor Valor Unit.</th>
                        <th className="no-print" style={{ textAlign: 'center' }}>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itensComparativo.map(item => {
                        // Calcula qual o menor valor válido para o item
                        const precosValidos = lojasComparativo
                          .map(l => parseFloat(item.precos[l]) || 0)
                          .filter(p => p > 0);
                        
                        const menorPrecoItem = precosValidos.length > 0 ? Math.min(...precosValidos) : 0;

                        return (
                          <tr key={item.id}>
                            <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.produto}</td>
                            <td style={{ textAlign: 'center', fontWeight: 700 }}>{item.quantidade}x</td>
                            
                            {/* Preço em cada loja */}
                            {lojasComparativo.map((loja, idx) => {
                              const precoUnit = item.precos[loja] || 0;
                              const isMaisBarato = precoUnit > 0 && precoUnit === menorPrecoItem && precosValidos.length > 1;

                              return (
                                <td key={idx} style={{ 
                                  textAlign: 'right',
                                  background: isMaisBarato ? 'rgba(16,185,129,0.1)' : 'transparent',
                                  fontWeight: isMaisBarato ? 800 : 500,
                                  color: isMaisBarato ? '#10b981' : 'inherit'
                                }}>
                                  {precoUnit > 0 ? formatarMoeda(precoUnit) : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                                  {isMaisBarato && <span style={{ fontSize: '9px', display: 'block', color: '#10b981', fontWeight: 800 }}>★ MAIS BARATO</span>}
                                </td>
                              );
                            })}

                            {/* Coluna Menor Preço */}
                            <td style={{ textAlign: 'right', fontWeight: 900, color: '#10b981' }}>
                              {menorPrecoItem > 0 ? formatarMoeda(menorPrecoItem) : '-'}
                            </td>

                            <td className="no-print" style={{ textAlign: 'center' }}>
                              <button onClick={() => removerItemComparativo(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                <i className="bi bi-trash3-fill"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 💡 PAINEL DE RESUMO DA COMPRA COMPARAÇÃO */}
                <div className="row g-3 mt-4">
                  {/* Totais de Cada Loja */}
                  {lojasComparativo.map((loja, idx) => (
                    <div className="col-md-3" key={idx}>
                      <div className="print-bg-gray" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                          Total Comprando no {loja}
                        </div>
                        <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                          {formatarMoeda(totaisPorLojaComparativo[loja])}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Destaque do Carrinho Otimizado (Melhor Combinação) */}
                  <div className="col-md-3">
                    <div className="print-bg-green" style={{ background: 'rgba(16,185,129,0.12)', border: '2px solid #10b981', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                      <div className="print-text-green" style={{ fontSize: '11px', color: '#059669', textTransform: 'uppercase', fontWeight: 800 }}>
                        Compra Otimizada (Cesta Mista)
                      </div>
                      <div className="print-text-green" style={{ fontSize: '24px', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>
                        {formatarMoeda(totalOtimizadoComparativo)}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#047857', fontWeight: 700, marginTop: '2px' }}>
                        Comprando cada item no menor preço
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: RELATÓRIO DE ENTREGAS E PREÇOS                                     */}
      {/* ========================================================================= */}
      {abaAtiva === 'precos' && (
        <div className="panel">
          <div id="documento-relatorio" className="print-area">
            <div className="panel-header" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div className="panel-title" style={{ color: 'var(--primary-light)' }}>
                <i className="bi bi-truck me-2"></i> Relatório de Entregas e Histórico de Preços
              </div>
              <div className="no-print" style={{ display: 'flex', gap: 10 }}>
                <button className="btn-primary-custom" onClick={imprimirPagina} style={{ background: '#10b981', borderColor: '#059669' }}>
                  <i className="bi bi-printer-fill me-2"></i> Imprimir Relatório
                </button>
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              <div className="row g-3 mb-4 p-3 no-print" style={{ background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div className="col-md-4">
                  <label className="form-label-custom">Buscar por Produto</label>
                  <div className="search-box" style={{ width: '100%' }}>
                    <i className="bi bi-search"></i>
                    <input className="search-input" placeholder="Ex: Tubo de Cobre..." value={buscaMaterialPreco} onChange={e => setBuscaMaterialPreco(e.target.value)} />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label-custom">Fornecedor / Loja</label>
                  <select className="form-select-custom" value={filtroLojaPreco} onChange={e => setFiltroLojaPreco(e.target.value)}>
                    <option value="">-- Todas as Lojas --</option>
                    {listaLojasUnicas.map((l, i) => <option key={i} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label-custom">Situação da Entrega</label>
                  <select className="form-select-custom" value={filtroSituacaoPreco} onChange={e => setFiltroSituacaoPreco(e.target.value)}>
                    <option value="">-- Todas as Situações --</option>
                    <option value="Aguardando Compra">⏳ Aguardando Compra</option>
                    <option value="Comprado">💳 Comprado / Pedido</option>
                    <option value="A Caminho">🚚 A Caminho / Transporte</option>
                    <option value="Entregue">✅ Entregue no Almoxarifado</option>
                    <option value="Cancelado">🚫 Cancelado / Reprovado</option>
                  </select>
                </div>
              </div>

              {itensFiltradosPreco.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px 0' }}>
                  <i className="bi bi-tag" style={{ fontSize: '40px', color: 'var(--text-muted)' }}></i>
                  <div style={{ color: 'var(--text-primary)', marginTop: '12px', fontWeight: 700 }}>Nenhum material encontrado com os filtros atuais.</div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <h4 className="d-none d-print-block print-text-dark" style={{ marginBottom: 16 }}>Relatório de Preços e Situação de Entregas - {dataAtual}</h4>
                  <table className="data-table print-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Loja</th>
                        <th>Valor Un.</th>
                        <th>Situação da Compra</th>
                        <th>Origem (Data)</th>
                        <th className="no-print" style={{ textAlign: 'center' }}>Evolução de Preço</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itensFiltradosPreco.map((item, idx) => {
                        const isCancelado = item.statusItem === 'Reprovado';
                        const situacaoExibida = isCancelado ? '🚫 Cancelado' : (item.situacaoCompra || 'Aguardando Compra');

                        return (
                          <tr key={idx} style={{ opacity: isCancelado ? 0.5 : 1 }}>
                            <td style={{ fontWeight: 700, color: 'var(--text-primary)', textDecoration: isCancelado ? 'line-through' : 'none' }}>
                              {item.produto}
                            </td>
                            <td><span style={{ fontWeight: 600, color: 'var(--primary-light)' }}>{item.loja}</span></td>
                            <td style={{ fontWeight: 800, color: isCancelado ? 'var(--text-muted)' : '#10b981' }}>{formatarMoeda(item.valorUnitario)}</td>
                            <td>
                              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)', background: isCancelado ? 'rgba(239,68,68,0.1)' : 'var(--surface-3)', color: isCancelado ? '#ef4444' : 'inherit' }}>
                                {situacaoExibida}
                              </span>
                            </td>
                            <td style={{ fontSize: '11px' }}>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.nomeOrcamento}</div>
                              <div style={{ color: 'var(--text-muted)' }}>{item.dataOrcamento}</div>
                            </td>
                            <td className="no-print" style={{ textAlign: 'center' }}>
                              <button className="btn btn-sm btn-outline-primary" onClick={() => abrirModalGrafico(item.produto)}>
                                <i className="bi bi-graph-up me-1"></i> Ver Histórico
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DO GRÁFICO (SVG)                                                    */}
      {/* ========================================================================= */}
      <Modal show={showModalGrafico} onHide={() => setShowModalGrafico(false)} centered size="lg" contentClassName="bg-dark border-0">
        <Modal.Header closeButton closeVariant="white" style={{ background: 'var(--surface-3)', borderBottom: '1px solid var(--border)', borderRadius: '16px 16px 0 0' }}>
          <Modal.Title style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div><i className="bi bi-graph-up-arrow text-primary me-2"></i> Evolução de Preço: {modalGraficoProduto}</div>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={{ background: 'var(--surface-2)', padding: '24px', borderRadius: '0 0 16px 16px' }}>
          <div id="area-grafico-export" style={{ background: '#ffffff', padding: '20px', borderRadius: '12px' }}>
            
            <div className="no-print" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px', justifyContent: 'center' }}>
              {lojasUnicasGrafico.map(loja => {
                const isOculta = lojasOcultasGrafico.includes(loja);
                return (
                  <button
                    key={loja}
                    onClick={() => {
                      if (isOculta) setLojasOcultasGrafico(lojasOcultasGrafico.filter(l => l !== loja));
                      else setLojasOcultasGrafico([...lojasOcultasGrafico, loja]);
                    }}
                    style={{
                      padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, 
                      border: isOculta ? '1px dashed var(--border)' : '1px solid rgba(59,130,246,0.3)',
                      background: isOculta ? 'transparent' : 'rgba(59,130,246,0.1)',
                      color: isOculta ? 'var(--text-muted)' : '#3b82f6',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: isOculta ? 'var(--border)' : '#3b82f6' }}></div>
                    {loja} {isOculta && '(Oculto)'}
                  </button>
                );
              })}
            </div>

            {cotacoesParaGrafico.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
                Nenhuma cotação selecionada. Ative as lojas na legenda acima.
              </div>
            ) : (() => {
              const colLargura = 90; const barLargura = 44; const paddingLateral = 24; const alturaTopo = 62; 
              const alturaMaxBarra = 220; const alturaBase = 52; 

              const larguraTotal = Math.max(cotacoesParaGrafico.length * colLargura + paddingLateral * 2, colLargura + paddingLateral * 2);
              const alturaTotal = alturaTopo + alturaMaxBarra + alturaBase;

              const barras = cotacoesParaGrafico.map((cot, idx) => {
                const altura = diffValores === 0
                  ? alturaMaxBarra * 0.5
                  : (alturaMaxBarra * 0.15) + ((cot.valorUnitario - minValorGrafico) / diffValores) * (alturaMaxBarra * 0.70);
                const xCol = paddingLateral + idx * colLargura;
                const x = xCol + (colLargura - barLargura) / 2;
                const y = alturaTopo + (alturaMaxBarra - altura);
                return { ...cot, x, largura: barLargura, altura, y, centroX: x + barLargura / 2 };
              });

              return (
                <div style={{ overflowX: 'auto', background: 'var(--surface-3)', borderRadius: '12px', border: '1px solid var(--border)', padding: '10px' }}>
                  <svg width={larguraTotal} height={alturaTotal} viewBox={`0 0 ${larguraTotal} ${alturaTotal}`} style={{ display: 'block', minWidth: '100%' }}>
                    <defs>
                      <linearGradient id="gradAprovado" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#34d399" /></linearGradient>
                      <linearGradient id="gradReprovado" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#f87171" /></linearGradient>
                      <linearGradient id="gradPendente" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#fbbf24" /></linearGradient>
                    </defs>
                    {barras.map(b => {
                      const isReprovado = b.statusItem === 'Reprovado';
                      const isAprovado = b.statusItem === 'Aprovado';
                      const gradId = isAprovado ? 'gradAprovado' : isReprovado ? 'gradReprovado' : 'gradPendente';
                      const corBadgeBg = isAprovado ? 'rgba(16,185,129,0.15)' : isReprovado ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)';
                      const corBadgeTx = isAprovado ? '#10b981' : isReprovado ? '#ef4444' : '#f59e0b';
                      return (
                        <g key={b.id} opacity={isReprovado ? 0.45 : 1} className="print-bar">
                          <rect x={b.x - 6} y={alturaTopo - 44} width={b.largura + 12} height={16} rx={8} fill={corBadgeBg} />
                          <text x={b.centroX} y={alturaTopo - 33} textAnchor="middle" fontSize="9" fontWeight="700" fill={corBadgeTx}>{b.statusItem || 'Aprovado'}</text>
                          <text x={b.centroX} y={alturaTopo - 14} textAnchor="middle" fontSize="12" fontWeight="800" fill="#10b981" style={{ textDecoration: isReprovado ? 'line-through' : 'none' }}>{formatarMoeda(b.valorUnitario)}</text>
                          <rect x={b.x} y={b.y} width={b.largura} height={b.altura} rx={4} fill={`url(#${gradId})`} />
                          <text x={b.centroX} y={alturaTopo + alturaMaxBarra + 18} textAnchor="middle" fontSize="10" fontWeight="700" style={{ fill: 'var(--text-secondary)' }}>{(b.dataOrcamento || '').split(' ')[0]}</text>
                          <text x={b.centroX} y={alturaTopo + alturaMaxBarra + 32} textAnchor="middle" fontSize="9" style={{ fill: 'var(--text-muted)' }}>{(b.loja || '').substring(0, 14)}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              );
            })()}
          </div>
        </Modal.Body>
      </Modal>

    </div>
  );
}