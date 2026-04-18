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
    <div style={{ padding: '2rem', minHeight: '60vh', color: '#fff' }}>
      <h2>Resultados da busca por: "{query}"</h2>
      
      {loading ? (
        <p>Buscando produtos...</p>
      ) : resultados.length === 0 ? (
        <p>Nenhum produto encontrado para esse termo.</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '1.5rem', 
          marginTop: '2rem' 
        }}>
          {resultados.map(produto => (
            <ProductCard 
              key={produto.id} 
              id={produto.id}
              title={produto.title} 
              price={produto.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              image={produto.image && produto.image[0] ? produto.image[0] : ''} 
            />
          ))}
        </div>
      )}
    </div>
  );
}