import React, { useState, useEffect } from 'react';
import { Offcanvas } from 'react-bootstrap';
import api from '../services/api';

const estadoInicialForm = { id: null, nome: '', setor: '', status: 'Ativo' };

// Gera uma cor de avatar determinística baseada no nome
function getAvatarColor(nome) {
  const paleta = [
    ['#6366f1', '#8b5cf6'],
    ['#0ea5e9', '#6366f1'],
    ['#10b981', '#0ea5e9'],
    ['#f59e0b', '#ef4444'],
    ['#8b5cf6', '#ec4899'],
    ['#ec4899', '#f59e0b'],
  ];
  let hash = 0;
  for (let i = 0; i < nome.length; i++) hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  return paleta[Math.abs(hash) % paleta.length];
}

export default function Colaboradores({ user }) {
  const [colaboradores, setColaboradores] = useState([]);
  const [busca, setBusca] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(estadoInicialForm);

  const isAdmin = user?.perfil === 'ADMIN';

  const carregarColaboradores = () => {
    api.get('/colaboradores').then(r => setColaboradores(r.data)).catch(console.error);
  };

  useEffect(() => { carregarColaboradores(); }, []);

  const abrirPainelNovo = () => {
    if (!isAdmin) return;
    setFormData(estadoInicialForm);
    setShowForm(true);
  };

  const prepararEdicao = (c) => {
    if (!isAdmin) return;
    setFormData(c);
    setShowForm(true);
  };

  const excluirColaborador = async (id, nome) => {
    if (!isAdmin) return;
    if (window.confirm(`Tem certeza que deseja excluir permanentemente o colaborador "${nome}"?\n\nEle será removido do sistema, mas o histórico de ferramentas que ele pegou no passado continuará nos relatórios.`)) {
      try {
        await api.delete(`/colaboradores/${id}`);
        carregarColaboradores();
      } catch {
        alert('Erro ao tentar excluir colaborador.');
      }
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const salvarColaborador = (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    const req = formData.id
      ? api.put(`/colaboradores/${formData.id}`, formData)
      : api.post('/colaboradores', formData);
    req.then(() => { setShowForm(false); carregarColaboradores(); }).catch(() => alert('Erro ao salvar.'));
  };

  const colaboradoresFiltrados = colaboradores.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (c.setor && c.setor.toLowerCase().includes(busca.toLowerCase()))
  );

  const ativos   = colaboradoresFiltrados.filter(c => c.status === 'Ativo').length;
  const inativos = colaboradoresFiltrados.filter(c => c.status !== 'Ativo').length;

  return (
    <div>
      <div className="panel">
        {/* ── Header ── */}
        <div className="panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="panel-title">
              <i className="bi bi-people-fill"></i>
              Equipe
            </div>

            {/* Contadores rápidos */}
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{
                fontSize: 10.5, fontWeight: 700, padding: '2px 9px', borderRadius: 20,
                background: 'rgba(16,185,129,0.1)', color: '#34d399',
                border: '1px solid rgba(16,185,129,0.2)',
              }}>
                <i className="bi bi-check-circle-fill me-1" style={{ fontSize: 9 }}></i>
                {ativos} ativos
              </span>
              {inativos > 0 && (
                <span style={{
                  fontSize: 10.5, fontWeight: 700, padding: '2px 9px', borderRadius: 20,
                  background: 'rgba(148,163,184,0.08)', color: '#94a3b8',
                  border: '1px solid rgba(148,163,184,0.15)',
                }}>
                  {inativos} inativos
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="search-box">
              <i className="bi bi-search"></i>
              <input
                className="search-input"
                placeholder="Buscar colaborador..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </div>

            {isAdmin && (
              <button className="btn-primary-custom" onClick={abrirPainelNovo}>
                <i className="bi bi-person-plus-fill"></i> Novo Colaborador
              </button>
            )}
          </div>
        </div>

        {/* ── Tabela ── */}
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Setor / Departamento</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {colaboradoresFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 4 : 3}>
                    <div className="empty-state">
                      <div className="empty-state-icon"><i className="bi bi-people"></i></div>
                      <div className="empty-state-title">Nenhum colaborador encontrado</div>
                      <div className="empty-state-text">Tente ajustar a busca ou adicione um novo colaborador.</div>
                    </div>
                  </td>
                </tr>
              ) : colaboradoresFiltrados.map(colab => {
                const [c1, c2] = getAvatarColor(colab.nome);
                const isAtivo  = colab.status === 'Ativo';

                return (
                  <tr key={colab.id}>
                    {/* Nome + avatar */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: `linear-gradient(135deg, ${c1}, ${c2})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 800, color: 'white', flexShrink: 0,
                          boxShadow: `0 2px 10px ${c1}55`,
                        }}>
                          {colab.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="cell-main">{colab.nome}</div>
                        </div>
                      </div>
                    </td>

                    {/* Setor */}
                    <td>
                      {colab.setor ? (
                        <span style={{
                          fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 6,
                          background: 'rgba(99,102,241,0.06)', color: 'var(--text-secondary)',
                          border: '1px solid rgba(99,102,241,0.1)',
                        }}>
                          {colab.setor}
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>Não informado</span>
                      )}
                    </td>

                    {/* Status */}
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge-pill ${isAtivo ? 'badge-cobre' : 'badge-outros'}`}>
                        {isAtivo
                          ? <><i className="bi bi-check-circle-fill me-1"></i>Ativo</>
                          : <><i className="bi bi-x-circle-fill me-1"></i>Inativo</>
                        }
                      </span>
                    </td>

                    {/* Ações */}
                    {isAdmin && (
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            className="btn-ghost"
                            onClick={() => prepararEdicao(colab)}
                            title="Editar"
                            style={{ padding: '6px 10px' }}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn-ghost"
                            onClick={() => excluirColaborador(colab.id, colab.nome)}
                            title="Excluir"
                            style={{ padding: '6px 10px', color: '#f87171', borderColor: 'rgba(239,68,68,0.2)' }}
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Offcanvas / Drawer ── */}
      <Offcanvas show={showForm} onHide={() => setShowForm(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <i className={`bi ${formData.id ? 'bi-pencil-square' : 'bi-person-plus-fill'} me-2`}
               style={{ color: formData.id ? 'var(--warning)' : 'var(--primary-light)' }}></i>
            {formData.id ? 'Editar Colaborador' : 'Novo Colaborador'}
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {/* Preview do avatar no topo do form */}
          {formData.nome && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
              padding: '12px 14px', borderRadius: 10,
              background: 'var(--surface-3)', border: '1px solid var(--border)',
            }}>
              {(() => {
                const [c1, c2] = getAvatarColor(formData.nome);
                return (
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${c1}, ${c2})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 800, color: 'white',
                    boxShadow: `0 2px 12px ${c1}55`,
                  }}>
                    {formData.nome.charAt(0).toUpperCase()}
                  </div>
                );
              })()}
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{formData.nome}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{formData.setor || 'Setor não definido'}</div>
              </div>
            </div>
          )}

          <form onSubmit={salvarColaborador}>
            <div className="form-group mb-4">
              <label className="form-label-custom">Nome Completo <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                className="form-control-custom fw-bold"
                type="text" name="nome" required
                value={formData.nome} onChange={handleChange}
                placeholder="Ex: João da Silva"
              />
            </div>

            <div className="form-group mb-4">
              <label className="form-label-custom">Setor / Função</label>
              <input
                className="form-control-custom"
                type="text" name="setor"
                value={formData.setor} onChange={handleChange}
                placeholder="Ex: Manutenção, Instalador..."
              />
            </div>

            <div className="form-group mb-4">
              <label className="form-label-custom">Status no Sistema</label>
              <select
                className="form-select-custom fw-bold"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Ativo">Ativo (Pode retirar materiais)</option>
                <option value="Inativo">Inativo (Bloqueado)</option>
              </select>
            </div>

            {/* Status visual */}
            <div style={{
              padding: '10px 14px', borderRadius: 8, marginBottom: 24,
              background: formData.status === 'Ativo' ? 'rgba(16,185,129,0.06)' : 'rgba(148,163,184,0.06)',
              border: `1px solid ${formData.status === 'Ativo' ? 'rgba(16,185,129,0.18)' : 'rgba(148,163,184,0.12)'}`,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <i
                className={`bi ${formData.status === 'Ativo' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}
                style={{ color: formData.status === 'Ativo' ? '#34d399' : '#94a3b8', fontSize: 14 }}
              ></i>
              <span style={{ fontSize: 12, fontWeight: 600, color: formData.status === 'Ativo' ? '#34d399' : '#94a3b8' }}>
                {formData.status === 'Ativo' ? 'Colaborador ativo — pode realizar retiradas' : 'Colaborador inativo — acesso bloqueado'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                type="submit"
                className="btn-primary-custom"
                style={{ justifyContent: 'center', padding: '11px', fontSize: 13.5, borderRadius: 10 }}
              >
                <i className={`bi ${formData.id ? 'bi-check2' : 'bi-person-plus-fill'}`}></i>
                {formData.id ? 'Salvar Alterações' : 'Cadastrar Colaborador'}
              </button>
              <button
                type="button"
                className="btn-ghost"
                style={{ justifyContent: 'center', padding: '11px', fontSize: 13.5, borderRadius: 10 }}
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