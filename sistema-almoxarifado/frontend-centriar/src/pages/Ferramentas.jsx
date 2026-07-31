import React, { useState, useEffect } from 'react';

export default function Ferramentas() {
  const [abaAtiva, setAbaAtiva] = useState('emprestimos'); // 'inventario', 'emprestimos'

  // Banco de Dados Local - Ferramentas
  const [ferramentas, setFerramentas] = useState(() => {
    const saved = localStorage.getItem('@Centriar:ferramentas');
    return saved ? JSON.parse(saved) : [];
  });

  // Banco de Dados Local - Empréstimos (Histórico e Ativos)
  const [emprestimos, setEmprestimos] = useState(() => {
    const saved = localStorage.getItem('@Centriar:emprestimos_ferramentas');
    return saved ? JSON.parse(saved) : [];
  });

  // Formulário de Nova Ferramenta
  const [formFerramenta, setFormFerramenta] = useState({
    nome: '',
    marca: '',
    patrimonio: '', // Ex: BV-01
  });

  // Formulário de Novo Empréstimo
  const [formEmprestimo, setFormEmprestimo] = useState({
    ferramentaId: '',
    tecnico: '',
    observacaoSaida: ''
  });

  useEffect(() => {
    localStorage.setItem('@Centriar:ferramentas', JSON.stringify(ferramentas));
  }, [ferramentas]);

  useEffect(() => {
    localStorage.setItem('@Centriar:emprestimos_ferramentas', JSON.stringify(emprestimos));
  }, [emprestimos]);

  // ─── LÓGICA DE INVENTÁRIO ───
  const adicionarFerramenta = (e) => {
    e.preventDefault();
    if (!formFerramenta.nome || !formFerramenta.patrimonio) {
      alert('Nome e Número de Patrimônio são obrigatórios.');
      return;
    }

    const nova = {
      id: Date.now().toString(),
      nome: formFerramenta.nome,
      marca: formFerramenta.marca,
      patrimonio: formFerramenta.patrimonio.toUpperCase(),
      status: 'Disponível' // 'Disponível', 'Em Uso', 'Manutenção'
    };

    setFerramentas([...ferramentas, nova]);
    setFormFerramenta({ nome: '', marca: '', patrimonio: '' });
  };

  const removerFerramenta = (id) => {
    const ferramenta = ferramentas.find(f => f.id === id);
    if (ferramenta.status === 'Em Uso') {
      alert('Não é possível excluir uma ferramenta que está emprestada.');
      return;
    }
    if (window.confirm('Tem certeza que deseja remover esta ferramenta do patrimônio?')) {
      setFerramentas(ferramentas.filter(f => f.id !== id));
    }
  };

  const alterarStatusManutencao = (id) => {
    setFerramentas(ferramentas.map(f => {
      if (f.id === id) {
        if (f.status === 'Em Uso') return f; // Impede mandar pra manutenção se estiver em uso
        return { ...f, status: f.status === 'Manutenção' ? 'Disponível' : 'Manutenção' };
      }
      return f;
    }));
  };

  // ─── LÓGICA DE EMPRÉSTIMOS ───
  const registrarEmprestimo = (e) => {
    e.preventDefault();
    if (!formEmprestimo.ferramentaId || !formEmprestimo.tecnico) {
      alert('Selecione a ferramenta e o técnico.');
      return;
    }

    const ferramenta = ferramentas.find(f => f.id === formEmprestimo.ferramentaId);
    
    const novoEmprestimo = {
      id: Date.now().toString(),
      ferramentaId: ferramenta.id,
      nomeFerramenta: `${ferramenta.patrimonio} - ${ferramenta.nome}`,
      tecnico: formEmprestimo.tecnico,
      dataSaida: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      dataDevolucao: null,
      observacaoSaida: formEmprestimo.observacaoSaida,
      status: 'Ativo' // 'Ativo', 'Devolvido'
    };

    // Salva o empréstimo e muda a ferramenta para "Em Uso"
    setEmprestimos([novoEmprestimo, ...emprestimos]);
    setFerramentas(ferramentas.map(f => f.id === ferramenta.id ? { ...f, status: 'Em Uso' } : f));
    
    setFormEmprestimo({ ferramentaId: '', tecnico: '', observacaoSaida: '' });
  };

  const registrarDevolucao = (emprestimoId, ferramentaId) => {
    if (window.confirm('Confirmar devolução desta ferramenta ao almoxarifado?')) {
      // Atualiza o empréstimo para devolvido com a data atual
      setEmprestimos(emprestimos.map(emp => 
        emp.id === emprestimoId 
        ? { ...emp, status: 'Devolvido', dataDevolucao: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) } 
        : emp
      ));

      // Libera a ferramenta no estoque
      setFerramentas(ferramentas.map(f => f.id === ferramentaId ? { ...f, status: 'Disponível' } : f));
    }
  };

  const ferramentasDisponiveis = ferramentas.filter(f => f.status === 'Disponível');
  const emprestimosAtivos = emprestimos.filter(e => e.status === 'Ativo');
  const historicoDevolucoes = emprestimos.filter(e => e.status === 'Devolvido');

  return (
    <div>
      {/* ── NAVEGAÇÃO ENTRE ABAS ── */}
      <div className="nav-tabs-custom mb-4" style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button 
          className={`btn btn-sm ${abaAtiva === 'emprestimos' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setAbaAtiva('emprestimos')}
          style={{ borderRadius: '8px', fontWeight: 700 }}
        >
          <i className="bi bi-arrow-left-right me-2"></i> Retiradas e Devoluções
        </button>
        <button 
          className={`btn btn-sm ${abaAtiva === 'inventario' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setAbaAtiva('inventario')}
          style={{ borderRadius: '8px', fontWeight: 700 }}
        >
          <i className="bi bi-tools me-2"></i> Cadastro de Patrimônio
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: EMPRÉSTIMOS E DEVOLUÇÕES                                           */}
      {/* ========================================================================= */}
      {abaAtiva === 'emprestimos' && (
        <div className="row g-4">
          {/* Painel Esquerdo: Registrar Saída */}
          <div className="col-md-4">
            <div className="panel h-100">
              <div className="panel-header" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <div className="panel-title" style={{ color: 'var(--primary-light)' }}>
                  <i className="bi bi-box-arrow-right me-2"></i> Registrar Retirada
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                <form onSubmit={registrarEmprestimo}>
                  <div className="mb-3">
                    <label className="form-label-custom">Técnico / Responsável <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className="form-control-custom" 
                      placeholder="Nome do funcionário"
                      value={formEmprestimo.tecnico}
                      onChange={e => setFormEmprestimo({ ...formEmprestimo, tecnico: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label-custom">Ferramenta Solicitada <span className="text-danger">*</span></label>
                    <select 
                      className="form-select-custom" 
                      value={formEmprestimo.ferramentaId}
                      onChange={e => setFormEmprestimo({ ...formEmprestimo, ferramentaId: e.target.value })}
                      required
                    >
                      <option value="">-- Selecione uma ferramenta disponível --</option>
                      {ferramentasDisponiveis.map(f => (
                        <option key={f.id} value={f.id}>{f.patrimonio} - {f.nome}</option>
                      ))}
                    </select>
                    {ferramentasDisponiveis.length === 0 && (
                      <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '6px' }}>*Nenhuma ferramenta livre no momento.</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="form-label-custom">Observação de Saída (Opcional)</label>
                    <input 
                      type="text" 
                      className="form-control-custom" 
                      placeholder="Ex: Vai levar para a obra na Clínica Sorriso"
                      value={formEmprestimo.observacaoSaida}
                      onChange={e => setFormEmprestimo({ ...formEmprestimo, observacaoSaida: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn-primary-custom w-100" style={{ justifyContent: 'center' }} disabled={ferramentasDisponiveis.length === 0}>
                    <i className="bi bi-check2-circle me-2"></i> Liberar Ferramenta
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Painel Direito: Ferramentas na Rua e Histórico */}
          <div className="col-md-8">
            <div className="panel mb-4">
              <div className="panel-header" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <div className="panel-title" style={{ color: '#f59e0b' }}>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i> Ferramentas na Rua ({emprestimosAtivos.length})
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                {emprestimosAtivos.length === 0 ? (
                  <div className="empty-state" style={{ padding: '20px 0' }}>
                    <i className="bi bi-check-circle" style={{ fontSize: '32px', color: '#10b981' }}></i>
                    <div style={{ color: 'var(--text-primary)', marginTop: '8px', fontWeight: 700 }}>Todas as ferramentas estão no almoxarifado!</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {emprestimosAtivos.map(emp => (
                      <div key={emp.id} style={{ background: 'var(--surface-2)', border: '1px solid #f59e0b40', borderLeft: '4px solid #f59e0b', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{emp.nomeFerramenta}</h4>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            Com: <strong style={{ color: 'var(--primary-light)' }}>{emp.tecnico}</strong> | Desde: {emp.dataSaida}
                          </div>
                          {emp.observacaoSaida && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}><i>Nota: {emp.observacaoSaida}</i></div>}
                        </div>
                        <button className="btn btn-sm" onClick={() => registrarDevolucao(emp.id, emp.ferramentaId)} style={{ background: '#10b981', color: '#fff', fontWeight: 700, borderRadius: '6px' }}>
                          <i className="bi bi-box-arrow-in-left me-1"></i> Receber Devolução
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                <div className="panel-title" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  <i className="bi bi-clock-history me-2"></i> Histórico Recente de Devoluções
                </div>
              </div>
              <div style={{ padding: '0 20px 20px' }}>
                <table className="data-table" style={{ width: '100%', marginTop: '10px' }}>
                  <thead>
                    <tr>
                      <th style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ferramenta</th>
                      <th style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Técnico</th>
                      <th style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Data Saída</th>
                      <th style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Data Devolução</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicoDevolucoes.slice(0, 5).map(hist => (
                      <tr key={hist.id}>
                        <td style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{hist.nomeFerramenta}</td>
                        <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{hist.tecnico}</td>
                        <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{hist.dataSaida}</td>
                        <td style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>{hist.dataDevolucao}</td>
                      </tr>
                    ))}
                    {historicoDevolucoes.length === 0 && (
                      <tr><td colSpan="4" style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '16px' }}>Nenhum histórico registrado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: INVENTÁRIO PATRIMONIAL                                             */}
      {/* ========================================================================= */}
      {abaAtiva === 'inventario' && (
        <div className="panel">
          <div className="panel-header" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="panel-title" style={{ color: 'var(--primary-light)' }}>
              <i className="bi bi-tools me-2"></i> Cadastro e Patrimônio
            </div>
          </div>
          
          <div style={{ padding: '20px' }}>
            {/* Cadastro Rápido */}
            <div className="p-3 mb-4" style={{ background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px' }}>Cadastrar Nova Ferramenta</div>
              <form onSubmit={adicionarFerramenta} className="row g-3 align-items-end">
                <div className="col-md-2">
                  <label className="form-label-custom">Nº Patrimônio (TAG) <span className="text-danger">*</span></label>
                  <input type="text" className="form-control-custom" placeholder="Ex: BV-01" value={formFerramenta.patrimonio} onChange={e => setFormFerramenta({ ...formFerramenta, patrimonio: e.target.value })} required />
                </div>
                <div className="col-md-5">
                  <label className="form-label-custom">Nome da Ferramenta / Equipamento <span className="text-danger">*</span></label>
                  <input type="text" className="form-control-custom" placeholder="Ex: Bomba de Vácuo 12CFM" value={formFerramenta.nome} onChange={e => setFormFerramenta({ ...formFerramenta, nome: e.target.value })} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label-custom">Marca / Modelo</label>
                  <input type="text" className="form-control-custom" placeholder="Ex: Suryha" value={formFerramenta.marca} onChange={e => setFormFerramenta({ ...formFerramenta, marca: e.target.value })} />
                </div>
                <div className="col-md-2">
                  <button type="submit" className="btn-primary-custom w-100" style={{ justifyContent: 'center' }}><i className="bi bi-plus-lg me-2"></i> Adicionar</button>
                </div>
              </form>
            </div>

            {/* Listagem do Inventário */}
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>TAG Patrimônio</th>
                  <th>Equipamento</th>
                  <th>Marca</th>
                  <th>Status Atual</th>
                  <th style={{ textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {ferramentas.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Nenhuma ferramenta cadastrada no patrimônio.</td></tr>
                ) : (
                  ferramentas.map(f => {
                    const isEmUso = f.status === 'Em Uso';
                    const isManutencao = f.status === 'Manutenção';
                    
                    return (
                      <tr key={f.id} style={{ opacity: isManutencao ? 0.6 : 1 }}>
                        <td style={{ fontWeight: 800, color: 'var(--primary-light)' }}>{f.patrimonio}</td>
                        <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{f.nome}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{f.marca || '-'}</td>
                        <td>
                          <span style={{ 
                            fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px',
                            background: isEmUso ? 'rgba(245,158,11,0.1)' : isManutencao ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                            color: isEmUso ? '#f59e0b' : isManutencao ? '#ef4444' : '#10b981',
                            border: `1px solid ${isEmUso ? '#f59e0b40' : isManutencao ? '#ef444440' : '#10b98140'}`
                          }}>
                            {isEmUso ? 'Na Rua (Com técnico)' : isManutencao ? 'Em Manutenção' : 'Disponível no Almoxarifado'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            className="btn btn-sm btn-outline-warning" 
                            onClick={() => alterarStatusManutencao(f.id)} 
                            disabled={isEmUso}
                            title={isManutencao ? "Retornar ao Almoxarifado" : "Enviar para Conserto/Manutenção"}
                          >
                            <i className="bi bi-wrench-adjustable"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => removerFerramenta(f.id)} 
                            disabled={isEmUso}
                            title="Remover do Patrimônio"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}