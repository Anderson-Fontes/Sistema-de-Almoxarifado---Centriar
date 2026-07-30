import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import api from '../services/api';

export default function FichaEpi({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [ficha, setFicha] = useState([]);
  const [episEstoque, setEpisEstoque] = useState([]);
  const [colaborador, setColaborador] = useState(null); // 💡 Novo estado para os dados do funcionário
  const [showModal, setShowModal] = useState(false);
  const [isItemManual, setIsItemManual] = useState(false);
  
  const [editandoId, setEditandoId] = useState(null);

  const isAdmin = user?.perfil === 'ADMIN';

  const estadoInicial = {
    colaborador_id: id,
    epi_id: '',           
    nome_manual: '',      
    ca_registrado: '',
    data_vencimento: '', 
    data_retirada: new Date().toISOString().split('T')[0],
    proxima_troca: '',   
    quantidade: 1,
    observacoes: ''
  };

  const [formData, setFormData] = useState(estadoInicial);

  useEffect(() => {
    carregarFicha();
    carregarEstoque();
    carregarColaborador(); // 💡 Chama a função para buscar o funcionário
  }, [id]);

  // 💡 Função para buscar os dados do colaborador no backend
  const carregarColaborador = async () => {
    try {
      const res = await api.get(`/colaboradores/${id}`);
      setColaborador(res.data);
    } catch (err) {
      console.error("Erro ao carregar dados do colaborador:", err);
    }
  };

  const carregarFicha = async () => {
    try {
      const res = await api.get(`/fichas-epi/colaborador/${id}`);
      setFicha(res.data);
    } catch (err) {
      console.error("Erro ao carregar a ficha:", err);
    }
  };

  const carregarEstoque = async () => {
    try {
      const res = await api.get('/epis');
      setEpisEstoque(res.data);
    } catch (err) {
      console.error("Erro ao carregar o estoque:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'isItemManual') {
      setIsItemManual(checked);
      setFormData({ ...formData, epi_id: '', nome_manual: '' });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const fecharModal = () => {
    setShowModal(false);
    setEditandoId(null);
    setIsItemManual(false);
    setFormData(estadoInicial);
  };

  const abrirEdicao = (item) => {
    setEditandoId(item.id);
    setIsItemManual(!!item.nome_manual); 

    const formatDataInput = (dataStr) => dataStr ? dataStr.split('T')[0] : '';

    setFormData({
      colaborador_id: item.colaborador_id,
      epi_id: item.epi_id || '',
      nome_manual: item.nome_manual || '',
      ca_registrado: item.ca_registrado || '',
      data_vencimento: formatDataInput(item.data_vencimento),
      data_retirada: formatDataInput(item.data_retirada),
      proxima_troca: formatDataInput(item.proxima_troca),
      quantidade: item.quantidade,
      observacoes: item.observacoes || ''
    });

    setShowModal(true);
  };

  const registrarEpi = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (!formData.epi_id && !formData.nome_manual) {
      alert("Por favor, selecione um EPI ou digite o nome do item.");
      return;
    }

    try {
      if (editandoId) {
        await api.put(`/fichas-epi/${editandoId}`, formData);
        alert("Registro atualizado com sucesso!");
      } else {
        await api.post('/fichas-epi', formData);
        alert("Registro salvo com sucesso!");
      }
      
      fecharModal();
      carregarFicha();
    } catch (err) {
      alert("Erro ao salvar EPI.");
      console.error(err);
    }
  };

  const deletarRegistro = async (registroId) => {
    if (!isAdmin) return;
    if (window.confirm("Deseja mesmo remover este registro da ficha?")) {
      try {
        await api.delete(`/fichas-epi/${registroId}`);
        carregarFicha();
      } catch (err) {
        alert("Erro ao excluir registro.");
      }
    }
  };

  const renderizarAlerta = (dataAlvoStr, tipo) => {
    if (!dataAlvoStr) return <span style={{ color: 'var(--text-muted)' }}>-</span>;

    const dataLimpa = dataAlvoStr.split('T')[0];
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); 
    const dataAlvo = new Date(dataLimpa + 'T12:00:00'); 
    
    const diffTime = dataAlvo - hoje;
    const diffDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isCA = tipo === 'CA';
    const textoVencido = isCA ? 'CA Vencido' : 'Troca Atrasada';
    const textoNoPrazo = isCA ? 'CA Válido' : 'No prazo';

    let badge = null;
    let corDaData = '';

    if (diffDias < 0) {
      corDaData = '#ef4444';
      badge = (
        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: 'rgba(239,68,68,0.15)', color: corDaData, border: '1px solid rgba(239,68,68,0.3)', whiteSpace: 'nowrap' }}>
          <i className="bi bi-exclamation-octagon-fill me-1"></i> {textoVencido}
        </span>
      );
    } else if (diffDias <= 15) {
      corDaData = '#f59e0b';
      badge = (
        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: 'rgba(245,158,11,0.15)', color: corDaData, border: '1px solid rgba(245,158,11,0.3)', whiteSpace: 'nowrap' }}>
          <i className="bi bi-exclamation-triangle-fill me-1"></i> Vence em {diffDias}d
        </span>
      );
    } else {
      corDaData = '#10b981';
      badge = (
        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: 'rgba(16,185,129,0.1)', color: corDaData, border: '1px solid rgba(16,185,129,0.2)', whiteSpace: 'nowrap' }}>
          <i className="bi bi-check-circle-fill me-1"></i> {textoNoPrazo}
        </span>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div>{badge}</div>
        <div style={{ fontSize: 12, color: corDaData, fontWeight: 700 }}>
          {dataAlvo.toLocaleDateString('pt-BR')}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="panel">
        
        {/* 💡 CABEÇALHO ATUALIZADO COM OS DADOS DO FUNCIONÁRIO */}
        <div className="panel-header" style={{ alignItems: 'flex-start', paddingBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <button className="btn-ghost" onClick={() => navigate('/colaboradores')} title="Voltar" style={{ padding: '6px 12px', marginTop: '4px', border: '1px solid var(--border)' }}>
              <i className="bi bi-arrow-left"></i>
            </button>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <i className="bi bi-clipboard2-check-fill text-info me-2"></i>
                Ficha de Equipamentos e EPIs
              </div>
              
              {colaborador ? (
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: '1.2' }}>
                    {colaborador.nome}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {colaborador.cargo && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="bi bi-briefcase-fill" style={{ color: 'var(--primary-light)' }}></i> 
                        {colaborador.cargo}
                      </span>
                    )}
                    {colaborador.cpf && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="bi bi-person-vcard" style={{ color: 'var(--primary-light)' }}></i> 
                        CPF: {colaborador.cpf}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-muted)' }}>
                  Carregando dados...
                </div>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 10, marginTop: '4px' }}>
            {isAdmin && (
              <button className="btn-primary-custom" onClick={() => setShowModal(true)}>
                <i className="bi bi-plus-lg"></i> Registrar Entrega
              </button>
            )}
          </div>
        </div>
        {/* FIM DO CABEÇALHO ATUALIZADO */}

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Material / EPI</th>
                <th>Número do CA</th>
                <th>Validade do CA</th>
                <th>Data da Entrega</th>
                <th>Próxima Troca</th>
                <th style={{ textAlign: 'center' }}>Qtd.</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {ficha.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6}>
                    <div className="empty-state">
                      <div className="empty-state-icon"><i className="bi bi-journal-x"></i></div>
                      <div className="empty-state-title">Nenhum EPI registrado</div>
                      <div className="empty-state-text">Este colaborador ainda não possui registros na ficha.</div>
                    </div>
                  </td>
                </tr>
              ) : ficha.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="cell-main">{item.epi_nome || item.nome_manual}</div>
                    {item.observacoes && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Obs: {item.observacoes}</div>}
                  </td>
                  <td>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: 'var(--surface-3)', border: '1px solid var(--border)' }}>
                      {item.ca_registrado || 'S/N'}
                    </span>
                  </td>
                  <td>{renderizarAlerta(item.data_vencimento, 'CA')}</td>
                  
                  <td>
                    {item.data_retirada 
                      ? new Date(item.data_retirada.split('T')[0] + 'T12:00:00').toLocaleDateString('pt-BR') 
                      : '-'}
                  </td>
                  
                  <td>{renderizarAlerta(item.proxima_troca, 'TROCA')}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.quantidade}</td>
                  {isAdmin && (
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button className="btn-ghost me-2" onClick={() => abrirEdicao(item)} title="Editar" style={{ color: '#3b82f6' }}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn-ghost" onClick={() => deletarRegistro(item.id)} title="Remover" style={{ color: '#f87171' }}>
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Offcanvas show={showModal} onHide={fecharModal} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <i className={`bi ${editandoId ? 'bi-pencil-square' : 'bi-box-seam'} me-2 text-primary`}></i> 
            {editandoId ? "Editar Entrega" : "Nova Entrega"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <form onSubmit={registrarEpi}>
            
            <div className="mb-4 d-flex align-items-center">
              <div className="form-check form-switch">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  name="isItemManual" 
                  checked={isItemManual} 
                  onChange={handleChange} 
                  id="switchManual"
                />
                <label className="form-check-label ms-2" htmlFor="switchManual" style={{ fontSize: 13, fontWeight: 600 }}>
                  Item fora do estoque (Histórico/Antigo)
                </label>
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label-custom">
                {isItemManual ? "Nome do Material/EPI" : "Selecione o EPI no Estoque"} 
                <span className="text-danger">*</span>
              </label>
              
              {isItemManual ? (
                <input 
                  className="form-control-custom" 
                  type="text" 
                  name="nome_manual" 
                  value={formData.nome_manual} 
                  onChange={handleChange} 
                  placeholder="Ex: Bota de Couro Antiga" 
                  required 
                />
              ) : (
                <select className="form-select-custom" name="epi_id" value={formData.epi_id} onChange={handleChange} required>
                  <option value="">-- Escolha no Estoque --</option>
                  {episEstoque.map(epi => (
                    <option key={epi.id} value={epi.id}>{epi.nome} (Qtd: {epi.quantidade})</option>
                  ))}
                </select>
              )}
            </div>

            <div className="row">
              <div className="col-6 mb-4">
                <label className="form-label-custom">Número do CA</label>
                <input className="form-control-custom" type="text" name="ca_registrado" value={formData.ca_registrado} onChange={handleChange} placeholder="Ex: 12345" />
              </div>
              <div className="col-6 mb-4">
                <label className="form-label-custom text-warning"><i className="bi bi-shield-exclamation me-1"></i> Validade do CA</label>
                <input className="form-control-custom" type="date" name="data_vencimento" value={formData.data_vencimento} onChange={handleChange} />
              </div>
            </div>

            <div className="row">
              <div className="col-6 mb-4">
                <label className="form-label-custom">Data de Entrega <span className="text-danger">*</span></label>
                <input className="form-control-custom" type="date" name="data_retirada" value={formData.data_retirada} onChange={handleChange} required />
              </div>
              <div className="col-6 mb-4">
                <label className="form-label-custom">Quantidade <span className="text-danger">*</span></label>
                <input className="form-control-custom" type="number" min="0.1" step="0.1" name="quantidade" value={formData.quantidade} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group mb-4" style={{ background: 'rgba(56,189,248,0.05)', padding: '12px', borderRadius: '8px', border: '1px dashed rgba(56,189,248,0.3)' }}>
              <label className="form-label-custom text-info"><i className="bi bi-arrow-repeat me-1"></i> Próxima Troca (Física)</label>
              <input className="form-control-custom" type="date" name="proxima_troca" value={formData.proxima_troca} onChange={handleChange} />
            </div>

            <div className="form-group mb-4">
              <label className="form-label-custom">Observações</label>
              <textarea className="form-control-custom" name="observacoes" rows="2" value={formData.observacoes} onChange={handleChange} placeholder="Tamanho, motivo da entrega fora do estoque, etc."></textarea>
            </div>

            <button type="submit" className={`btn-primary-custom w-100 p-2 ${editandoId ? 'bg-primary' : ''}`} style={{ borderRadius: 10, justifyContent: 'center' }}>
              <i className={`bi ${editandoId ? 'bi-save' : 'bi-check2'}`}></i> 
              {editandoId ? "Salvar Alterações" : "Salvar na Ficha"}
            </button>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}