import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

import { ProductCard } from '../../components/ProductCard';
import { Sidebar } from '../../components/Sidebar';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { applyPriceLogic } from '../../utils/offerRules';
import { 
  distribuirProdutos, 
  extrairMenuFiltros, 
  formatarBRL,
  temProdutosNaCategoria 
} from '../../utils/productDistribution';

import banner from '../../assets/Manto.png';

const ProductSection = ({ title, produtos, isGrid = false, veioDeFiltro = false, filtroTimeAtivo = null }) => {
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const handleViewAll = () => {
    const slug = title
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/\s+/g, '-');

    navigate(`/colecao/${slug}`);
  };

  const scroll = (offset) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!temProdutosNaCategoria(produtos, title)) {
    return null;
  }

  return (
    <section className="max-w-[1650px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 w-full">
      <div className="flex justify-between items-center mb-6 border-b border-neutral-800/60 pb-3">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-6 bg-red-600 rounded-full inline-block shadow-sm shadow-red-600/50"></span>
          <h2 className="text-base sm:text-lg lg:text-xl font-extrabold tracking-widest uppercase text-white">
            {title}
          </h2>
        </div>
        {!isGrid && produtos.length > 0 && (
          <button 
            onClick={handleViewAll}
            className="text-xs sm:text-sm font-extrabold tracking-wider text-red-500 hover:text-red-400 transition-colors uppercase cursor-pointer flex items-center gap-1 group"
          >
            VER TUDO
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        )}
      </div>
      <div className="relative group/carousel">
        {!isGrid && (
          <button 
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-neutral-900/90 text-white border border-neutral-700/60 backdrop-blur-md shadow-xl hover:bg-red-600 hover:border-red-600 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer" 
            onClick={() => scroll(-400)}
            aria-label="Anterior"
          >
            &#10094;
          </button>
        )}
        
        <div 
          className={
            isGrid 
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 py-2" 
              : "flex gap-3 sm:gap-5 overflow-x-auto scrollbar-none scroll-smooth py-2 px-0.5"
          } 
          ref={carouselRef}
        >
          {produtos.length === 0 ? (
            <p className="text-neutral-400 text-sm py-8 text-center w-full">Buscando mantos exclusivos...</p>
          ) : (
            produtos.map(p => (
              <ProductCard 
                key={p.id} 
                id={p.id}
                title={p.title} 
                price={formatarBRL(p.price)}
                oldPrice={p.hasDiscount ? formatarBRL(p.originalPrice) : null}
                discountBadge={p.hasDiscount ? `-${p.discount}%` : null}
                image={p.image[0]}
                veioDeFiltro={veioDeFiltro} 
                filtroTimeAtivo={filtroTimeAtivo}
                className={isGrid ? 'w-full' : 'w-38.75 sm:w-50 md:w-57.5 shrink-0'}
              />
            ))
          )}
        </div>

        {!isGrid && (
          <button 
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-neutral-900/90 text-white border border-neutral-700/60 backdrop-blur-md shadow-xl hover:bg-red-600 hover:border-red-600 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer" 
            onClick={() => scroll(400)}
            aria-label="Próximo"
          >
            &#10095;
          </button>
        )}
      </div>
    </section>
  );
};

export function HomePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const [todosProdutos, setTodosProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  const [filtros, setFiltros] = useState({ 
    pais: state?.filtroPais || 'Todos', 
    time: state?.filtroTime || null 
  });
  const [sidebarAberta, setSidebarAberta] = useState(false);

  useEffect(() => {
    if (state?.filtroPais) {
      setFiltros({ pais: state.filtroPais, time: state.filtroTime || null });
    }
  }, [state]);

  useEffect(() => {
    const fetchTodosDados = async () => {
      try {
        const produtosRef = collection(db, 'produtos');
        const snapshot = await getDocs(produtosRef);
        const docsRaw = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const processados = docsRaw.map(p => applyPriceLogic(p));
        
        setTodosProdutos(processados);
      } catch (error) {
        console.error("Erro ao buscar dados do Firebase:", error);
      } finally {
        setCarregando(false);
      }
    };
    
    fetchTodosDados();
  }, []);

  const menuFiltros = useMemo(() => {
    return extrairMenuFiltros(todosProdutos);
  }, [todosProdutos]);

  const produtosFiltrados = useMemo(() => {
    return todosProdutos.filter(produto => {
      const batePais = filtros.pais === 'Todos' || produto.category === filtros.pais;
      const bateTime = !filtros.time || produto.team === filtros.time;
      return batePais && bateTime;
    });
  }, [todosProdutos, filtros.pais, filtros.time]);

  const handleFiltrar = (pais, time = null) => {
    setFiltros({ pais, time });
    setSidebarAberta(false);
  };

  const isHome = filtros.pais === 'Todos';

  if (carregando) {
    return <Loading message="Buscando mantos exclusivos..." />;
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-neutral-950 text-neutral-100 selection:bg-red-600 selection:text-white pb-16 overflow-x-hidden">
      <Sidebar 
        menuFiltros={menuFiltros}
        filtroPais={filtros.pais}
        filtroTime={filtros.time}
        aberta={sidebarAberta} 
        setAberta={setSidebarAberta} 
        aoFiltrar={handleFiltrar}
      />
      
      <main className={`flex-1 min-w-0 flex flex-col w-full transition-transform duration-500 ease-in-out ${sidebarAberta ? 'translate-x-0' : ''}`}>
        
        <section 
          className="relative h-85 sm:h-115 lg:h-130 w-full bg-cover bg-center flex items-center px-6 sm:px-12 lg:px-20 overflow-hidden shadow-2xl"
          style={{ backgroundImage: `url(${banner})` }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-neutral-950 via-neutral-950/75 to-transparent z-0" />
          
          <div className="relative z-10 max-w-xl text-white space-y-3 sm:space-y-4">
            <span className="inline-block px-3 py-1 bg-red-600/90 text-[10px] sm:text-xs font-black tracking-widest uppercase rounded-sm shadow-md">
              Nova Coleção
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase text-white">
              TEMPORADA 2026
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-neutral-300 font-light leading-relaxed max-w-md">
              Os novos mantos chegaram com tecnologia de ponta.
            </p>
            <button 
              className="mt-2 px-6 py-3 sm:px-8 sm:py-3.5 bg-red-600 hover:bg-white text-white hover:text-neutral-950 font-extrabold tracking-widest text-xs sm:text-sm uppercase rounded-sm transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-red-900/30 cursor-pointer"
              onClick={() => navigate('/colecao/2026')}
            >
              CONFIRA A COLEÇÃO
            </button>
          </div>
        </section>
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden md:block">
          <button 
            onClick={() => setSidebarAberta(true)}
            className="group relative flex items-center h-12 w-12 hover:w-56 bg-neutral-900/90 backdrop-blur-md text-white border border-l-0 border-neutral-700/60 rounded-r-xl shadow-2xl transition-all duration-300 ease-out overflow-hidden cursor-pointer hover:bg-red-600 hover:border-red-600"
          >
            <span className="min-w-12 h-12 flex items-center justify-center text-lg">☰</span>
            <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap text-xs font-bold tracking-widest uppercase transition-opacity duration-300 pr-4">
              FILTRAR PRODUTOS
            </span>
          </button>
        </div>
        <div className="px-4 mt-4 md:hidden">
          <Button 
            className="w-full py-3 bg-neutral-900 border border-neutral-800 text-white font-bold text-xs tracking-widest uppercase rounded-lg shadow-md flex items-center justify-center gap-2 active:bg-neutral-800"
            onClick={() => setSidebarAberta(true)}
          >
            <span className="text-base">☰</span> FILTRAR PRODUTOS
          </Button>
        </div>
        {isHome && (
          <div className="w-full bg-neutral-900/50 backdrop-blur-md border-y border-neutral-800/80 py-4 px-4 my-2">
            <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-6 sm:gap-12 md:gap-16">
              {['COMPRA SEGURA', '1ª TROCA GRÁTIS', '12X NO CARTÃO'].map(item => (
                <div key={item} className="flex items-center gap-2 text-[11px] sm:text-xs font-extrabold tracking-widest text-neutral-300 uppercase hover:text-white transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-sm shadow-red-600/50"></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="w-full">  
          {isHome && (() => {
            const distribuicao = distribuirProdutos(produtosFiltrados);
            
            return (
              <>
                {distribuicao.ofertas.length > 0 && (
                  <ProductSection 
                    title="OFERTAS DE TEMPO LIMITADO" 
                    produtos={distribuicao.ofertas} 
                  />
                )}

                <ProductSection 
                  title="LANÇAMENTOS" 
                  produtos={distribuicao.lancamentos} 
                />

                {distribuicao.maisDesejados.length > 0 && (
                  <ProductSection 
                    title="OS MAIS DESEJADOS" 
                    produtos={distribuicao.maisDesejados} 
                  />
                )}

                {distribuicao.outras.length > 0 && (
                  <ProductSection 
                    title="COLEÇÃO COMPLETA" 
                    produtos={distribuicao.outras} 
                  />
                )}
              </>
            );
          })()}

          {!isHome && (
            <ProductSection 
              title={(filtros.time || filtros.pais).toUpperCase()} 
              produtos={produtosFiltrados} 
              isGrid={true} 
              veioDeFiltro={true} 
              filtroTimeAtivo={filtros.time}
            />
          )}
        </div>
      </main>
    </div>
  );
}