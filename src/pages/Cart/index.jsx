import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase'; 
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/UseAuth'; 
import './Cart.css';

export function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    };

    const cartRef = doc(db, "carrinhos", user.uid);

    const unsubscribe = onSnapshot(cartRef, (docSnap) => {
      if (docSnap.exists()) {
        setCartItems(docSnap.data().items || []);
      } else {
        setCartItems([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateQuantity = async (productId, size, newQuantity) => {
    if (newQuantity < 1) return;

    const cartRef = doc(db, "carrinhos", user.uid);
    
    const updatedItems = cartItems.map(item => 
      (item.productId === productId && item.size === size) 
        ? { ...item, quantity: newQuantity } 
        : item
    );

    try {
      await updateDoc(cartRef, { items: updatedItems });
    } catch (error) {
      console.error("Erro ao atualizar a quantidade:", error);
    }
  };

  const removeItem = async (productId, size) => {
    const cartRef = doc(db, "carrinhos", user.uid);
    const updatedItems = cartItems.filter(item => 
      !(item.productId === productId && item.size === size)
    );

    try {
      await updateDoc(cartRef, { items: updatedItems });
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalFrete = cartItems.reduce((acc, item) => acc + (item.shipping?.valor || 0), 0);
  const totalPedido = subtotal + totalFrete;

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const dadosEntrega = cartItems.length > 0 && cartItems[0].shipping
    ? `${cartItems[0].shipping.cidade} - CEP: ${cartItems[0].shipping.cep}`
    : 'Nenhum CEP calculado';

  const tipoFreteSelecionado = cartItems.length > 0 && cartItems[0].shipping
    ? cartItems[0].shipping.tipo
    : '';

  if (!user && !loading) {
    return (
      <div className="cart-page-container">
        <div className="empty-cart-msg">
          Precisas de fazer login para ver o teu carrinho.
          <br /><br />
          <button className="btn-checkout" onClick={() => navigate('/login')}>IR PARA LOGIN</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading-msg">A carregar o teu carrinho...</div>;
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
            cartItems.map((item, index) => (
              <div className="cart-item" key={`${item.productId}-${item.size}-${index}`}>
                <img src={item.image} alt={item.title} />
                
                <div className="item-info">
                  <h3>{item.title}</h3>
                  <p>TAMANHO: {item.size}</p>
                  {item.shipping && (
                    <p style={{fontSize: '0.75rem', color: '#B22222'}}>
                      Envio via: {item.shipping.tipo}
                    </p>
                  )}
                  <strong className="item-price">{formatCurrency(item.price)}</strong>
                  <button 
                    className="btn-remove-item" 
                    onClick={() => removeItem(item.productId, item.size)}
                  >
                    Remover
                  </button>
                </div>
                
                <div className="item-quantity-controls">
                  <button 
                    className="qtd-btn"
                    onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                  >
                    <span className="minus-icon">−</span>
                  </button>
                  <span className="qtd-number">QTDE {item.quantity}</span>
                  <button 
                    className="qtd-btn"
                    onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
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
          
          <div className="summary-line">
            <span>FRETE {tipoFreteSelecionado && `(${tipoFreteSelecionado})`}:</span>
            <span>{totalFrete > 0 ? formatCurrency(totalFrete) : 'A calcular...'}</span>
          </div>

          <div className="summary-total">
            <span>TOTAL:</span>
            <span style={{ color: 'var(--primary-color, #B22222)' }}>{formatCurrency(totalPedido)}</span>
          </div>
          
          <div className={`preference-box ${cartItems.length === 0 ? 'disabled-box' : ''}`}>
            <div className="box-header">PREFERÊNCIAS DE PAGAMENTO</div>
            <div className="box-content">
              <span className="icon">💳</span>
              <div className="box-text">
                <strong>{cartItems.length === 0 ? 'NENHUM CARTÃO' : 'CARTÃO PADRÃO'}</strong>
                <p>{cartItems.length === 0 ? 'Seleciona produtos primeiro' : '**** **** **** 1234'}</p>
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
                    : dadosEntrega} 
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