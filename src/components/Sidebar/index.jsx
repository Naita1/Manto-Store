import { useState } from 'react';
import './Sidebar.css';

export function Sidebar({ menuFiltros, filtroPais, filtroTime, aoFiltrar, aberta, setAberta }) {
      const [paisExpandido, setPaisExpandido] = useState(null);

//   const togglePais = (pais) => {
//     setPaisExpandido(paisExpandido === pais ? null : pais);
//   };

return (
    <aside className={`sidebar-container ${aberta ? 'aberta' : ''}`}>
      <div className="sidebar-header">
        <h3 className="sidebar-title">Filtros</h3>
        <button className="btn-fechar-sidebar" onClick={() => setAberta(false)}>✕</button>
      </div>

      <nav className="sidebar-content">
        <button 
          className={`sidebar-main-btn ${filtroPais === 'Todos' ? 'active' : ''}`}
          onClick={() => { aoFiltrar('Todos'); setPaisExpandido(null); }}
        >
          Todas as Camisas
        </button>

        {Object.keys(menuFiltros).sort().map(pais => (
          <div key={pais} className="sidebar-group">
            <div 
              className={`sidebar-pais-label ${paisExpandido === pais ? 'active' : ''}`}
              onClick={() => setPaisExpandido(paisExpandido === pais ? null : pais)}
            >
              {pais}
              <span>{paisExpandido === pais ? '−' : '+'}</span>
            </div>
            
            <div className={`sidebar-sub-items ${paisExpandido === pais ? 'expandido' : ''}`}>
              <button onClick={() => aoFiltrar(pais)}>Ver todas de {pais}</button>
              {menuFiltros[pais].sort().map(time => (
                <button 
                  key={time}
                  className={filtroTime === time ? 'active' : ''}
                  onClick={() => aoFiltrar(pais, time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}