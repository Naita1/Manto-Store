import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase'; 
import { ProductCard } from '../../components/ProductCard';
import { applyPriceLogic } from '../../utils/offerRules';
import { formatarBRL } from '../../utils/productDistribution';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || ''; 
  
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const removerAcentos = (texto) => {
      return texto ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
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

        const processados = listaProdutos.map(p => applyPriceLogic(p));
        const termoBuscadoLimpo = removerAcentos(query.toLowerCase());

        const produtosFiltrados = processados.filter(produto => {
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
    <div className="mx-auto max-w-350 w-full min-h-[85vh] px-4 py-6 sm:px-6 sm:py-8 md:py-10 text-neutral-100 font-sans">
      <header className="mb-8 md:mb-10 pb-6 border-b border-neutral-800/80">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e50914]" />
          <p className="text-xs font-semibold tracking-wider text-[#e50914] uppercase">
            Busca de Mantos
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-normal text-neutral-100 m-0">
            Resultados para <span className="font-bold text-white">"{query}"</span>
          </h1>

          {!loading && resultados.length > 0 && (
            <span className="text-xs font-medium text-neutral-400 bg-neutral-900 px-3 py-1 rounded-md border border-neutral-800 self-start sm:self-auto">
              {resultados.length} {resultados.length === 1 ? 'manto encontrado' : 'mantos encontrados'}
            </span>
          )}
        </div>
      </header>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 md:py-28 px-4 gap-4 bg-neutral-900/30 rounded-xl border border-neutral-800/50">
          <div className="w-10 h-10 border-2 border-neutral-800 border-t-[#e50914] rounded-full animate-spin" />
          <p className="text-neutral-400 text-xs tracking-wide">
            Buscando mantos...
          </p>
        </div>
      ) : resultados.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 md:py-20 px-4 gap-5 bg-neutral-900/30 rounded-xl border border-neutral-800/50">
          <div className="w-12 h-12 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center text-neutral-400">
            <svg 
              className="w-6 h-6 text-[#e50914]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={1.75}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>

          <div className="max-w-md space-y-1.5">
            <h2 className="text-base font-semibold text-white">
              Nenhum resultado encontrado
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Não encontramos nenhum manto correspondente a <span className="text-neutral-200 font-medium">"{query}"</span>. Tente buscar pelo nome do clube ou seleção.
            </p>
          </div>

          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-5 py-2.5 bg-[#e50914] hover:bg-[#c00711] text-white font-semibold text-xs tracking-wide rounded-md transition-all duration-200 no-underline mt-2"
          >
            Voltar para a Loja
          </Link>
        </div>
      ) : (
        <main className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6 w-full">
          {resultados.map(produto => (
            <ProductCard 
              key={produto.id}
              id={produto.id}
              title={produto.title} 
              price={formatarBRL(produto.price)}
              oldPrice={produto.hasDiscount ? formatarBRL(produto.originalPrice) : null}
              discountBadge={produto.hasDiscount ? `-${produto.discount}%` : null}
              image={produto.image && produto.image[0] ? produto.image[0] : ''} 
              className="w-full"
            />
          ))}
        </main>
      )}
    </div>
  );
}