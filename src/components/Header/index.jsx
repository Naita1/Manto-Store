import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const Logo = () => (
    <div className="logo-container">
      <span className="logo-manto">Manto</span>
      <span className="logo-store">STORE</span>
    </div>
  );

  const handleUserClick = () => {
    if (user) {
      navigate('/profile'); 
    } else {
      navigate('/login'); 
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); 
    }
  };

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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>

      <div className="header-icons">
        <button 
          onClick={handleUserClick} 
          className="icon-circle" 
          aria-label={user ? "Perfil" : "Login"}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
        
        <Link to="/cart" className="icon-circle" aria-label="Carrinho">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </Link>

        <Link to="/help" className="icon-circle" aria-label="Ajuda">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </Link>
      </div>

    </header>
  );
}