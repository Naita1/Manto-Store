import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { ProductCard } from '../../components/ProductCard';
import './Collection.css';

export function CollectionPage() {
    const { year } = useParams();
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        async function fetchCollection() {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'produtos'));
            const lista = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(p => p.title.toUpperCase().includes(year));
            setProdutos(lista);
            setLoading(false);
        }
        fetchCollection();
    }, [year]);

    return (
        <div className="collection-premium-wrapper">
            <div className="ambient-glow"></div>                    
            <header className="hero-release">
                <div className="hero-container">
                    <nav className="breadcrumb-minimal">
                        <span onClick={() => navigate('/')}>HOME</span> 
                        <span className="dot">•</span> 
                        <span className="active">RELEASE {year}</span>
                    </nav>
                    
                    <div className="hero-content">
                        <span className="tagline">EDITION LIMITED</span>
                        <h1 className="title-display">NEW DROP <span>{year}</span></h1>
                        <p className="description">Explore a nova engenharia dos mantos sagrados. Performance e design em nível máximo.</p>
                    </div>
                </div>
            </header>

            <main className="search-page-container collection-view">
                <div className="collection-stats">
                    <span className="line"></span>
                    <span className="label"><b>{produtos.length}</b> MANTOS DISPONÍVEIS</span>
                    <span className="line"></span>
                </div>

                <div className="results-grid">
                    {loading ? (
                        <div className="search-status-container">
                            <div className="loader"></div>
                        </div>
                    ) : (
                        produtos.map(p => (
                            <div className="product-card-wrapper" key={p.id}>
                                <ProductCard 
                                    id={p.id}
                                    title={p.title}
                                    price={p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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