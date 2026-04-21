import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase'; 
import { useState, useEffect, useRef } from 'react';
import { ProductCard } from '../../components/ProductCard';
import { Sidebar } from '../../components/Sidebar'; 
import { Button } from '../../components/Button'; 
import banner from '../../assets/Manto.png'
import './Home.css';


function ProductSection({ title, produtos }) {
  const carouselRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  return (
    <section className="showcase-section">
      <h2 className="showcase-title">{title}</h2>
      
      <div className="carousel-wrapper">
        <button className="carousel-btn left" onClick={() => scroll(-400)}>&#10094;</button>
        
        <div className="product-row" ref={carouselRef}>
          {produtos.length === 0 ? (
            <p style={{ color: '#FFF' }}>Nenhum produto encontrado...</p>
          ) : (
            produtos.map(produto => (
              <ProductCard 
                key={produto.id} 
                id={produto.id}
                title={produto.title} 
                price={produto.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                image={produto.image[0]} 
              />
            ))
          )}
        </div>

        <button className="carousel-btn right" onClick={() => scroll(400)}>&#10095;</button>
      </div>
    </section>
  );
}

export function HomePage() {
  const [produtos, setProdutos] = useState([]);
  const [menuFiltros, setMenuFiltros] = useState({});
  const [filtroPais, setFiltroPais] = useState('Todos');
  const [filtroTime, setFiltroTime] = useState(null);
  const [sidebarAberta, setSidebarAberta] = useState(false);

  useEffect(() => {
    async function gerarMenu() {
      const querySnapshot = await getDocs(collection(db, 'produtos'));
      const novoMenu = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const pais = data.category;
        const time = data.team;

        if (pais) {
          if (!novoMenu[pais]) novoMenu[pais] = [];
          if (time && !novoMenu[pais].includes(time)) {
            novoMenu[pais].push(time);
          }
        }
      });
      setMenuFiltros(novoMenu);
    }
    gerarMenu();
  }, []);

  useEffect(() => {
    async function buscarProdutos() {
      const produtosRef = collection(db, 'produtos');
      let q = produtosRef;

      if (filtroPais !== 'Todos') {
        if (filtroTime) {
          q = query(produtosRef, where('category', '==', filtroPais), where('team', '==', filtroTime));
        } else {
          q = query(produtosRef, where('category', '==', filtroPais));
        }
      }

      const snapshot = await getDocs(q);
      const listaProdutos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProdutos(listaProdutos);
    }
    buscarProdutos();
  }, [filtroPais, filtroTime]);

  return (
    <div className="home-container">
      <Sidebar 
          menuFiltros={menuFiltros}
          filtroPais={filtroPais}
          filtroTime={filtroTime}
          aberta={sidebarAberta} 
          setAberta={setSidebarAberta} 
          aoFiltrar={(pais, time = null) => {
            setFiltroPais(pais);
            setFiltroTime(time);
            setSidebarAberta(false);
            if(window.innerWidth < 768) setSidebarAberta(false);
          }}
        />
      <main className={`main-content ${sidebarAberta ? 'menu-ativo' : ''}`}>
      <section
        className="home-banner"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url(${banner})` 
        }}
        ></section>
        
      <div className="filter-bar">
        <Button 
          className="btn-filtros" 
          onClick={() => setSidebarAberta(true)}
        >
          <span className="icon">☰</span> FILTRAR PRODUTOS
        </Button>
      </div>
        <div className="products-container">  

      <ProductSection 
        title={filtroPais === 'Todos' ? "NOVIDADES DA LOJA" : (filtroTime || filtroPais).toUpperCase()} 
        produtos={produtos} 
      />

      {filtroPais === 'Todos' && (
        <>
          <ProductSection 
            title="MAIS VENDIDOS" 
            produtos={[...produtos].reverse()} 
          />

          <ProductSection 
            title="PROMOÇÕES IMPERDÍVEIS" 
            produtos={produtos.slice(0, 5)} 
          />
        </>
      )}
          </div>
        </main>
    </div>
  );
}