import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';

import { ProductCard } from '../../components/ProductCard';
import { Sidebar } from '../../components/Sidebar';
import { Button } from '../../components/Button';
import { applyPriceLogic } from '../../utils/offerRules';

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

  const formatBRL = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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
                price={formatBRL(p.price)}
                oldPrice={p.hasDiscount ? formatBRL(p.originalPrice) : null}
                discountBadge={p.hasDiscount ? `-${p.discount}%` : null}
                image={p.image[0]}
                veioDeFiltro={veioDeFiltro} 
                filtroTimeAtivo={filtroTimeAtivo}
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
  
  const [produtos, setProdutos] = useState([]);
  const [menuFiltros, setMenuFiltros] = useState({});
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
    const fetchData = async () => {
      const produtosRef = collection(db, 'produtos');
      let q = produtosRef;
      
      if (filtros.pais !== 'Todos') {
        q = filtros.time 
          ? query(produtosRef, where('category', '==', filtros.pais), where('team', '==', filtros.time))
          : query(produtosRef, where('category', '==', filtros.pais));
      }
      
      const snapshot = await getDocs(q);
      const docsRaw = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const processados = docsRaw.map(p => applyPriceLogic(p));
      setProdutos(processados);

      if (Object.keys(menuFiltros).length === 0) {
        const novoMenu = {};
        docsRaw.forEach(data => {
          if (data.category) {
            if (!novoMenu[data.category]) novoMenu[data.category] = [];
            if (data.team && !novoMenu[data.category].includes(data.team)) {
              novoMenu[data.category].push(data.team);
            }
          }
        });
        setMenuFiltros(novoMenu);
      }
    };
    fetchData();
  }, [filtros.pais, filtros.time]);

  const handleFiltrar = (pais, time = null) => {
    setFiltros({ pais, time });
    setSidebarAberta(false);
  };

  const isHome = filtros.pais === 'Todos';

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
          {isHome && produtos.some(p => p.hasDiscount) && (
            <ProductSection 
              title="OFERTAS DE TEMPO LIMITADO" 
              produtos={produtos.filter(p => p.hasDiscount)} 
            />
          )}

          <ProductSection 
            title={isHome ? "LANÇAMENTOS" : (filtros.time || filtros.pais).toUpperCase()} 
            produtos={isHome ? produtos.filter(p => !p.hasDiscount) : produtos} 
            isGrid={!isHome} 
            veioDeFiltro={!isHome} 
          />

          {isHome && (
            <ProductSection 
              title="OS MAIS DESEJADOS" 
              produtos={[...produtos].filter(p => !p.hasDiscount).reverse().slice(0, 8)} 
            />
          )}
        </div>
      </main>
    </div>
  );
}