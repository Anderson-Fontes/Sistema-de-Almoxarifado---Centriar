import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';

// Importação das Páginas
import Estoque from './pages/Estoque';
import Movimentacoes from './pages/Movimentacoes';
import Colaboradores from './pages/Colaboradores';
import Relatorios from './pages/Relatorios';
import Login from './pages/Login'; // 💡 Importação da nova tela de Login

// Importação da logo
import logoCentriar from './assets/logo_sem_fundo.png'; 

const navItems = [
  { to: '/',           icon: 'bi-box-seam',         label: 'Estoque Atual'  },
  { to: '/movimentacoes',  icon: 'bi-arrow-left-right', label: 'Movimentações' },
  { to: '/colaboradores',  icon: 'bi-people',           label: 'Colaboradores' },
  { to: '/relatorios',     icon: 'bi-graph-up-arrow',   label: 'Relatórios'    },
];

const pageTitles = {
  '/':               { title: 'Estoque Atual',   sub: 'Inventário e controle de materiais' },
  '/movimentacoes':  { title: 'Movimentações',   sub: 'Histórico de retiradas e devoluções' },
  '/colaboradores':  { title: 'Colaboradores',   sub: 'Gerenciamento de equipe' },
  '/relatorios':     { title: 'Relatórios',      sub: 'Análises e exportações' },
};

// 💡 Passamos a função onLogout como propriedade para o Layout
function Layout({ onLogout }) {
  const location = useLocation();
  const page = pageTitles[location.pathname] || pageTitles['/'];
  const now = new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });

  return (
    <div className="app-container">
      {/* ─── SIDEBAR ─── */}
      <div className="sidebar">
        
        {/* ─── LOGO OFICIAL ─── */}
        <div className="sidebar-logo" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '20px 10px', 
          borderBottom: '1px solid rgba(255,255,255,0.05)' 
        }}>
          <img 
            src={logoCentriar} 
            alt="Centriar Ar Condicionado" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '90px', 
              objectFit: 'contain' 
            }} 
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
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon} nav-icon`}></i>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">C</div>
            <div>
              <div className="user-name">CENTRIAR</div>
              <div className="user-role">Administrador</div>
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
            <div className="topbar-chip">
              <div className="status-dot"></div>
              Sistema online
            </div>
            <div className="topbar-chip">
              <i className="bi bi-calendar3" style={{ fontSize: 11 }}></i>
              {now}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid var(--border)', paddingLeft: '12px', marginLeft: '4px' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'white',
                  border: '2px solid rgba(99,102,241,0.3)',
                  cursor: 'pointer'
                }}>
                  C
                </div>
                {/* 💡 Botão de Logout adicionado ao Header */}
                <button onClick={onLogout} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px', padding: '4px 8px', borderRadius: '6px' }} title="Sair do Sistema">
                    <i className="bi bi-box-arrow-right"></i> Sair
                </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Estoque />} />
            <Route path="/movimentacoes" element={<Movimentacoes />} />
            <Route path="/colaboradores" element={<Colaboradores />} />
            <Route path="/relatorios" element={<Relatorios />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  // 💡 Estado Central de Autenticação (Falso por padrão para exibir o Login primeiro)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 💡 Se não estiver autenticado, exibe a tela de Login
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  // 💡 Se estiver autenticado, exibe o sistema com as rotas
  return (
    <BrowserRouter>
      <Layout onLogout={() => setIsAuthenticated(false)} />
    </BrowserRouter>
  );
}

export default App;