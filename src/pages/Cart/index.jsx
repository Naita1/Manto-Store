import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/firebase'; 
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import './Cart.css';

export function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);


  const userId = "2"; 

  useEffect(() => {
    if (!userId) return;

    const cartRef = doc(db, "cart", userId);

    const unsubscribe = onSnapshot(cartRef, (docSnap) => {
      if (docSnap.exists()) {
        setCartItems(docSnap.data().items || []);
      } else {
        setCartItems([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const cartRef = doc(db, "cart", userId);
    
    const updatedItems = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );

    try {
      await updateDoc(cartRef, { items: updatedItems });
    } catch (error) {
      console.error("Erro ao atualizar a quantidade:", error);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal; 

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (loading) {
    return <div className="cart-loading">A carregar o teu carrinho...</div>;
  }

  return (
    <div className="cart-page-container">
      
      <div className="breadcrumbs">
        <Link to="/">← PÁGINA INICIAL</Link> / CARRINHO DE COMPRAS
      </div>

      <h1 className="cart-main-title">CARRINHO DE COMPRAS</h1>

      <div className="cart-layout-box">
        
        <div className="cart-products-section">
          <h2 className="section-subtitle">PRODUTOS</h2>
          
          {cartItems.length === 0 ? (
            <div className="empty-cart-msg">O teu carrinho está vazio.</div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.title} />
                
                <div className="item-info">
                  <h3>{item.title}</h3>
                  <p>TAMANHO: {item.size}</p>
                  <p>SKU: {item.sku || 'N/A'}</p>
                  <strong className="item-price">{formatCurrency(item.price)}</strong>
                </div>
                
                <div className="item-quantity-controls">
                  <button 
                    className="qtd-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <span className="minus-icon">−</span>
                  </button>
                  <span className="qtd-number">QTDE {item.quantity}</span>
                  <button 
                    className="qtd-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <span className="plus-icon">+</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

       <div className="cart-summary-section">
  <h2 className="section-subtitle">RESUMO DO PEDIDO</h2>
  
  <div className="summary-line">
    <span>SUBTOTAL:</span>
    <span>{formatCurrency(subtotal)}</span>
  </div>
  
  <div className={`preference-box ${cartItems.length === 0 ? 'disabled-box' : ''}`}>
    <div className="box-header">PREFERÊNCIAS DE PAGAMENTO</div>
    <div className="box-content">
      <span className="icon">💳</span>
      <div className="box-text">
        <strong>{cartItems.length === 0 ? 'NENHUM CARTÃO' : 'CARTÃO PADRÃO'}</strong>
        <p>{cartItems.length === 0 ? 'Selecione produtos primeiro' : '**** **** **** 1234'}</p>
      </div>
    </div>
  </div>

  <div className={`preference-box ${cartItems.length === 0 ? 'disabled-box' : ''}`}>
    <div className="box-header">ENDEREÇO DE ENTREGA</div>
    <div className="box-content">
      <div className="box-text">
        <p>
          {cartItems.length === 0 
            ? 'Endereço indisponível' 
            : <>RUA ESPORTIVA, 100, SÃO PAULO - SP,<br/>11111-111</>}
        </p>
      </div>
    </div>
  </div>

  <button className="btn-checkout" disabled={cartItems.length === 0}>
    FINALIZAR COMPRA
  </button>
</div>
      </div>
    </div>
  );
}