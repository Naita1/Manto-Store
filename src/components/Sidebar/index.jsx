import { useState } from 'react';
import './Sidebar.css';

function CountryGroup({ 
  pais, 
  times, 
  isExpanded, 
  onToggle, 
  isTimeActive, 
  onFilterChange 
}) {
  return (
    <div className="sidebar-group">
      <div 
        className={`sidebar-pais-label ${isExpanded ? 'active' : ''}`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      >
        {pais}
        <span aria-hidden="true">{isExpanded ? '−' : '+'}</span>
      </div>
      <div className={`sidebar-sub-items ${isExpanded ? 'expandido' : ''}`}>
        <div className="sidebar-sub-wrapper">
          <button 
            className="btn-ver-todos" 
            onClick={() => onFilterChange(pais)}
          >
            Ver todas de {pais}
          </button>
          {times.map(time => (
            <button 
              key={time}
              className={isTimeActive(time) ? 'active' : ''}
              onClick={() => onFilterChange(pais, time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ 
  menuFiltros, 
  filtroPais, 
  filtroTime, 
  aoFiltrar, 
  aberta, 
  setAberta 
}) {
  const [paisExpandido, setPaisExpandido] = useState(null);

  const handleFilterChange = (pais, time = null) => {
    aoFiltrar(pais, time);
    if (time === null) {
      setPaisExpandido(null);
    }
  };

  const toggleCountryExpansion = (pais) => {
    setPaisExpandido(paisExpandido === pais ? null : pais);
  };

  const isTimeActive = (time) => filtroTime === time;

  return (
    <aside className={`sidebar-container ${aberta ? 'aberta' : ''}`}>
      <div className="sidebar-header">
        <h3 className="sidebar-title">Filtros</h3>
        <button 
          className="btn-fechar-sidebar" 
          onClick={() => setAberta(false)}
          aria-label="Fechar filtros"
        >
          ✕
        </button>
      </div>

      <nav className="sidebar-content">
        <button 
          className={`sidebar-main-btn ${filtroPais === 'Todos' ? 'active' : ''}`}
          onClick={() => handleFilterChange('Todos')}
        >
          Todas as Camisas
        </button>

        {Object.keys(menuFiltros).sort().map(pais => (
          <CountryGroup
            key={pais}
            pais={pais}
            times={menuFiltros[pais].sort()}
            isExpanded={paisExpandido === pais}
            onToggle={() => toggleCountryExpansion(pais)}
            isTimeActive={isTimeActive}
            onFilterChange={handleFilterChange}
          />
        ))}
      </nav>
    </aside>
  );
}