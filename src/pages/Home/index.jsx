import { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase'; 
import { ProductCard } from '../../components/ProductCard';
import './Home.css';
import banner from '../../assets/Manto.png'

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
        <button className="carousel-btn left" onClick={() => scroll(-400)}>
          &#10094;
        </button>
        
        <div className="product-row" ref={carouselRef}>
          {produtos.length === 0 ? (
            <p style={{ color: '#FFF' }}>Carregando produtos...</p>
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

        <button className="carousel-btn right" onClick={() => scroll(400)}>
          &#10095;
        </button>
      </div>
    </section>
  );
}

export function HomePage() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function buscarProdutos() {
      try {
        const produtosRef = collection(db, 'produtos');
        const snapshot = await getDocs(produtosRef);
        
        const listaProdutos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() 
        }));
        setProdutos(listaProdutos);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    buscarProdutos();
  }, []);

  return (
    <div className="home-container">
      <section
        className="home-banner"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url(${banner})` 
        }}
      ></section>

      <ProductSection 
        title="NOVIDADES DA LOJA" 
        produtos={produtos} 
      />

      <ProductSection 
        title="MAIS VENDIDOS" 
        produtos={[...produtos].reverse()} 
      />

      <ProductSection 
        title="PROMOÇÕES IMPERDÍVEIS" 
        produtos={produtos.slice(0, 5)} 
      />
    </div>
  );
}