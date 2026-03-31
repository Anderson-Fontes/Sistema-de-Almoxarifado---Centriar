import React, { useState } from 'react';
import logoCentriar from '../assets/logo_sem_fundo.png';
import api from '../services/api'; // 💡 Importação da API adicionada aqui

export default function Login({ onLogin }) {
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCpfChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        setCpf(value);
    };

    // 💡 Função handleSubmit atualizada para conectar com o Backend Real
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (cpf.length === 14 && password.length > 0) {
            setLoading(true);
            try {
                // Envia o CPF e a senha para o servidor verificar
                const response = await api.post('/login', { cpf, senha: password });
                
                // Se o servidor autorizar, passa os dados do usuário e o token (crachá)
                onLogin(response.data.user, response.data.token);
            } catch (error) {
                // Se der erro (senha errada, etc), avisa o usuário e tira o loading
                alert(error.response?.data?.error || 'Erro ao conectar. Verifique suas credenciais.');
                setLoading(false);
            }
        } else {
            alert('Preencha CPF e Senha corretamente.');
        }
    };

    return (
        <div className="login-wrapper">

            {/* Orb secundário decorativo */}
            <div className="login-orb-secondary" />

            <div className="login-central-form">

                {/* ── Lado Esquerdo: Logo ── */}
                <div className="logo-container">
                    <div className="logo-ring">
                        <img
                            src={logoCentriar}
                            alt="Logo Centriar Ar Condicionado"
                            className="sketched-logo"
                        />
                    </div>

                    <div className="logo-system-info">
                        <p className="logo-system-name">Centriar ERP</p>
                        <span className="logo-system-badge">
                            <i className="bi bi-circle-fill" />
                            Sistema Ativo
                        </span>
                    </div>
                </div>

                {/* ── Lado Direito: Formulário ── */}
                <div className="login-content-side">

                    <div className="login-header">
                        <p className="login-eyebrow">
                            <i className="bi bi-box-seam" />
                            Acesso ao Sistema
                        </p>
                        <h1 className="form-title">ESTOQUE</h1>
                        <p className="form-subtitle">
                            Faça login para acessar o painel de controle
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3 input-group">
                            <label className="form-label-custom">
                                <i className="bi bi-person-badge" />
                                CPF
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="XXX.XXX.XXX-XX"
                                value={cpf}
                                onChange={handleCpfChange}
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="mb-1 input-group">
                            <label className="form-label-custom">
                                <i className="bi bi-shield-lock" />
                                Senha
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="Senha de acesso"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                                <i
                                    className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'} toggle-password`}
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-access"
                            disabled={loading}
                        >
                            <span className="btn-access-inner">
                                {loading ? (
                                    <>
                                        <i className="bi bi-arrow-repeat" style={{ animation: 'spin-slow 0.8s linear infinite' }} />
                                        Verificando...
                                    </>
                                ) : (
                                    <>
                                        Acessar
                                        <i className="bi bi-arrow-right" />
                                    </>
                                )}
                            </span>
                        </button>

                    </form>

                    <div className="login-footer">
                        <span className="login-footer-text">
                            <i className="bi bi-circle-fill" />
                            Conexão segura
                        </span>
                        <span className="login-footer-version">v3.0.0</span>
                    </div>

                </div>
            </div>
        </div>
    );
}