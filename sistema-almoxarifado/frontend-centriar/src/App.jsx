import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

// Importação das Páginas
import Estoque from './pages/Estoque';
import Movimentacoes from './pages/Movimentacoes';
import Colaboradores from './pages/Colaboradores';
import Relatorios from './pages/Relatorios';
import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import FichaEpi from './pages/FichaEpi'; // ⬅️ NOVA PÁGINA IMPORTADA!

// Importação da API
import api from './services/api';

// Importação da logo
import logoCentriar from './assets/logo_sem_fundo.png';

const navItems = [
  { to: '/',              icon: 'bi-box-seam',         label: 'Estoque Atual'  },
  { to: '/movimentacoes', icon: 'bi-arrow-left-right', label: 'Movimentações'  },
  { to: '/colaboradores', icon: 'bi-people',           label: 'Colaboradores'  },
  { to: '/relatorios',    icon: 'bi-graph-up-arrow',   label: 'Relatórios'     },
];

const pageTitles = {
  '/':               { title: 'Estoque Atual',  sub: 'Inventário e controle de materiais'        },
  '/movimentacoes':  { title: 'Movimentações',  sub: 'Histórico de retiradas e devoluções'       },
  '/colaboradores':  { title: 'Colaboradores',  sub: 'Gerenciamento de equipe'                   },
  '/relatorios':     { title: 'Relatórios',     sub: 'Análises e exportações'                    },
  '/usuarios':       { title: 'Acessos',        sub: 'Gerenciamento de usuários do sistema'      },
};

// Calendário Oficial de 2026 (Brasil, SP e Jacareí)
const feriados2026 = [
  { data: '2026-01-01', nome: 'Confraternização Universal',   tipo: 'Nacional',   cor: '#ef4444' },
  { data: '2026-02-17', nome: 'Carnaval',                     tipo: 'Nacional',   cor: '#ef4444' },
  { data: '2026-04-03', nome: 'Sexta-feira Santa',            tipo: 'Nacional',   cor: '#ef4444' },
  { data: '2026-04-03', nome: 'Aniversário de Jacareí',       tipo: 'Municipal',  cor: '#a855f7' },
  { data: '2026-04-21', nome: 'Tiradentes',                   tipo: 'Nacional',   cor: '#ef4444' },
  { data: '2026-05-01', nome: 'Dia do Trabalhador',           tipo: 'Nacional',   cor: '#ef4444' },
  { data: '2026-06-04', nome: 'Corpus Christi',               tipo: 'Nacional',   cor: '#ef4444' },
  { data: '2026-07-09', nome: 'Revolução Constitucionalista', tipo: 'Estadual',   cor: '#3b82f6' },
  { data: '2026-09-07', nome: 'Independência do Brasil',      tipo: 'Nacional',   cor: '#ef4444' },
  { data: '2026-10-12', nome: 'Nossa Senhora Aparecida',      tipo: 'Nacional',   cor: '#ef4444' },
  { data: '2026-11-02', nome: 'Finados',                      tipo: 'Nacional',   cor: '#ef4444' },
  { data: '2026-11-15', nome: 'Proclamação da República',     tipo: 'Nacional',   cor: '#ef4444' },
  { data: '2026-12-08', nome: 'Padroeira de Jacareí',         tipo: 'Municipal',  cor: '#a855f7' },
  { data: '2026-12-25', nome: 'Natal',                        tipo: 'Nacional',   cor: '#ef4444' },
];

// ── Avatar com inicial ──────────────────────────────────────
function Avatar({ nome, size = 34, fontSize = 13, style = {} }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize, fontWeight: 800, color: 'white', flexShrink: 0,
      boxShadow: '0 2px 10px rgba(99,102,241,0.4)',
      border: '2px solid rgba(99,102,241,0.28)',
      ...style,
    }}>
      {nome ? nome.charAt(0).toUpperCase() : 'U'}
    </div>
  );
}

function Layout({ onLogout, user }) {
  const location = useLocation();
  
  // Lógica inteligente para o título do topo se adaptar às sub-rotas como a Ficha de EPI
  let page = pageTitles[location.pathname];
  if (!page) {
    if (location.pathname.includes('/colaboradores/ficha')) {
      page = { title: 'Ficha de EPI', sub: 'Registro individual de entrega' };
    } else {
      page = pageTitles['/'];
    }
  }

  const now  = new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });

  const [showProfile,  setShowProfile]  = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loadingAgenda, setLoadingAgenda] = useState(false);

  const abrirCalendario = () => {
    setShowCalendar(true);
    setLoadingAgenda(true);
    api.get('/agendamentos')
       .then(r => { setAgendamentos(r.data.filter(a => a.status === 'AGENDADO')); })
       .catch(err => console.error('Erro ao buscar agenda:', err))
       .finally(() => setLoadingAgenda(false));
  };

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  return (
    <div className="app-container">

      {/* ─── SIDEBAR ─── */}
      <div className="sidebar">

        {/* Logo */}
        <div className="sidebar-logo" style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '18px 12px', borderBottom: '1px solid var(--border)',
        }}>
          <img
            src={logoCentriar}
            alt="Centriar Ar Condicionado"
            style={{ maxWidth: '100%', maxHeight: '84px', objectFit: 'contain' }}
          />
        </div>

        {/* Nav */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">Menu principal</div>

          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item ${isActive || (item.to === '/colaboradores' && location.pathname.includes('/ficha')) ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon} nav-icon`}></i>
              {item.label}
            </NavLink>
          ))}

          {user?.perfil === 'ADMIN' && (
            <NavLink
              to="/usuarios"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-key-fill nav-icon"></i>
              Acessos (Senhas)
            </NavLink>
          )}
        </div>

        {/* Footer / User card */}
        <div className="sidebar-footer">
          <div
            className="user-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowProfile(true)}
            title="Ver meu perfil"
          >
            <Avatar nome={user?.nome} />
            <div style={{ minWidth: 0 }}>
              <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.nome || 'Usuário'}
              </div>
              <div className="user-role" style={{ fontSize: '10px', marginBottom: '2px', opacity: 0.8 }}>
                {user?.funcao || 'Cargo não informado'}
              </div>
              <div className="user-role" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, fontSize: '10.5px' }}>
                {user?.perfil === 'ADMIN'
                  ? <><i className="bi bi-shield-lock-fill" style={{ color: 'var(--warning)', fontSize: 10 }}></i>Administrador</>
                  : <><i className="bi bi-eye-fill"         style={{ color: 'var(--info)',    fontSize: 10 }}></i>Visualizador</>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN ─── */}
      <div className="main-content">

        {/* Topbar */}
        <div className="topbar">
          <div>
            <div className="topbar-title">{page.title}</div>
            <div className="topbar-subtitle">{page.sub}</div>
          </div>

          <div className="topbar-actions">
            {/* Status online */}
            <div className="topbar-chip">
              <div className="status-dot"></div>
              Sistema online
            </div>

            {/* Chip de data/calendário */}
            <div
              className="topbar-chip"
              onClick={abrirCalendario}
              style={{ cursor: 'pointer' }}
              title="Abrir Agenda e Feriados"
            >
              <i className="bi bi-calendar-event" style={{ fontSize: 12, color: 'var(--primary-light)' }}></i>
              <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{now}</span>
            </div>

            {/* Avatar e Logout no topbar */}
            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 12, marginLeft: 4, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar
                nome={user?.nome}
                size={34}
                fontSize={13}
                style={{ cursor: 'pointer' }}
                onClick={() => setShowProfile(true)}
                title="Ver meu perfil"
              />
              
              <button
                onClick={onLogout}
                title="Sair do Sistema"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#f87171',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
              >
                <i className="bi bi-box-arrow-right"></i> Sair
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo das páginas */}
        <div className="page-content">
          <Routes>
            <Route path="/"              element={<Estoque       user={user} />} />
            <Route path="/movimentacoes" element={<Movimentacoes user={user} />} />
            <Route path="/colaboradores" element={<Colaboradores user={user} />} />
            <Route path="/relatorios"    element={<Relatorios    user={user} />} />
            <Route path="/usuarios"      element={<Usuarios      user={user} />} />
            {/* ⬅️ NOVA ROTA DA FICHA DE EPI */}
            <Route path="/colaboradores/ficha/:id" element={<FichaEpi user={user} />} />
          </Routes>
        </div>
      </div>

      {/* ─── MODAL CALENDÁRIO ─── */}
      <Modal
        show={showCalendar}
        onHide={() => setShowCalendar(false)}
        centered size="lg"
        contentClassName="bg-dark border-0"
      >
        <Modal.Header
          closeButton closeVariant="white"
          style={{ background: 'var(--surface-3)', borderBottom: '1px solid var(--border)', borderRadius: '16px 16px 0 0', padding: '14px 20px' }}
        >
          <Modal.Title style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(59,130,246,0.12)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
              <i className="bi bi-calendar-check"></i>
            </div>
            Agenda e Lembretes
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0" style={{ display: 'flex', height: 500, background: 'var(--surface-2)', borderRadius: '0 0 16px 16px', overflow: 'hidden' }}>

          {/* Lado esquerdo: Retiradas pendentes */}
          <div style={{ flex: 1, padding: 24, overflowY: 'auto', borderRight: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                <i className="bi bi-clock-history"></i>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--text-muted)' }}>
                Próximas Retiradas
              </span>
            </div>

            {loadingAgenda ? (
              <div className="text-center mt-5" style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                <i className="bi bi-arrow-repeat d-block mb-2" style={{ fontSize: 24 }}></i>
                Carregando...
              </div>
            ) : agendamentos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 20px', borderRadius: 10, border: '1px dashed var(--border)', background: 'var(--surface-3)' }}>
                <i className="bi bi-calendar-x d-block mb-2" style={{ fontSize: 22, color: 'var(--text-muted)' }}></i>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Nenhuma retirada pendente.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {agendamentos.map(ag => {
                  const data = new Date(ag.data_agendada);
                  const dataFmt = data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                  const horaFmt = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={ag.id} style={{
                      background: 'var(--surface-3)',
                      border: '1px solid var(--border)',
                      borderLeft: '3px solid var(--info)',
                      borderRadius: 10, padding: '14px 16px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: 'var(--info)', fontSize: 13, fontWeight: 700 }}>
                          <i className="bi bi-calendar-event me-1"></i>{dataFmt} às {horaFmt}
                        </span>
                        <span style={{
                          fontSize: 9.5, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                          background: 'rgba(245,158,11,0.1)', color: '#fbbf24',
                          border: '1px solid rgba(245,158,11,0.2)', letterSpacing: '0.5px',
                        }}>PENDENTE</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{ag.material_nome_atual}</div>
                      <div style={{ fontSize: 12, marginTop: 4, color: 'var(--text-secondary)', fontWeight: 500 }}>
                        <i className="bi bi-person-fill me-1" style={{ opacity: 0.6 }}></i>{ag.colaborador_nome}
                        {ag.destino && <span style={{ marginLeft: 8, opacity: 0.6 }}>· {ag.destino}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Lado direito: Feriados */}
          <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                <i className="bi bi-calendar-heart"></i>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--text-muted)' }}>
                Feriados 2026
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {feriados2026.map((f, idx) => {
                const dataFeriado = new Date(f.data + 'T12:00:00');
                const isPassado   = dataFeriado < hoje;
                const diaSemana   = dataFeriado.toLocaleDateString('pt-BR', { weekday: 'long' });
                const diaFmt      = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

                return (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: isPassado ? 'var(--surface-2)' : 'var(--surface-3)',
                    padding: '10px 14px', borderRadius: 8,
                    border: '1px solid var(--border)',
                    borderLeft: isPassado ? '1px solid var(--border)' : `3px solid ${f.cor}`,
                    opacity: isPassado ? 0.5 : 1,
                    transition: '0.15s',
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isPassado ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isPassado ? 'line-through' : 'none' }}>
                        {dataFeriado.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                      </div>
                      <div style={{ fontSize: 11, color: isPassado ? 'var(--text-muted)' : 'var(--primary-light)', fontWeight: 600, marginTop: 1 }}>{diaFmt}</div>
                      <div style={{ fontSize: 11.5, color: isPassado ? 'var(--text-muted)' : 'var(--text-secondary)', fontWeight: 500 }}>{f.nome}</div>
                    </div>
                    <span style={{
                      fontSize: 9.5, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                      background: isPassado ? 'var(--surface-3)' : `${f.cor}14`,
                      color: isPassado ? 'var(--text-muted)' : f.cor,
                      border: isPassado ? '1px solid var(--border)' : `1px solid ${f.cor}38`,
                      letterSpacing: '0.4px',
                    }}>{f.tipo}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </Modal.Body>
      </Modal>

      {/* ─── MODAL PERFIL ─── */}
      <Modal show={showProfile} onHide={() => setShowProfile(false)} centered size="sm" contentClassName="bg-dark border-0">
        <Modal.Header
          closeButton closeVariant="white"
          style={{ background: 'var(--surface-3)', borderBottom: 'none', borderRadius: '16px 16px 0 0', padding: '14px 20px' }}
        >
          <Modal.Title style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="bi bi-person-circle" style={{ color: 'var(--primary-light)', fontSize: 16 }}></i>
            Meu Perfil
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ background: 'var(--surface-2)', textAlign: 'center', padding: '24px 24px 20px' }}>
          {/* Avatar grande */}
          <div style={{
            width: 68, height: 68, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, fontWeight: 800, color: 'white',
            margin: '0 auto 14px',
            border: '3px solid rgba(99,102,241,0.25)',
            boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
          }}>
            {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
          </div>

          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>{user?.nome}</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 18 }}>{user?.funcao || 'Cargo não informado'}</div>

          {/* Info box */}
          <div style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, textAlign: 'left' }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                <i className="bi bi-person-vcard"></i> Login / CPF
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {user?.cpf || '000.000.000-00'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                <i className="bi bi-shield-check"></i> Nível de Acesso
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)' }}>
                {user?.perfil === 'ADMIN' ? (
                  <>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20, background: 'rgba(245,158,11,0.12)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.25)' }}>
                      <i className="bi bi-shield-lock-fill me-1"></i>ADMIN
                    </span>
                    Acesso Total
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20, background: 'rgba(56,189,248,0.12)', color: 'var(--info)', border: '1px solid rgba(56,189,248,0.25)' }}>
                      <i className="bi bi-eye-fill me-1"></i>VISUALIZADOR
                    </span>
                    Somente Leitura
                  </>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer style={{ background: 'var(--surface-1)', borderTop: '1px solid var(--border)', padding: '12px 20px 20px', borderRadius: '0 0 16px 16px' }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%', padding: '10px', borderRadius: 8, border: 'none',
              background: 'rgba(239,68,68,0.1)', color: '#f87171',
              fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              border: '1px solid rgba(239,68,68,0.2)',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'; }}
            onMouseOut={e  => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)';  e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';  }}
          >
            <i className="bi bi-box-arrow-right"></i> Encerrar Sessão
          </button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('@Centriar:user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData, token) => {
    localStorage.setItem('@Centriar:token', token);
    localStorage.setItem('@Centriar:user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <BrowserRouter>
      <Layout onLogout={handleLogout} user={user} />
    </BrowserRouter>
  );
}

export default App;