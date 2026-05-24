import { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../../contexts/AuthContext';

const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconHome = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconUser = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconCart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconHelp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const Logo = () => (
  <div className="logo-container">
    <span className="logo-manto">Manto</span>
    <span className="logo-store">STORE</span>
  </div>
);

export function Header() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user }  = useAuth();

  const [searchTerm, setSearchTerm] = useState('');

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleUserClick = useCallback(() => {
    navigate(user ? '/profile' : '/login');
  }, [user, navigate]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSearchTerm('');
  }, [searchTerm, navigate]);

  if (isAuthPage) {
    return (
      <header className="header-container header-login">
        <Link to="/" className="logo-link">
          <Logo />
        </Link>
      </header>
    );
  }

  return (
    <header className="header-container header-home">
      <Link to="/" className="logo-link">
        <Logo />
      </Link>

      <form className="search-container" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="O que você procura?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-button" aria-label="Buscar">
          <IconSearch />
        </button>
      </form>

      <nav className="header-icons">
        <Link to="/" className="icon-circle" aria-label="Início">
          <IconHome />
        </Link>

        <button
          onClick={handleUserClick}
          className="icon-circle"
          aria-label={user ? 'Meu perfil' : 'Entrar'}
        >
          <IconUser />
        </button>

        <Link to="/cart" className="icon-circle" aria-label="Carrinho">
          <IconCart />
        </Link>

        <Link to="/help" className="icon-circle" aria-label="Ajuda">
          <IconHelp />
        </Link>
      </nav>
    </header>
  );
}