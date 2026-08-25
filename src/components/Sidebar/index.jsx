import { useState } from 'react';

function CountryGroup({ 
  pais, 
  times, 
  isExpanded, 
  onToggle, 
  isTimeActive, 
  onFilterChange 
}) {
  return (
    <div className="border-b border-white/6 last:border-b-0">
      <div 
        className={`w-full flex justify-between items-center text-xs font-semibold tracking-wider uppercase py-3.5 cursor-pointer transition-colors duration-200 select-none ${
          isExpanded ? 'text-white' : 'text-neutral-400 hover:text-white'
        }`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      >
        <span>{pais}</span>
        <span 
          aria-hidden="true" 
          className={`font-mono text-sm transition-colors duration-200 ${
            isExpanded ? 'text-[#9C2A32]' : 'text-neutral-500'
          }`}
        >
          {isExpanded ? '−' : '+'}
        </span>
      </div>
      <div 
        className={`grid transition-all duration-300 ease-out overflow-hidden ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0 flex flex-col pl-3 pb-3 gap-0.5">
          <button 
            className="text-left bg-transparent border-none text-[11px] font-semibold tracking-wide text-[#9C2A32] hover:text-[#88242B] py-1.5 transition-colors duration-150 cursor-pointer uppercase" 
            onClick={() => onFilterChange(pais)}
          >
            Ver todas de {pais}
          </button>
          {times.map(time => (
            <button 
              key={time}
              className={`text-left bg-transparent border-none text-xs py-1.5 transition-all duration-150 cursor-pointer ${
                isTimeActive(time) 
                  ? 'text-white font-semibold translate-x-1' 
                  : 'text-neutral-500 hover:text-neutral-200 hover:translate-x-1'
              }`}
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
    <aside 
      className={`fixed top-0 left-0 w-[300px] h-screen bg-[#0B0B0D] border-r border-white/8 z-[2000] flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.6)] transform-gpu transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        aberta ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="px-6 py-5 flex items-center justify-between border-b border-white/8 bg-[#131316]/60">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 m-0">
          Filtros
        </h3>
        <button 
          className="text-neutral-400 hover:text-[#9C2A32] text-base font-light transition-colors duration-150 bg-transparent border-none cursor-pointer p-1 -mr-1 leading-none" 
          onClick={() => setAberta(false)}
          aria-label="Fechar filtros"
        >
          ✕
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <button 
          className={`w-full text-left bg-transparent border-none text-xs font-semibold uppercase tracking-wider pb-4 mb-2 border-b border-white/8 transition-colors duration-200 cursor-pointer ${
            filtroPais === 'Todos' ? 'text-[#9C2A32]' : 'text-neutral-300 hover:text-white'
          }`}
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