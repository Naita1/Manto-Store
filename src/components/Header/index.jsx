// src/components/Header/index.jsx
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export function Header() {
  // Isso descobre em qual página estamos agora
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // O Logo estilizado com texto (Manto em cima, STORE embaixo)
  const Logo = () => (
    <div className="logo-container">
      <span className="logo-manto">Manto</span>
      <span className="logo-store">STORE</span>
    </div>
  );

  // SE ESTIVER NA PÁGINA DE LOGIN: Mostra só o logo centralizado
  if (isLoginPage) {
    return (
      <header className="header-container header-login">
        <Link to="/" className="logo-link">
          <Logo />
        </Link>
      </header>
    );
  }

  // SE ESTIVER NA PÁGINA INICIAL (Ou outras): Mostra o Header completo
  return (
    <header className="header-container header-home">
      
      {/* 1. Logo na Esquerda */}
      <Link to="/" className="logo-link">
        <Logo />
      </Link>

      {/* 2. Barra de Pesquisa no Centro */}
      <div className="search-container">
        <input type="text" className="search-input" placeholder="O que você procura?" />
        <button className="search-button" aria-label="Buscar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      {/* 3. Ícones Redondos na Direita */}
      <div className="header-icons">
        {/* Ícone de Usuário (Leva pro Login) */}
        <Link to="/login" className="icon-circle" aria-label="Login">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </Link>
        
        {/* Ícone de Carrinho */}
        <button className="icon-circle" aria-label="Carrinho">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </button>

        {/* Ícone de Ajuda */}
        <button className="icon-circle" aria-label="Ajuda">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </button>
      </div>

    </header>
  );
}