import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { ProductCard } from '../../components/ProductCard';
import { Loading } from '../../components/Loading';
import { applyPriceLogic } from '../../utils/offerRules';
import { distribuirProdutos } from '../../utils/productDistribution';
import './Collection.css';

export function CollectionPage() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);

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
        async function fetchCollection() {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'produtos'));
                const todosOsProdutos = querySnapshot.docs.map(doc => ({ 
                    id: doc.id, 
                    ...doc.data() 
                })).map(p => applyPriceLogic(p));

                let listaFiltrada = [];

                switch (id) {
                    case 'os-mais-desejados':
                        listaFiltrada = [...todosOsProdutos].sort(() => Math.random() - 0.5).slice(0, 20);
                        break;
                    
                    case 'ofertas-de-tempo-limitado':
                        listaFiltrada = todosOsProdutos.filter(p => p.hasDiscount);
                        break;

                    case 'lancamentos':
                        listaFiltrada = todosOsProdutos.filter(p => p.title.includes('2026')).slice(0, 20);
                        break;

                    case 'colecao-completa':
                        const distribuicao = distribuirProdutos(todosOsProdutos);
                        listaFiltrada = distribuicao.outras;
                        break;

                    default:
                        listaFiltrada = todosOsProdutos.filter(p => 
                            p.title.toUpperCase().includes(id.toUpperCase())
                        );
                }

                setProdutos(listaFiltrada);
            } catch (error) {
                console.error("Erro ao carregar coleção:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCollection();
    }, [id]);

    return (
        <div className="collection-premium-wrapper">
            <div className="ambient-glow"></div>                    
            <header className="hero-release">
                <div className="hero-container">
                    <nav className="breadcrumb-minimal">
                        <span onClick={() => navigate('/')}>HOME</span> 
                        <span className="dot">•</span> 
                        <span className="active">{displayTitle.main} {displayTitle.sub}</span>
                    </nav>
                    
                    <div className="hero-content">
                        <span className="tagline">{displayTitle.tag}</span>
                        <h1 className="title-display">
                            {displayTitle.main} <span>{displayTitle.sub}</span>
                        </h1>
                        <p className="description">Explore a nova engenharia dos mantos sagrados. Performance e design em nível máximo.</p>
                    </div>
                </div>
            </header>

            <main className="search-page-container collection-view">
                <div className="collection-stats">
                    <span className="line"></span>
                    <span className="label">
                        {loading ? (
                            <span>BUSCANDO PRODUTOS...</span>
                        ) : (
                            <span><b>{produtos.length}</b> MANTOS DISPONÍVEIS</span>
                        )}
                    </span>
                    <span className="line"></span>
                </div>

                <div className="results-grid" style={{ position: 'relative' }}>
                    {loading ? (
                        <div className="search-status-container" style={{ width: '100%', gridColumn: '1 / -1' }}>
                            <Loading message="Carregando catálogo de mantos..." />
                        </div>
                    ) : (
                        produtos.map(p => (
                        <div className="product-card-wrapper" key={p.id}>
                            <ProductCard 
                                id={p.id}
                                title={p.title}
                                price={p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                oldPrice={p.hasDiscount ? p.originalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : null}
                                discountBadge={p.hasDiscount ? `-${p.discount}%` : null}
                                image={p.image[0]}
                            />
                        </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}