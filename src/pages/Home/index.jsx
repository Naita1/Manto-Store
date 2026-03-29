import { ProductCard } from '../../components/ProductCard';
import './Home.css';
import banner from '../../assets/Manto.png'

export function HomePage() {
  
  const produtosPesquisa = [
    { id: 1, title: 'CAMISA PRINCIPAL DO BOCA JUNIORS 25/26', price: 'R$299,99' },
    { id: 2, title: 'CAMISA I JUVENTUS 25/26', price: 'R$299,99' },
    { id: 3, title: 'CAMISA II MILAN 25/26', price: 'R$299,99' },
    { id: 4, title: 'CAMISA I REAL MADRID 25/26', price: 'R$349,90' },
    { id: 5, title: 'CAMISA I BAYERN 25/26', price: 'R$299,99' },
    { id: 6, title: 'CAMISA III ARSENAL 25/26', price: 'R$299,99' },
  ];

  return (
    <div className="home-container">
      
    <section
  className="home-banner"
  style={{ 
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url(${banner})` 
  }}
></section>


      <section className="showcase-section">
        <h2 className="showcase-title">COM BASE NA SUA PESQUISA</h2>
        <div className="product-row">
          {produtosPesquisa.map(produto => (
            <ProductCard 
              key={produto.id} 
              title={produto.title} 
              price={produto.price} 
            />
          ))}
        </div>
      </section>

      <section className="showcase-section">
        <h2 className="showcase-title">MAIS VENDIDOS</h2>
        <div className="product-row">
          {produtosPesquisa.map(produto => (
            <ProductCard 
              key={produto.id + 10} 
              title={produto.title} 
              price={produto.price} 
            />
          ))}
        </div>
      </section>

    </div>
  );
}