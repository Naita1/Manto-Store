import { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const IconSearch = () => (
  <svg 
    className="w-4 h-4 text-neutral-400 group-focus-within:text-primary transition-colors duration-200" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconHome = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconUser = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconCart = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconHelp = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const Logo = () => (
  <div className="flex flex-col items-center justify-center leading-none select-none group">
    <span className="font-serif text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent transform group-hover:scale-105 transition-transform duration-300 ease-out">
      Manto
    </span>
    <span className="text-[10px] md:text-xs font-semibold tracking-[0.35em] text-primary uppercase mt-0.5 group-hover:tracking-[0.45em] transition-all duration-300 ease-out">
      STORE
    </span>
  </div>
);

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

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
      <header className="w-full py-6 px-4 md:px-16 bg-app-bg flex justify-center items-center border-b border-neutral-900/60">
        <Link to="/" className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1">
          <Logo />
        </Link>
      </header>
    );
  }

  const navActions = [
    { id: 'home', label: 'Início', to: '/', icon: <IconHome /> },
    { id: 'profile', label: user ? 'Meu perfil' : 'Entrar', onClick: handleUserClick, icon: <IconUser /> },
    { id: 'cart', label: 'Carrinho', to: '/cart', icon: <IconCart /> },
    { id: 'help', label: 'Ajuda', to: '/help', icon: <IconHelp /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-app-bg/80 backdrop-blur-md border-b border-neutral-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3 md:py-4 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 md:gap-8">
        <Link 
          to="/" 
          className="order-1 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
          aria-label="Página inicial do Manto Store"
        >
          <Logo />
        </Link>
        <form 
          onSubmit={handleSearch} 
          className="order-3 md:order-2 w-full md:w-auto md:flex-1 max-w-lg group relative"
        >
          <div className="relative flex items-center w-full bg-neutral-900/90 border border-neutral-800 rounded-full pl-11 pr-2 py-1.5 text-sm text-app-text transition-all duration-300 ease-out focus-within:border-primary/80 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-neutral-950 shadow-inner">
            <span className="absolute left-4 pointer-events-none flex items-center justify-center">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="O que você procura?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none text-app-text placeholder-neutral-500 text-sm focus:outline-none focus:ring-0"
            />
            <button 
              type="submit" 
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transform hover:scale-105 active:scale-95 transition-all duration-200 ease-out flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Realizar busca"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </form>

        <nav className="order-2 md:order-3 flex items-center gap-2 sm:gap-3">
          {navActions.map((item) => {
            const buttonClasses = "relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-neutral-900/80 border border-neutral-800/80 text-neutral-300 hover:text-white hover:bg-primary hover:border-primary transform hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-200 ease-out shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";

            if (item.to) {
              return (
                <Link key={item.id} to={item.to} className={buttonClasses} aria-label={item.label} title={item.label}>
                  {item.icon}
                </Link>
              );
            }

            return (
              <button key={item.id} onClick={item.onClick} className={buttonClasses} aria-label={item.label} title={item.label}>
                {item.icon}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
}