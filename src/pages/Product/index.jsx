import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, collection, query, limit, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { Loading } from '../../components/Loading';
import { applyPriceLogic } from '../../utils/offerRules';
import { ShippingCalculator } from '../../components/ShippingCalculator';

import './Product.css';

const FALLBACK_IMAGE = 'https://placehold.co/600x600/1E1E1E/FFFFFF?text=Sem+Imagem';

const ACCORDIONS_DATA = [
  { id: 1, title: "DESCRIÇÃO", contentKey: "description", fallback: "Nenhuma descrição informada para este produto." },
  { id: 2, title: "TABELA DE MEDIDAS", content: "P: 50x70cm | M: 52x72cm | G: 54x74cm | GG: 56x76cm" },
  { id: 3, title: "AVALIAÇÕES", content: "Nenhuma avaliação no momento." },
  { id: 4, title: "DÚVIDAS SOBRE O PRODUTO", content: "Para personalizar, clique no botão 'PERSONALIZE DE GRAÇA'." }
];

const formatCurrency = (value) => value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00';
const handleImageError = (e) => { e.target.src = FALLBACK_IMAGE; };

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [produto, setProduto] = useState(null);
  const [produtosRecomendados, setProdutosRecomendados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagemPrincipal, setImagemPrincipal] = useState('');
  
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('');
  const [querPersonalizar, setQuerPersonalizar] = useState(false);
  const [nomePersonalizado, setNomePersonalizado] = useState('');
  const [numeroPersonalizado, setNumeroPersonalizado] = useState('');
  
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [accordionsAbertos, setAccordionsAbertos] = useState([]);
  
  const carouselRef = useRef(null);

  const listaImagens = produto?.image?.length > 0 ? produto.image : [FALLBACK_IMAGE];
  const tamanhosDisponiveis = produto?.sizes || [];
  
  const veioDeFiltro = location.state?.veioDeFiltro;
  const filtroTimeAtivo = location.state?.filtroTimeAtivo; 
  const categoriaInfo = produto?.category || produto?.categoria;
  const timeInfo = produto?.team || produto?.time;

  const handleAddToCart = useCallback(async (redirect = false) => {
    if (!user) {
      toast.error("Você precisa estar logado para adicionar itens ao carrinho!");
      return navigate('/login');
    }

    if (tamanhosDisponiveis.length > 0 && !tamanhoSelecionado) {
      return toast.error("Por favor, selecione um tamanho antes de continuar.");
    }

    if (querPersonalizar && (!nomePersonalizado || !numeroPersonalizado)) {
      return toast.error("Você escolheu personalizar! Por favor, preencha o Nome e o Número.");
    }

    try {
      const cartRef = doc(db, 'carrinhos', user.uid);
      const cartSnap = await getDoc(cartRef);

      const novoItem = {
        productId: id,
        title: produto.title,
        price: produto.price,
        image: imagemPrincipal,
        size: tamanhoSelecionado,
        quantity: 1,
        personalizacao: querPersonalizar ? { nome: nomePersonalizado, numero: numeroPersonalizado } : null,
        addedAt: new Date()
      };

      const formatarPers = (p) => p ? `${p.nome}-${p.numero}` : 'nenhuma';

      if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        const items = [...(cartData.items || [])];

        const itemIndex = items.findIndex(item => 
          item.productId === novoItem.productId && 
          item.size === novoItem.size && 
          formatarPers(item.personalizacao) === formatarPers(novoItem.personalizacao)
        );

        if (itemIndex > -1) {
          items[itemIndex].quantity += 1;
        } else {
          items.push(novoItem);
        }

        await updateDoc(cartRef, { items });
      } else {
        await setDoc(cartRef, { 
          items: [novoItem],
          shipping: null 
        });
      }

      if (redirect) {
        navigate('/cart');
      } else {
        toast.success("Produto adicionado ao manto-carrinho!");
      }
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      toast.error("Erro ao salvar no banco de dados.");
    }
  }, [user, tamanhosDisponiveis, tamanhoSelecionado, querPersonalizar, nomePersonalizado, numeroPersonalizado, produto, imagemPrincipal, id, navigate]);
   
  const scrollCarousel = useCallback((offset) => {
    carouselRef.current?.scrollBy({ left: offset, behavior: 'smooth' });
  }, []);

  const toggleAccordion = useCallback((index) => {
    setAccordionsAbertos(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  }, []);

  const openLightbox = () => setIsLightboxOpen(true);
  const closeLightbox = () => setIsLightboxOpen(false);

  const handleZoomMove = (e) => {
    if (window.innerWidth <= 768) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    const img = e.currentTarget.querySelector('img');
    if (img) img.style.transformOrigin = `${x}% ${y}%`;
  };

  const handleZoomLeave = (e) => {
    const img = e.currentTarget.querySelector('img');
    if (img) img.style.transformOrigin = 'center center';
  };

  useEffect(() => {
    setLoading(true);
    setProduto(null);
    setTamanhoSelecionado('');
    setQuerPersonalizar(false);
    setNomePersonalizado('');
    setNumeroPersonalizado('');

    const buscarProduto = async () => {
      try {
        const docRef = doc(db, 'produtos', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dadosComDesconto = applyPriceLogic({ id: docSnap.id, ...docSnap.data() });
          setProduto(dadosComDesconto);
          setImagemPrincipal(dadosComDesconto.image?.[0] || FALLBACK_IMAGE);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
      } finally {
        setLoading(false);
      }
    };

    const buscarProdutosRelacionados = async () => {
      try {
        const q = query(collection(db, 'produtos'), limit(20));
        const querySnapshot = await getDocs(q);
        const produtos = [];

        querySnapshot.forEach(doc => {
          if (doc.id !== id) {
            produtos.push(applyPriceLogic({ id: doc.id, ...doc.data() }));
          }
        });

        const embaralhados = produtos.sort(() => 0.5 - Math.random()).slice(0, 10);
        setProdutosRecomendados(embaralhados);
      } catch (error) {
        console.error("Erro ao buscar produtos recomendados:", error);
      }
    };

    if (id) {
      buscarProduto();
      buscarProdutosRelacionados();
    }
  }, [id]);

  if (loading) {
    return <Loading message="Preparando detalhes do manto..." />;
  }

  if (!produto) {
    return (
      <div className="product-page-container">
        <div className="loading-msg">Produto não encontrado.</div>
      </div>
    );
  }

  return (
    <div className="product-page-container">
      
      <nav className="breadcrumbs">
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          PÁGINA INICIAL
        </span>

        {veioDeFiltro && categoriaInfo && (
          <>
            {" / "}
            <span 
              onClick={() => navigate('/', { state: { filtroPais: categoriaInfo, filtroTime: null } })} 
              style={{ cursor: 'pointer' }}
            >
              {categoriaInfo.toUpperCase()}
            </span>
          </>
        )}

        {veioDeFiltro && filtroTimeAtivo && timeInfo && (
          <>
            {" / "}
            <span 
              onClick={() => navigate('/', { state: { filtroPais: categoriaInfo, filtroTime: timeInfo } })} 
              style={{ cursor: 'pointer' }}
            >
              {timeInfo.toUpperCase()}
            </span>
          </>
        )}

        {" / "} <span className="current-product">{produto.title}</span>
      </nav>

      <section className="product-top-section">
        
        <div className="product-gallery">
          <div className="product-thumbnails">
            {listaImagens.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${produto.title} - Miniatura ${index + 1}`}
                className={imagemPrincipal === img ? 'thumb-active' : ''}
                onClick={() => setImagemPrincipal(img)}
                onError={handleImageError}
              />
            ))}
          </div>

          <div
            className="product-image-large"
            onClick={openLightbox}
            onMouseMove={handleZoomMove}
            onMouseLeave={handleZoomLeave}
          >
            <img src={imagemPrincipal} alt={produto.title || "Produto"} onError={handleImageError} />
          </div>
        </div>

        <div className="product-info-panel">
          <div className="product-header">
            <div className="product-stars">
              ★★★★<span className="star-empty">★</span>
            </div>
            <h1 className="product-title-large">{produto.title}</h1>
          </div>

          <div className="product-price-box">
            {produto.hasDiscount && (
              <p className="product-price-old">{formatCurrency(produto.originalPrice)}</p>
            )}
            <p className="product-price-large">
              {formatCurrency(produto.price)}
              {produto.hasDiscount && <span className="discount-tag">-{produto.discount}% OFF</span>}
            </p>
            <p className="product-price-installments">
              EM ATÉ 12X DE {formatCurrency(produto.price / 12)} SEM JUROS
            </p>
          </div>

          <div className="product-sizes">
            <p className="section-label">SELECIONE O TAMANHO</p>
            <div className="size-buttons">
              {tamanhosDisponiveis.length > 0 ? (
                tamanhosDisponiveis.map(size => (
                  <button
                    key={size}
                    className={`size-btn ${tamanhoSelecionado === size ? 'active' : ''}`}
                    onClick={() => setTamanhoSelecionado(size)}
                  >
                    {size}
                  </button>
                ))
              ) : (
                <p className="no-sizes-msg">Tamanho único ou indisponível</p>
              )}
            </div>
          </div>

          <ShippingCalculator />

          <div className="action-buttons">
            <button className="btn-personalize" onClick={() => setQuerPersonalizar(!querPersonalizar)}>
              PERSONALIZE DE GRAÇA
            </button>

            {querPersonalizar && (
              <div className="personalize-inputs-container">
                <input
                  type="text"
                  placeholder="NOME (Ex: RONALDO)"
                  value={nomePersonalizado}
                  onChange={(e) => setNomePersonalizado(e.target.value.toUpperCase())}
                  maxLength="15"
                  className="personalize-input input-nome"
                />
                <input
                  type="text"
                  placeholder="Nº"
                  value={numeroPersonalizado}
                  onChange={(e) => setNumeroPersonalizado(e.target.value.replace(/\D/g, ''))}
                  maxLength="2"
                  className="personalize-input input-numero"
                />
              </div>
            )}

            <div className="btn-buy-container">
              <button
                className="btn-add-cart"
                onClick={() => handleAddToCart(false)}
                title="Adicionar ao Carrinho"
                aria-label="Adicionar ao carrinho"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </button>
              <button className="btn-buy-now" onClick={() => handleAddToCart(true)}>
                COMPRAR AGORA
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="product-bottom-section">
        {ACCORDIONS_DATA.map((item, index) => {
          const isOpen = accordionsAbertos.includes(index);
          const content = item.contentKey === "description" ? (produto.description || item.fallback) : item.content;

          return (
            <div key={item.id} className="accordion-wrapper">
              <button
                className={`accordion-bar ${isOpen ? 'active' : ''}`}
                onClick={() => toggleAccordion(index)}
                aria-expanded={isOpen}
              >
                <span>{item.title}</span>
                <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </span>
              </button>
              <div className={`accordion-content ${isOpen ? 'show' : ''}`}>
                <div className="accordion-inner">
                  <p style={{ whiteSpace: 'pre-line' }}>{content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="related-products-section">
        <h3 className="related-title">VOCÊ TAMBÉM PODE GOSTAR</h3>
        <div className="carousel-wrapper">
          
          {produtosRecomendados.length > 0 && (
            <button className="carousel-arrow" onClick={() => scrollCarousel(-300)} aria-label="Produtos anteriores">
              &#10094;
            </button>
          )}

          <div className="related-carousel" ref={carouselRef}>
            {produtosRecomendados.length > 0 ? (
              produtosRecomendados.map((item) => (
                <div key={item.id} className="related-card" onClick={() => navigate(`/produto/${item.id}`)}>
                  <div className="related-card-img">
                    <img
                      src={item.image?.[0] || FALLBACK_IMAGE}
                      alt={item.title || "Produto Recommended"}
                      onError={handleImageError}
                      loading="lazy"
                    />
                  </div>
                  <div className="related-card-info">
                    <p className="related-card-name">{item.title}</p>
                    <p className="related-card-price">{formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#A0A0A0', fontSize: '0.9rem', padding: '1rem' }}>Buscando produtos...</p>
            )}
          </div>

          {produtosRecomendados.length > 0 && (
            <button className="carousel-arrow" onClick={() => scrollCarousel(300)} aria-label="Próximos produtos">
              &#10095;
            </button>
          )}

        </div>
      </section>

      {isLightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <span className="lightbox-close">&times;</span>
          <img src={imagemPrincipal} alt={produto.title} className="lightbox-image" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      
    </div>
  );
}