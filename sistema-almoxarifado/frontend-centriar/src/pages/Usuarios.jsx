import React, { useState, useEffect } from 'react';
import { Offcanvas } from 'react-bootstrap';
import api from '../services/api';

const estadoInicialForm = { id: null, nome: '', cpf: '', senha: '', perfil: 'VISUALIZADOR', funcao: '' };

// Badge de perfil reutilizável
function PerfilBadge({ perfil }) {
  const isAdmin = perfil === 'ADMIN';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
      letterSpacing: 0.2,
      background: isAdmin ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)',
      color:      isAdmin ? '#fbbf24'               : '#60a5fa',
      border:     isAdmin ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(59,130,246,0.2)',
    }}>
      <i className={`bi ${isAdmin ? 'bi-shield-lock-fill' : 'bi-eye-fill'}`} style={{ fontSize: 10 }}></i>
      {isAdmin ? 'Administrador' : 'Visualizador'}
    </span>
  );
}

export default function Usuarios({ user }) {
  const [usuarios,  setUsuarios]  = useState([]);
  const [showForm,  setShowForm]  = useState(false);
  const [formData,  setFormData]  = useState(estadoInicialForm);
  const [showSenha, setShowSenha] = useState(false); // toggle de senha no form

  const isAdmin      = user?.perfil === 'ADMIN';
  const isSuperAdmin = user?.id === 1 || user?.cpf === '000.000.000-00';

  const carregarUsuarios = () => {
    api.get('/usuarios').then(r => setUsuarios(r.data)).catch(console.error);
  };

  useEffect(() => { if (isAdmin) carregarUsuarios(); }, [isAdmin]);

  const handleCpfChange = (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setFormData({ ...formData, cpf: v });
  };

  const abrirPainelNovo  = () => { setFormData(estadoInicialForm); setShowSenha(false); setShowForm(true); };
  const prepararEdicao   = (u) => { setFormData({ ...u, senha: '' }); setShowSenha(false); setShowForm(true); };

  const excluirUsuario = async (id, nome) => {
    if (window.confirm(`ATENÇÃO: Deseja excluir o acesso ao sistema do usuário "${nome}"?`)) {
      try {
        await api.delete(`/usuarios/${id}`);
        carregarUsuarios();
      } catch (err) {
        alert(err.response?.data?.error || 'Erro ao tentar excluir usuário.');
      }
    }
  };

  const salvarUsuario = (e) => {
    e.preventDefault();
    if (!formData.id && formData.senha.length < 4) return alert('A senha inicial deve ter pelo menos 4 caracteres.');
    const req = formData.id
      ? api.put(`/usuarios/${formData.id}`, formData)
      : api.post('/usuarios', formData);
    req.then(() => { setShowForm(false); carregarUsuarios(); })
       .catch(err => alert(err.response?.data?.error || 'Erro ao salvar.'));
  };

  // ── Acesso negado ──────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '64px 24px', textAlign: 'center',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, color: '#f87171', marginBottom: 20,
        }}>
          <i className="bi bi-shield-lock"></i>
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Acesso Negado</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 300 }}>
          Apenas administradores podem gerenciar os acessos ao sistema.
        </div>
      </div>
    );
  }

  const admins      = usuarios.filter(u => u.perfil === 'ADMIN').length;
  const visualizers = usuarios.filter(u => u.perfil !== 'ADMIN').length;

  return (
    <div>
      <div className="panel">
        {/* ── Header ── */}
        <div className="panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="panel-title">
              <i className="bi bi-key-fill" style={{ color: 'var(--warning)' }}></i>
              Acessos ao Sistema
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{
                fontSize: 10.5, fontWeight: 700, padding: '2px 9px', borderRadius: 20,
                background: 'rgba(245,158,11,0.1)', color: '#fbbf24',
                border: '1px solid rgba(245,158,11,0.2)',
              }}>
                <i className="bi bi-shield-lock-fill me-1" style={{ fontSize: 9 }}></i>
                {admins} admin{admins !== 1 && 's'}
              </span>
              {visualizers > 0 && (
                <span style={{
                  fontSize: 10.5, fontWeight: 700, padding: '2px 9px', borderRadius: 20,
                  background: 'rgba(59,130,246,0.1)', color: '#60a5fa',
                  border: '1px solid rgba(59,130,246,0.2)',
                }}>
                  <i className="bi bi-eye-fill me-1" style={{ fontSize: 9 }}></i>
                  {visualizers} visualizador{visualizers !== 1 && 'es'}
                </span>
              )}
            </div>
          </div>

          <button className="btn-primary-custom" onClick={abrirPainelNovo}>
            <i className="bi bi-person-plus-fill"></i> Novo Acesso
          </button>
        </div>

        {/* ── Tabela ── */}
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Função / Cargo</th>
                <th>CPF (Login)</th>
                {isSuperAdmin && <th>Senha de Acesso</th>}
                <th>Permissão</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 6 : 5}>
                    <div className="empty-state">
                      <div className="empty-state-icon"><i className="bi bi-key"></i></div>
                      <div className="empty-state-title">Nenhum usuário cadastrado</div>
                    </div>
                  </td>
                </tr>
              ) : usuarios.map(u => (
                <tr key={u.id}>
                  {/* Nome */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: u.perfil === 'ADMIN'
                          ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                          : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 800, color: 'white', flexShrink: 0,
                        boxShadow: u.perfil === 'ADMIN'
                          ? '0 2px 10px rgba(245,158,11,0.3)'
                          : '0 2px 10px rgba(59,130,246,0.3)',
                      }}>
                        {u.nome ? u.nome.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <div className="cell-main">{u.nome}</div>
                        {u.id === 1 && (
                          <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--warning)', marginTop: 2 }}>
                            <i className="bi bi-star-fill me-1" style={{ fontSize: 9 }}></i>Super Admin
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Função */}
                  <td>
                    <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                      {u.funcao || <span style={{ fontStyle: 'italic', opacity: 0.6 }}>Não informada</span>}
                    </span>
                  </td>

                  {/* CPF */}
                  <td><span className="cell-mono">{u.cpf}</span></td>

                  {/* Senha (somente super admin) */}
                  {isSuperAdmin && (
                    <td>
                      {u.senha ? (
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 6,
                          background: 'rgba(239,68,68,0.07)', color: '#f87171',
                          border: '1px solid rgba(239,68,68,0.18)',
                          fontFamily: 'var(--font-mono)',
                        }}>
                          <i className="bi bi-unlock-fill me-1" style={{ fontSize: 10 }}></i>{u.senha}
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          ••••••••
                        </span>
                      )}
                    </td>
                  )}

                  {/* Permissão */}
                  <td><PerfilBadge perfil={u.perfil} /></td>

                  {/* Ações */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button
                        className="btn-ghost"
                        onClick={() => prepararEdicao(u)}
                        title="Editar"
                        style={{ padding: '6px 10px' }}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      {u.id !== 1 && (
                        <button
                          className="btn-ghost"
                          onClick={() => excluirUsuario(u.id, u.nome)}
                          title="Remover acesso"
                          style={{ padding: '6px 10px', color: '#f87171', borderColor: 'rgba(239,68,68,0.2)' }}
                        >
                          <i className="bi bi-trash3-fill"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Offcanvas ── */}
      <Offcanvas show={showForm} onHide={() => setShowForm(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <i className={`bi ${formData.id ? 'bi-pencil-square' : 'bi-key-fill'} me-2`}
               style={{ color: 'var(--warning)' }}></i>
            {formData.id ? 'Editar Acesso' : 'Criar Novo Acesso'}
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {/* Banner de perfil selecionado */}
          <div style={{
            padding: '12px 14px', borderRadius: 10, marginBottom: 20,
            background: formData.perfil === 'ADMIN'
              ? 'rgba(245,158,11,0.06)' : 'rgba(59,130,246,0.06)',
            border: formData.perfil === 'ADMIN'
              ? '1px solid rgba(245,158,11,0.18)' : '1px solid rgba(59,130,246,0.15)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <i
              className={`bi ${formData.perfil === 'ADMIN' ? 'bi-shield-lock-fill' : 'bi-eye-fill'}`}
              style={{
                fontSize: 18,
                color: formData.perfil === 'ADMIN' ? 'var(--warning)' : 'var(--info)',
              }}
            ></i>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: formData.perfil === 'ADMIN' ? '#fbbf24' : '#60a5fa' }}>
                {formData.perfil === 'ADMIN' ? 'Administrador' : 'Visualizador'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                {formData.perfil === 'ADMIN' ? 'Acesso total — pode editar, criar e excluir' : 'Somente leitura — não pode fazer alterações'}
              </div>
            </div>
          </div>

          <form onSubmit={salvarUsuario}>
            <div className="form-group mb-3">
              <label className="form-label-custom">Nome da Pessoa <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                className="form-control-custom"
                type="text"
                value={formData.nome}
                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                required
                placeholder="Ex: Maria Souza"
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label-custom">Função / Cargo</label>
              <input
                className="form-control-custom"
                type="text"
                value={formData.funcao}
                onChange={e => setFormData({ ...formData, funcao: e.target.value })}
                placeholder="Ex: Auxiliar Adm, Técnico..."
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label-custom">CPF (Usado para Login) <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                className="form-control-custom"
                type="text"
                value={formData.cpf}
                onChange={handleCpfChange}
                required
                placeholder="000.000.000-00"
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label-custom">
                Senha {!formData.id && <span style={{ color: 'var(--danger)' }}>*</span>}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-control-custom"
                  type={showSenha ? 'text' : 'password'}
                  value={formData.senha}
                  onChange={e => setFormData({ ...formData, senha: e.target.value })}
                  required={!formData.id}
                  placeholder={formData.id ? 'Deixe em branco para manter a atual' : 'Senha de acesso'}
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: 14, padding: 0,
                    transition: 'color 0.15s',
                  }}
                  onMouseOver={e => e.currentTarget.style.color = 'var(--primary-light)'}
                  onMouseOut={e  => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <i className={`bi ${showSenha ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                </button>
              </div>
              {formData.id && (
                <div className="form-note">Deixe em branco para manter a senha atual.</div>
              )}
            </div>

            <div className="form-group mb-4">
              <label className="form-label-custom" style={{ color: 'var(--primary-light)' }}>
                <i className="bi bi-shield-shaded me-1"></i> Permissão no Sistema
              </label>
              <select
                className="form-select-custom fw-bold"
                value={formData.perfil}
                onChange={e => setFormData({ ...formData, perfil: e.target.value })}
              >
                <option value="VISUALIZADOR">Visualizador (Somente Leitura)</option>
                <option value="ADMIN">Administrador (Acesso Total)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
              <button
                type="submit"
                className="btn-primary-custom"
                style={{ justifyContent: 'center', padding: '11px', fontSize: 13.5, borderRadius: 10 }}
              >
                <i className={`bi ${formData.id ? 'bi-check2' : 'bi-key-fill'}`}></i>
                {formData.id ? 'Salvar Alterações' : 'Cadastrar Acesso'}
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