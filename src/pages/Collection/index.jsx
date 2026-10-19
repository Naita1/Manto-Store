import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, limit, query, startAfter } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { ProductCard } from '../../components/ProductCard';
import { Loading } from '../../components/Loading';
import { applyPriceLogic } from '../../utils/offerRules';
import { distribuirProdutos } from '../../utils/productDistribution';

const PAGE_SIZE = 10;

export function CollectionPage() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [produtosCarregados, setProdutosCarregados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
    const requestIdRef = useRef(0);

    let produtos = [];
    switch (id) {
        case 'os-mais-desejados':
            produtos = produtosCarregados.slice(0, 20);
            break;

        case 'ofertas-de-tempo-limitado':
            produtos = produtosCarregados.filter(p => p.hasDiscount);
            break;

        case 'lancamentos':
            produtos = produtosCarregados.filter(p => p.title?.includes('2026')).slice(0, 20);
            break;

        case 'colecao-completa':
            produtos = distribuirProdutos(produtosCarregados).outras;
            break;

        default:
            produtos = produtosCarregados.filter(p =>
                p.title?.toUpperCase().includes(id.toUpperCase())
            );
    }

    const getPageTitle = () => {
        if (id === 'os-mais-desejados') return { tag: 'TRENDING', main: 'OS MAIS', sub: 'DESEJADOS' };
        if (id === 'ofertas-de-tempo-limitado') return { tag: 'OFFERS', main: 'MELHORES', sub: 'OFERTAS' };
        if (id === 'lancamentos') return { tag: 'NEW ARRIVALS', main: 'DROP', sub: 'LANÇAMENTOS' };
        if (id === 'colecao-completa') return { tag: 'COMPLETE ARCHIVE', main: 'COLEÇÃO', sub: 'COMPLETA' };
        return { tag: 'EDITION LIMITED', main: 'RELEASE', sub: id };
    };

    const displayTitle = getPageTitle();

    useEffect(() => {
        window.scrollTo(0, 0);
        const requestId = ++requestIdRef.current;
        let active = true;

        setProdutosCarregados([]);
        setLastVisibleDoc(null);
        setHasMore(false);
        setLoading(true);
        setLoadingMore(false);

        async function fetchCollection() {
            try {
                const querySnapshot = await getDocs(query(
                    collection(db, 'produtos'),
                    limit(PAGE_SIZE),
                ));
                if (!active || requestId !== requestIdRef.current) return;

                let novosProdutos = querySnapshot.docs.map(doc => ({
                    id: doc.id, 
                    ...doc.data() 
                })).map(p => applyPriceLogic(p));
                if (id === 'os-mais-desejados') {
                    novosProdutos = novosProdutos.sort(() => Math.random() - 0.5);
                }

                setProdutosCarregados(novosProdutos);
                setLastVisibleDoc(querySnapshot.docs.at(-1) || null);
                setHasMore(querySnapshot.docs.length === PAGE_SIZE);
            } catch (error) {
                console.error("Erro ao carregar coleção:", error);
            } finally {
                if (active && requestId === requestIdRef.current) {
                    setLoading(false);
                }
            }
        }
        fetchCollection();

        return () => {
            active = false;
        };
    }, [id]);

    const carregarMais = async () => {
        if (!hasMore || !lastVisibleDoc || loadingMore) return;

        const requestId = requestIdRef.current;
        setLoadingMore(true);
        try {
            const querySnapshot = await getDocs(query(
                collection(db, 'produtos'),
                startAfter(lastVisibleDoc),
                limit(PAGE_SIZE),
            ));
            if (requestId !== requestIdRef.current) return;

            let novosProdutos = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })).map(p => applyPriceLogic(p));
            if (id === 'os-mais-desejados') {
                novosProdutos = novosProdutos.sort(() => Math.random() - 0.5);
            }

            setProdutosCarregados(produtosAtuais => [...produtosAtuais, ...novosProdutos]);
            setLastVisibleDoc(querySnapshot.docs.at(-1) || lastVisibleDoc);
            setHasMore(querySnapshot.docs.length === PAGE_SIZE);
        } catch (error) {
            console.error("Erro ao carregar mais produtos da coleção:", error);
        } finally {
            if (requestId === requestIdRef.current) {
                setLoadingMore(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-neutral-100 relative font-sans antialiased selection:bg-[#9C2A32] selection:text-white">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-linear-to-b from-neutral-800/15 via-transparent to-transparent pointer-events-none transform-gpu" />
            <div className="border-b border-neutral-800/80 bg-[#09090b]/90 backdrop-blur-md sticky top-0 z-30">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-xs text-neutral-400">
                    <nav className="flex items-center gap-2 uppercase tracking-wider text-[11px] font-medium">
                        <span 
                            onClick={() => navigate('/')} 
                            className="hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                            Home
                        </span>
                        <span className="text-neutral-700">/</span>
                        <span className="text-neutral-400">Coleções</span>
                        <span className="text-neutral-700">/</span>
                        <span className="text-[#9C2A32] font-semibold">{displayTitle.main} {displayTitle.sub}</span>
                    </nav>

                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-neutral-900 text-neutral-300 border border-neutral-800">
                            {loading ? 'Buscando...' : `${produtos.length} Mantos`}
                        </span>
                    </div>
                </div>
            </div>
            <header className="py-8 border-b border-neutral-800/50">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#9C2A32]"></span>
                            <span className="text-[10px] sm:text-xs font-bold text-[#9C2A32] tracking-[0.25em] uppercase">
                                {displayTitle.tag}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white flex flex-wrap gap-x-3 items-baseline">
                            <span>{displayTitle.main}</span>
                            <span className="text-neutral-500 font-light">{displayTitle.sub}</span>
                        </h1>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-400 max-w-md leading-relaxed font-normal">
                        Seleção exclusiva dos mantos sagrados da temporada. Performance, autenticidade e design em nível máximo.
                    </p>
                </div>
            </header>
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-800/60 text-xs text-neutral-400">
                    <span className="font-medium text-neutral-300">
                        Exibindo catálogo completo (<b className="text-white font-bold">{produtos.length}</b> mantos)
                    </span>
                    <span className="hidden sm:inline-block text-neutral-500 tracking-widest text-[10px] uppercase font-semibold">
                        TEMPORADA 2026
                    </span>
                </div>
                <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 min-h-100">
                    {loading ? (
                        <div className="col-span-full w-full py-24 flex justify-center items-center">
                            <Loading message="Carregando catálogo de mantos..." />
                        </div>
                    ) : produtos.length === 0 && !hasMore ? (
                        <div className="col-span-full py-20 text-center text-neutral-500 text-sm">
                            Nenhum manto encontrado nesta coleção.
                        </div>
                    ) : produtos.map(p => (
                        <div
                            className="w-full flex transition-transform duration-200 ease-out hover:-translate-y-1 transform-gpu will-change-transform"
                            key={p.id}
                        >
                            <ProductCard
                                id={p.id}
                                title={p.title}
                                price={p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                oldPrice={p.hasDiscount ? p.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : null}
                                discountBadge={p.hasDiscount ? `-${p.discount}%` : null}
                                image={p.image?.[0] || ''}
                            />
                        </div>
                    ))}
                </div>
                {!loading && hasMore && (
                    <div className="flex justify-center pt-8">
                        <button
                            type="button"
                            onClick={carregarMais}
                            disabled={loadingMore}
                            className="inline-flex items-center gap-2 rounded-md bg-[#9C2A32] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7f2028] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loadingMore && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
                            {loadingMore ? 'Carregando...' : 'Carregar mais'}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}