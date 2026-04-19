import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase'; 
import { ProductCard } from '../../components/ProductCard';

import './Search.css';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || ''; 
  
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const removerAcentos = (texto) => {
      return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    async function buscarResultados() {
      setLoading(true);
      try {
        const produtosRef = collection(db, 'produtos');
        const snapshot = await getDocs(produtosRef);
        
        const listaProdutos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() 
        }));

        const termoBuscadoLimpo = removerAcentos(query.toLowerCase());

        const produtosFiltrados = listaProdutos.filter(produto => {
          if (!produto.title) return false;
          const tituloProdutoLimpo = removerAcentos(produto.title.toLowerCase());
          return tituloProdutoLimpo.includes(termoBuscadoLimpo);
        });
        
        setResultados(produtosFiltrados);
      } catch (error) {
        console.error("Erro ao buscar resultados:", error);
      } finally {
        setLoading(false);
      }
    }

    if (query) {
      buscarResultados();
    } else {
      setResultados([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="search-page-container">
      <header className="search-header">
        <p className="search-subtitle">Resultados encontrados</p>
        <h2>Busca por: <span>"{query}"</span></h2>
      </header>
      
      {loading ? (
        <div className="search-status-container">
          <div className="loader"></div>
          <p>Buscando mantos...</p>
        </div>
      ) : resultados.length === 0 ? (
        <div className="search-status-container">
          <p>Nenhum manto encontrado para "{query}".</p>
          <a href="/" className="back-home-link">Voltar ao Início</a>
        </div>
      ) : (
        <main className="results-grid">
          {resultados.map(produto => (
            <div key={produto.id} className="product-card-wrapper">
              <ProductCard 
                id={produto.id}
                title={produto.title} 
                price={produto.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                image={produto.image && produto.image[0] ? produto.image[0] : ''} 
              />
            </div>
          ))}
        </main>
      )}
    </div>
  );
}