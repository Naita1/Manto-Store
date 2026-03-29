import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import './Product.css';

export function ProductPage() {
  const { id } = useParams();
  
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagemPrincipal, setImagemPrincipal] = useState('');

  const fallbackImage = 'https://placehold.co/600x600/EAEAEA/333333?text=Sem+Imagem';

  useEffect(() => {
    async function buscarProduto() {
      try {
        const docRef = doc(db, 'produtos', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dados = docSnap.data();
          setProduto(dados);
          
          if (dados.image && dados.image.length > 0) {
            setImagemPrincipal(dados.image[0]);
          } else {
            setImagemPrincipal(fallbackImage);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
      } finally {
        setLoading(false);
      }
    }
    buscarProduto();
  }, [id]);

  if (loading) return <div className="loading-msg">Carregando Manto...</div>;
  if (!produto) return <div className="loading-msg">Produto não encontrado.</div>;

  const listaImagens = produto.image && produto.image.length > 0 ? produto.image : [
    fallbackImage, fallbackImage, fallbackImage, fallbackImage
  ];

  const produtosRecomendados = [1, 2, 3, 4, 5, 6];

  return (
    <div className="product-page-container">
      
      <div className="breadcrumbs">
        ← PÁGINA INICIAL / FUTEBOL ARGENTINO / BOCA JUNIORS
      </div>

      <section className="product-top-section">
        
        <div className="product-gallery">
          <div className="product-thumbnails">
            {listaImagens.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`Miniatura ${index}`} 
                className={imagemPrincipal === img ? 'thumb-active' : ''}
                onClick={() => setImagemPrincipal(img)}
                onError={(e) => { e.target.src = fallbackImage }}
              />
            ))}
          </div>

          <div className="product-image-large">
            <img 
              src={imagemPrincipal} 
              alt={produto.title} 
              onError={(e) => { e.target.src = fallbackImage }}
            />
          </div>
        </div>

        <div className="product-info-panel">
          
          <div className="product-stars">★★★★<span className="star-empty">★</span></div>
          <h1 className="product-title-large">{produto.title}</h1>
          
          <div className="product-price-box">
            <p className="product-price-large">{produto.price}</p>
            <p className="product-price-installments">OU 12X DE R$ 24,99</p>
          </div>

          <div className="product-sizes">
            <p>SELECIONE O TAMANHO</p>
            <div className="size-buttons">
              {['PP', 'P', 'M', 'G', 'GG', '2GG'].map(size => (
                <button key={size} className="size-btn">{size}</button>
              ))}
            </div>
          </div>

          <div className="shipping-box">
            <p className="shipping-title">CALCULAR FRETE:</p>
            <div className="shipping-input-group">
              <input type="text" placeholder="SEU CEP" />
              <button>OK</button>
            </div>
            <p className="shipping-result">SEDEX: R$ 12,54 (2 DIAS ÚTEIS)</p>
          </div>

          <div className="action-buttons">
            <button className="btn-personalize">PERSONALIZE DE GRAÇA</button>
            <button className="btn-buy">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              COMPRAR AGORA
            </button>
          </div>

        </div>
      </section>

      <section className="product-bottom-section">
        <div className="accordion-bar">
          DESCRIÇÃO <span className="accordion-icon">⊕</span>
        </div>
        <div className="accordion-bar">
          TABELA DE MEDIDAS <span className="accordion-icon">⊕</span>
        </div>
        <div className="accordion-bar">
          AVALIAÇÕES <span className="accordion-icon">⊕</span>
        </div>
        <div className="accordion-bar">
          DÚVIDAS SOBRE O PRODUTO <span className="accordion-icon">⊕</span>
        </div>
      </section>

      <section className="related-products-section">
        <h3 className="related-title">VOCÊ TAMBÉM PODE GOSTAR</h3>
        <div className="related-carousel-container">
          <div className="related-carousel">
            {produtosRecomendados.map((item) => (
              <div key={item} className="related-card">
                <div className="related-card-img">
                  <img src={fallbackImage} alt="Produto Recomendado" />
                </div>
                <div className="related-card-info">
                  <p className="related-card-name">CAMISA PRINCIPAL DO BOCA JUNIORS 25/26</p>
                  <p className="related-card-price">R$299,99</p>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-arrow">❯</button>
        </div>
      </section>

    </div>
  );
}