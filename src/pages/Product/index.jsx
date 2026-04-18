import { doc, getDoc, collection, query, limit, getDocs, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { useAuth } from '../../contexts/UseAuth'; 
import { db } from '../../services/firebase'; 

import './Product.css';

export function ProductPage() {

  const { id } = useParams();
  
  const { user } = useAuth();
  
  const navigate = useNavigate();
  
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagemPrincipal, setImagemPrincipal] = useState('');
  const [accordionsAbertos, setAccordionsAbertos] = useState([]);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('');
  const [produtosRecomendados, setProdutosRecomendados] = useState([]);
  
  const fallbackImage = 'https://placehold.co/600x600/1E1E1E/FFFFFF?text=Sem+Imagem';

  const handleAddToCart = async (redirect = false) => {
    if (!user) {
      alert("Você precisa estar logado para adicionar itens ao carrinho!");
      navigate('/login');
      return;
    }

    if (tamanhosDisponiveis.length > 0 && !tamanhoSelecionado) {
      alert("Por favor, selecione um tamanho antes de continuar.");
      return;
    }

    try {
      const cartRef = doc(db, 'carrinhos', user.uid);
      
      const itemCarrinho = {
        productId: id,
        title: produto.title,
        price: produto.price,
        image: imagemPrincipal,
        size: tamanhoSelecionado,
        quantity: 1,
        addedAt: new Date()
      };

      try {
        await updateDoc(cartRef, {
          items: arrayUnion(itemCarrinho)
        });
      } catch (err) {
        await setDoc(cartRef, {
          items: [itemCarrinho]
        });
      }

      if (redirect) {
        navigate('/cart');
      } else {
        alert("Produto adicionado ao manto-carrinho! ⚽");
      }

    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      alert("Erro ao salvar no banco de dados.");
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    async function buscarProduto() {
      try {
        const docRef = doc(db, 'produtos', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dados = docSnap.data();
          setProduto(dados);
          
          if (dados.image && Array.isArray(dados.image) && dados.image.length > 0) {
            setImagemPrincipal(dados.image[0]);
          } else {
            setImagemPrincipal(fallbackImage);
          }
        } else {
          console.log("Nenhum produto encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
      } finally {
        setLoading(false);
      }
    }

    async function buscarProdutosRelacionados() {
      try {
        const q = query(collection(db, 'produtos'), limit(10));
        const querySnapshot = await getDocs(q);
        
        const produtos = [];
        querySnapshot.forEach((doc) => {
          if (doc.id !== id) {
            produtos.push({ id: doc.id, ...doc.data() });
          }
        });

        const embaralhados = produtos.sort(() => 0.5 - Math.random()).slice(0, 4);
        setProdutosRecomendados(embaralhados);
        
      } catch (error) {
        console.error("Erro ao buscar produtos recomendados:", error);
      }
    }
    
    if (id) {
      buscarProduto();
      buscarProdutosRelacionados();
    }
  }, [id]);

  if (loading) return <div className="loading-msg">Carregando Manto...</div>;
  if (!produto) return <div className="loading-msg">Produto não encontrado.</div>;

  const listaImagens = produto.image && Array.isArray(produto.image) && produto.image.length > 0 
    ? produto.image 
    : [fallbackImage];

  const tamanhosDisponiveis = produto.sizes && Array.isArray(produto.sizes) 
    ? produto.sizes 
    : [];

  const accordionsData = [
    { 
      id: 1, 
      title: "DESCRIÇÃO", 
      content: produto.description || "Nenhuma descrição informada para este produto." 
    },
    { 
      id: 2, 
      title: "TABELA DE MEDIDAS", 
      content: "P: 50x70cm | M: 52x72cm | G: 54x74cm | GG: 56x76cm" 
    },
    { 
      id: 3, 
      title: "AVALIAÇÕES", 
      content: "Nenhuma avaliação no momento." 
    },
    { 
      id: 4, 
      title: "DÚVIDAS SOBRE O PRODUTO", 
      content: "Para personalizar, clique no botão 'PERSONALIZE DE GRAÇA'." 
    }
  ];

  const toggleAccordion = (index) => {
    setAccordionsAbertos((prev) => 
      prev.includes(index) 
        ? prev.filter((item) => item !== index) 
        : [...prev, index]                     
    );
  };

 
  return (
    <div className="product-page-container">
      
      <nav className="breadcrumbs">
        <a href="/">PÁGINA INICIAL</a> / <span>{produto.title}</span>
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
                onError={(e) => { e.target.src = fallbackImage }}
              />
            ))}
          </div>

          <div 
            className="product-image-large"
            onMouseMove={(e) => {
              const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - left) / width) * 100;
              const y = ((e.clientY - top) / height) * 100;
              
              const img = e.currentTarget.querySelector('img');
              if (img) img.style.transformOrigin = `${x}% ${y}%`;
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector('img');
              if (img) img.style.transformOrigin = 'center center';
            }}
          >
            <img 
              src={imagemPrincipal} 
              alt={produto.title || "Produto"} 
              onError={(e) => { e.target.src = fallbackImage }}
            />
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
            <p className="product-price-large">
              {produto.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            
            <p className="product-price-installments">
              EM ATÉ 12X DE {(produto.price / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} SEM JUROS
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
                <p style={{ color: '#A0A0A0', fontSize: '0.9rem' }}>Tamanho único ou indisponível</p>
              )}
            </div>
          </div>

          <div className="shipping-box">
            <p className="section-label">CALCULAR FRETE</p>
            <div className="shipping-input-group">
              <input type="text" placeholder="00000-000" maxLength="9" />
              <button>OK</button>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-personalize">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              PERSONALIZE DE GRAÇA
            </button>
            <div className="btn-buy-container">
              
              <button 
                className="btn-add-cart"
                onClick={() => handleAddToCart(false)}                
                title="Adicionar ao Carrinho"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              </button>

              <button 
                className="btn-buy-now"
                onClick={() => console.log("Indo direto para o pagamento...")}
              >
                COMPRAR AGORA
              </button>

            </div>

          </div>

        </div>
      </section>

      <section className="product-bottom-section">
        {accordionsData.map((item, index) => {
          const isOpen = accordionsAbertos.includes(index);

          return (
            <div key={item.id} className="accordion-wrapper">
              <button 
                className={`accordion-bar ${isOpen ? 'active' : ''}`} 
                onClick={() => toggleAccordion(index)}
              >
                <span>{item.title}</span>
                <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </span>
              </button>
              
              <div className={`accordion-content ${isOpen ? 'show' : ''}`}>
                <div className="accordion-inner">
                  <p style={{ whiteSpace: 'pre-line' }}>{item.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

           <section className="related-products-section">
        <h3 className="related-title">VOCÊ TAMBÉM PODE GOSTAR</h3>
        <div className="related-carousel-container">
          <div className="related-carousel">
            {produtosRecomendados.length > 0 ? (
              produtosRecomendados.map((item) => {
                const imagemItem = item.image && Array.isArray(item.image) && item.image.length > 0 
                  ? item.image[0] 
                  : fallbackImage;

                return (
                  <div 
                    key={item.id} 
                    className="related-card"
                    onClick={() => navigate(`/produto/${item.id}`)} 
                  >
                    <div className="related-card-img">
                      <img 
                        src={imagemItem} 
                        alt={item.title || "Produto Recomendado"} 
                        onError={(e) => { e.target.src = fallbackImage }}
                      />
                    </div>
                    <div className="related-card-info">
                      <p className="related-card-name">{item.title}</p>
                      <p className="related-card-price">
                        {item.price 
                          ? item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                          : 'R$ 0,00'}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: '#A0A0A0', fontSize: '0.9rem' }}>Buscando produtos...</p>
            )}
          </div>
          {produtosRecomendados.length > 0 && <button className="carousel-arrow">❯</button>}
        </div>
      </section>

    </div>
  );
}