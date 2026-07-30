import React, { useState } from 'react';

// Componente para formatar moeda
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

export default function Orcamentos() {
  const [itens, setItens] = useState([]);
  const [form, setForm] = useState({
    produto: '',
    loja: '',
    valorUnitario: '',
    quantidade: 1,
    formaPagamento: 'Pix',
    parcelas: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: value };
    
    // Se mudar para Pix, força a ser 1 parcela
    if (name === 'formaPagamento' && (value === 'Pix' || value === 'Boleto à vista')) {
      newForm.parcelas = 1;
    }
    
    setForm(newForm);
  };

  const adicionarItem = (e) => {
    e.preventDefault();
    if (!form.produto || !form.loja || !form.valorUnitario) {
      alert('Preencha os campos obrigatórios (Produto, Loja e Valor).');
      return;
    }

    const valorConvertido = parseFloat(form.valorUnitario.replace(',', '.'));
    if (isNaN(valorConvertido)) {
      alert('Digite um valor numérico válido.');
      return;
    }

    const novoItem = {
      id: Date.now(),
      ...form,
      valorUnitario: valorConvertido,
      quantidade: parseInt(form.quantidade),
      parcelas: parseInt(form.parcelas)
    };

    setItens([...itens, novoItem]);
    setForm({ ...form, produto: '', valorUnitario: '', quantidade: 1 });
  };

  const removerItem = (id) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const imprimirOrcamento = () => {
    window.print();
  };

  // Cálculos Automáticos
  const totalGeral = itens.reduce((acc, item) => acc + (item.valorUnitario * item.quantidade), 0);
  const totalMensalGeral = itens.reduce((acc, item) => acc + ((item.valorUnitario * item.quantidade) / item.parcelas), 0);

  // Agrupamento por Loja
  const orcamentoPorLoja = itens.reduce((acc, item) => {
    const loja = item.loja || 'Outros';
    const totalItem = item.valorUnitario * item.quantidade;
    const valorParcela = totalItem / item.parcelas;

    if (!acc[loja]) acc[loja] = { itens: [], total: 0, valorParcelaMes: 0 };
    
    acc[loja].itens.push(item);
    acc[loja].total += totalItem;
    acc[loja].valorParcelaMes += valorParcela;
    
    return acc;
  }, {});

  const dataAtual = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      {/* ── ESTILOS BLINDADOS PARA IMPRESSÃO / PDF ── */}
      <style>{`
        @media print {
          /* Esconde os menus e ferramentas do sistema */
          .sidebar, .topbar, .no-print { display: none !important; }
          
          /* Reseta os espaços para a folha A4 */
          body, .app-container, .main-content, .page-content { 
            background: #ffffff !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            width: 100% !important; 
            display: block !important;
          }

          /* Força as cores de texto e fundo para funcionarem no Dark Mode */
          #documento-orcamento { 
            background: #ffffff !important; 
            padding: 0 !important;
          }
          
          /* Força TUDO a ficar com cor preta/cinza escuro para aparecer no papel */
          #documento-orcamento h2, 
          #documento-orcamento h3, 
          #documento-orcamento div, 
          #documento-orcamento td, 
          #documento-orcamento th, 
          #documento-orcamento span, 
          #documento-orcamento strong {
            color: #0f172a !important; 
          }

          /* Exceções: Onde precisa manter cor (Ex: O Verde do Total) */
          .print-text-green, .print-text-green * { color: #047857 !important; }
          
          /* Fundos coloridos com forçante de impressão no navegador (-webkit-print-color-adjust) */
          .print-bg-green { background: #dcfce7 !important; border: 2px solid #10b981 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-bg-gray { background: #f8fafc !important; border: 2px solid #cbd5e1 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          
          /* Cartão de cada loja - Proteção para não quebrar a tabela na metade da folha */
          .print-card-loja { 
            border: 1px solid #cbd5e1 !important; 
            border-top: 4px solid #3b82f6 !important; 
            background: #ffffff !important; 
            margin-bottom: 24px !important; 
            page-break-inside: avoid !important;
          }
          
          /* Cabeçalho cinza clarinho da loja */
          .print-loja-header { 
            background: #f1f5f9 !important; 
            border-bottom: 1px solid #cbd5e1 !important; 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
          }

          /* Linhas da Tabela de Produtos */
          .print-table th { border-bottom: 2px solid #cbd5e1 !important; }
          .print-table td { border-bottom: 1px solid #e2e8f0 !important; }
        }
      `}</style>

      {/* ── FORMULÁRIO (OCULTO NO PRINT) ── */}
      <div className="panel mb-4 no-print">
        <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          <div className="panel-title" style={{ color: 'var(--primary-light)' }}>
            <i className="bi bi-cart-plus-fill me-2"></i> 
            Montador de Orçamentos
          </div>
        </div>
        
        <div style={{ padding: '20px' }}>
          <form onSubmit={adicionarItem}>
            <div className="row g-3 align-items-end">
              <div className="col-md-2">
                <label className="form-label-custom">Loja / Fornecedor <span className="text-danger">*</span></label>
                <input className="form-control-custom" type="text" name="loja" value={form.loja} onChange={handleChange} placeholder="Ex: Frigelar..." required />
              </div>
              <div className="col-md-3">
                <label className="form-label-custom">Produto / Material <span className="text-danger">*</span></label>
                <input className="form-control-custom" type="text" name="produto" value={form.produto} onChange={handleChange} placeholder="Ex: Compressor 12k..." required />
              </div>
              <div className="col-md-2">
                <label className="form-label-custom">Valor Unit. (R$) <span className="text-danger">*</span></label>
                <input className="form-control-custom" type="text" name="valorUnitario" value={form.valorUnitario} onChange={handleChange} placeholder="0.00" required />
              </div>
              <div className="col-md-1">
                <label className="form-label-custom">Qtd.</label>
                <input className="form-control-custom" type="number" min="1" name="quantidade" value={form.quantidade} onChange={handleChange} required />
              </div>
              <div className="col-md-2">
                <label className="form-label-custom">Pagamento</label>
                <select className="form-select-custom" name="formaPagamento" value={form.formaPagamento} onChange={handleChange}>
                  <option value="Pix">Pix / À Vista</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Boleto Parcelado">Boleto Parcelado</option>
                  <option value="Faturado">Faturado (Empresa)</option>
                </select>
              </div>
              <div className="col-md-1">
                <label className="form-label-custom">Parcelas</label>
                <select className="form-select-custom" name="parcelas" value={form.parcelas} onChange={handleChange} disabled={form.formaPagamento === 'Pix' || form.formaPagamento === 'Boleto à vista'}>
                  {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}x</option>)}
                </select>
              </div>
              <div className="col-md-1">
                <button type="submit" className="btn-primary-custom w-100" style={{ justifyContent: 'center', padding: '10px' }} title="Adicionar">
                  <i className="bi bi-plus-lg"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* ── ESPELHO DO DOCUMENTO (EXIBIDO NO PRINT) ── */}
      {itens.length > 0 && (
        <div id="documento-orcamento" style={{ background: 'var(--bg)', borderRadius: '12px', paddingBottom: '20px' }}>
          
          {/* Cabeçalho do Documento */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ margin: 0, fontWeight: 900, color: 'var(--text-primary)', fontSize: '22px' }}>
                Resumo de Orçamento
              </h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                Gerado em: {dataAtual} | Itens cotados: {itens.length}
              </div>
            </div>
            <button className="btn-primary-custom no-print" onClick={imprimirOrcamento} style={{ background: '#10b981', borderColor: '#059669', padding: '8px 16px' }}>
              <i className="bi bi-printer-fill me-2"></i> Print / Gerar PDF
            </button>
          </div>

          {/* Destaque Financeiro Mastigado */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="print-bg-green" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '24px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="print-text-green" style={{ fontSize: '12px', color: '#059669', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>
                  Custo Total da Compra
                </div>
                <div className="print-text-green" style={{ fontSize: '38px', fontWeight: 900, color: '#10b981', lineHeight: '1.2' }}>
                  {formatarMoeda(totalGeral)}
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="print-bg-gray" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>
                  Desembolso Mensal Previsto
                </div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-primary)', lineHeight: '1.2' }}>
                  {formatarMoeda(totalMensalGeral)} <span style={{ fontSize: '16px', fontWeight: 700 }}>/mês</span>
                </div>
                {totalGeral === totalMensalGeral && (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
                    *Todos os itens cotados à vista.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Listagem Agrupada por Loja */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.keys(orcamentoPorLoja).map((loja, index) => {
              const dados = orcamentoPorLoja[loja];
              return (
                <div key={index} className="print-card-loja" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderTop: '4px solid var(--primary-light)', borderRadius: '12px', overflow: 'hidden' }}>
                  
                  {/* Cabeçalho da Loja (Onde sumia o nome) */}
                  <div className="print-loja-header" style={{ background: 'var(--surface-2)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="no-print" style={{ width: '40px', height: '40px', background: 'var(--surface-3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bi bi-shop text-primary" style={{ fontSize: '20px' }}></i>
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)' }}>{loja}</h3>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{dados.itens.length} produto(s) nesta cotação</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Subtotal Loja</div>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--primary-light)' }}>{formatarMoeda(dados.total)}</div>
                    </div>
                  </div>

                  {/* Tabela de Itens da Loja */}
                  <div style={{ padding: '0 20px 10px' }}>
                    <table className="print-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                          <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Produto</th>
                          <th style={{ textAlign: 'center', padding: '10px 8px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Qtd x Valor</th>
                          <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Pgto</th>
                          <th style={{ textAlign: 'right', padding: '10px 8px', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total</th>
                          <th className="no-print" style={{ width: '40px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {dados.itens.map(item => (
                          <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '12px 8px', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {item.produto}
                            </td>
                            <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
                              <strong>{item.quantidade}x</strong> {formatarMoeda(item.valorUnitario)}
                            </td>
                            <td style={{ padding: '12px 8px' }}>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {item.formaPagamento}
                                {item.parcelas > 1 && <span style={{ color: 'var(--warning)', marginLeft: '6px' }}>({item.parcelas}x de {formatarMoeda((item.valorUnitario * item.quantidade) / item.parcelas)})</span>}
                              </div>
                            </td>
                            <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                              {formatarMoeda(item.valorUnitario * item.quantidade)}
                            </td>
                            <td className="no-print" style={{ textAlign: 'center' }}>
                              <button onClick={() => removerItem(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }} title="Remover Item">
                                <i className="bi bi-x-circle-fill" style={{ fontSize: '16px' }}></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {itens.length === 0 && (
        <div className="empty-state" style={{ padding: '60px 0', border: '2px dashed var(--border)', borderRadius: '12px' }}>
          <i className="bi bi-receipt" style={{ fontSize: '48px', color: 'var(--text-muted)' }}></i>
          <div style={{ color: 'var(--text-primary)', marginTop: '16px', fontSize: '18px', fontWeight: 800 }}>O Orçamento está vazio</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Adicione os itens acima para montar o documento de aprovação.</div>
        </div>
      )}
    </div>
  );
}