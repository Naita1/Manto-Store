import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase'; 
import { ProductCard } from '../../components/ProductCard';
import './Home.css';
import banner from '../../assets/Manto.png'

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

      <section className="showcase-section">
        <h2 className="showcase-title">NOVIDADES DA LOJA</h2>
        <div className="product-row">
          
          {produtos.length === 0 ? (
            <p style={{ color: '#FFF' }}>Carregando produtos da nuvem...</p>
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
      </section>

    </div>
  );
}