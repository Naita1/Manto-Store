import { Link } from 'react-router-dom';
import './Cart.css';

export function CartPage() {
  return (
    <div className="cart-page-container">
      
      <div className="breadcrumbs">
        <Link to="/">← PÁGINA INICIAL</Link> / CARRINHO DE COMPRAS
      </div>

      <h1 className="cart-main-title">CARRINHO DE COMPRAS</h1>

      <div className="cart-layout-box">
        
        <div className="cart-products-section">
          <h2 className="section-subtitle">PRODUTOS</h2>
          
          <div className="cart-item">
            <img src="https://placehold.co/150x150/EAEAEA/333333?text=Camisa" alt="Camisa Boca" />
            
            <div className="item-info">
              <h3>CAMISA PRINCIPAL DO BOCA<br/>JUNIORS 25/26</h3>
              <p>TAMANHO: G</p>
              <p>SKU: 1B3-XMCS</p>
              <strong className="item-price">R$299,99</strong>
            </div>
            
            <div className="item-quantity-controls">
              <button className="qtd-btn">
                <span className="minus-icon">−</span>
              </button>
              <span className="qtd-number">QTDE 1</span>
              <button className="qtd-btn">
                <span className="plus-icon">+</span>
              </button>
            </div>
          </div>

          <div className="cart-item">
            <img src="https://placehold.co/150x150/EAEAEA/333333?text=Camisa" alt="Camisa Boca" />
            
            <div className="item-info">
              <h3>CAMISA PRINCIPAL DO BOCA<br/>JUNIORS 25/26</h3>
              <p>TAMANHO: G</p>
              <p>SKU: 1B3-XMCS</p>
              <strong className="item-price">R$299,99</strong>
            </div>
            
            <div className="item-quantity-controls">
              <button className="qtd-btn">
                <span className="minus-icon">−</span>
              </button>
              <span className="qtd-number">QTDE 1</span>
              <button className="qtd-btn">
                <span className="plus-icon">+</span>
              </button>
            </div>
          </div>

        </div>

        <div className="cart-summary-section">
          <h2 className="section-subtitle">RESUMO DO PEDIDO</h2>
          
          <div className="summary-line">
            <span>SUBTOTAL:</span>
            <span>599,98</span>
          </div>
          <div className="summary-line">
            <span>FRETE CALCULADO:</span>
            <span>GRÁTIS</span>
          </div>
          
          <div className="summary-total">
            <span>TOTAL:</span>
            <span>599,98</span>
          </div>

          <div className="preference-box">
            <div className="box-header">PREFERÊNCIAS DE PAGAMENTO</div>
            <div className="box-content">
              <span className="icon">💳</span>
              <div className="box-text">
                <strong>CARTÃO PADRÃO</strong>
                <p>**** **** **** 1234</p>
              </div>
              <span className="edit-icon">✎</span>
            </div>
          </div>

          <div className="preference-box">
            <div className="box-header">ENDEREÇO DE ENTREGA</div>
            <div className="box-content">
              <div className="box-text">
                <p>RUA ESPORTIVA, 100, SÃO PAULO - SP,<br/>11111-111</p>
              </div>
              <span className="edit-icon">✎</span>
            </div>
          </div>

          <button className="btn-checkout">FINALIZAR COMPRA</button>

        </div>
      </div>
    </div>
  );
}