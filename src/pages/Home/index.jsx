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
import './Home.css';

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
    <section className={`showcase-section ${isGrid ? 'grid-mode' : ''}`}>
      <div className="section-header">
        <h2 className="showcase-title">{title}</h2>
        {!isGrid && produtos.length > 0 && (
          <span className="view-all" onClick={handleViewAll}>VER TUDO</span>
        )}
      </div>
      
      <div className="carousel-wrapper">
        {!isGrid && (
          <button className="carousel-btn left" onClick={() => scroll(-400)}>&#10094;</button>
        )}
        
        <div className="product-row" ref={carouselRef}>
          {produtos.length === 0 ? (
            <p className="empty-msg">Buscando mantos exclusivos...</p>
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
                className={isGrid ? 'w-full' : 'w-36.25 sm:w-45 md:w-52.5 shrink-0'}
              />
            ))
          )}
        </div>

        {!isGrid && (
          <button className="carousel-btn right" onClick={() => scroll(400)}>&#10095;</button>
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
    <div className="home-container">
      <Sidebar 
        menuFiltros={menuFiltros}
        filtroPais={filtros.pais}
        filtroTime={filtros.time}
        aberta={sidebarAberta} 
        setAberta={setSidebarAberta} 
        aoFiltrar={handleFiltrar}
      />
      
      <main className={`main-content ${sidebarAberta ? 'menu-ativo' : ''}`}>
        <section className="home-banner" style={{ backgroundImage: `url(${banner})` }}>
          <div className="banner-content">
            <h1>TEMPORADA 2026</h1>
            <p>Os novos mantos chegaram com tecnologia de ponta.</p>
            <button className="banner-cta" onClick={() => navigate('/colecao/2026')}>
              CONFIRA A COLEÇÃO
            </button>
          </div>
        </section>
        
        <div className="filter-bar">
          <Button className="btn-filtros" onClick={() => setSidebarAberta(true)}>
            <span className="icon">☰</span> FILTRAR PRODUTOS
          </Button>
        </div>

        {isHome && (
          <div className="benefits-bar">
            {['COMPRA SEGURA', '1ª TROCA GRÁTIS', '12X NO CARTÃO'].map(item => (
              <div key={item} className="benefit-item">{item}</div>
            ))}
          </div>
        )}

        <div className="products-container">  
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