import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/index';
import './Profile.css';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({ 
    name: '', 
    phone: '', 
    address: '',
    email: '',
  });
  
  const [orders, setOrders] = useState([]); 
  const [cartItems, setCartItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (user?.uid) {
        try {
          const userDocSnap = await getDoc(doc(db, "users", user.uid));
          if (userDocSnap.exists()) {
            setUserData(prev => ({ ...prev, ...userDocSnap.data() }));
          }

          const qOrders = query(
            collection(db, "orders"), 
            where("userId", "==", user.uid),
            limit(3)
          );
          const orderSnap = await getDocs(qOrders);
          setOrders(orderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

          const cartDocRef = doc(db, "carrinhos", user.uid);
          const cartSnap = await getDoc(cartDocRef);
          
          if (cartSnap.exists()) {
            const cartData = cartSnap.data();
            const items = cartData.items || (cartData.title ? [cartData] : []);
            setCartItems(items.slice(0, 3));
          } else {
            setCartItems([]);
          }

        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [user?.uid]);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), userData);
      setIsEditing(false);
    } catch (e) { console.error(e); }
  };

  const handleLogout = async () => {
    try { await logout(); navigate('/login'); } catch (e) { console.error(e); }
  };

  if (loading) return <div className="loading-msg-container"><div className="loader"></div><p>Carregando perfil...</p></div>;

  return (
    <div className="product-page-container profile-view">
      <header className="profile-hero">
        <div className="avatar-circle-placeholder">
          {userData?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
        </div>
        <h1 className="profile-display-name">{userData?.name || "Usuário"}</h1>
        <div className="hero-actions">
           <Button onClick={() => setIsEditing(!isEditing)} className="btn-edit-toggle">
            {isEditing ? 'CANCELAR' : 'EDITAR PERFIL'}
          </Button>
        </div>
      </header>

      <main className="profile-content-grid">
        <section className="main-profile-column">
          <div className="info-box-styled">
            <div className="box-content-wrapper">
              <div className="box-header">INFORMAÇÕES PESSOAIS</div>
              <div className="box-inputs">
                <div className="input-row">
                  <div className="input-wrapper">
                    <label>NOME COMPLETO</label>
                    <input disabled={!isEditing} value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} placeholder="Seu nome" />
                  </div>
                  <div className="input-wrapper">
                    <label>E-MAIL</label>
                    <input disabled={!isEditing} value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} placeholder="seu@email.com" />
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-wrapper">
                    <label>TELEFONE</label>
                    <input disabled={!isEditing} value={userData.phone || ''} onChange={e => setUserData({...userData, phone: e.target.value})} placeholder="(00) 00000-0000" />
                  </div>
                  <div className="input-wrapper">
                    <label>ENDEREÇO SALVO</label>
                    <input disabled={!isEditing} value={userData.address || ''} onChange={e => setUserData({...userData, address: e.target.value})} placeholder="Rua, número, bairro" />
                  </div>
                </div>
              </div>
            </div>
            {isEditing && (
              <div className="save-actions">
                <Button onClick={handleSave} className="btn-confirm-save">CONFIRMAR ALTERAÇÕES</Button>
              </div>
            )}
          </div>

          <div className="info-box-styled">
            <div className="box-header">ÚLTIMOS PEDIDOS</div>
            <div className="orders-list">
              {orders.length > 0 ? orders.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <span className="order-id">#{order.id.slice(-6).toUpperCase()}</span>
                    <small className="order-date">{order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Recente'}</small>
                  </div>
                  <div className="order-status-tag">{order.status || 'Processando'}</div>
                  <div className="order-total">R$ {order.total}</div>
                </div>
              )) : (
                <div className="empty-state-box">
                  <p className="empty-msg">Nenhum pedido realizado recentemente.</p>
                </div>
              )}
            </div>
          </div>
        </section>

<aside className="side-profile-column">
  <div className="info-box-styled">
    <div className="box-header">RESUMO DO CARRINHO</div>
    
    <div className="cart-preview-list-clean">
      {cartItems.length > 0 ? (
        cartItems.map((item, idx) => (
          <div 
            key={idx} 
            className="cart-item-minimal"
            onClick={() => navigate(`/produto/${item.productId}`)}
            title={`Ver ${item.title}`}
          >
            <div className="minimal-thumb">
               {item.image ? <img src={item.image} alt={item.title} /> : <div className="thumb-placeholder" />}
            </div>
            <div className="minimal-info">
              <span className="minimal-title">{item.title}</span>
            </div>
            <div className="minimal-arrow">→</div>
          </div>
        ))
      ) : (
        <div className="empty-state-box">
          <p className="empty-msg">Nenhum item no carrinho.</p>
        </div>
      )}
    </div>

    <div className="cart-action-btn-wrapper">
      <Button 
        onClick={() => navigate(cartItems.length > 0 ? '/cart' : '/')} 
        className="btn-confirm-save"
      >
        {cartItems.length > 0 ? 'VER CARRINHO COMPLETO' : 'ADICIONAR PRODUTOS'}
      </Button>
    </div>
  </div>

  <div className="info-box-styled">
    <div className="box-header">DETALHES DA CONTA</div>
    
    <div className="account-details-grid">
      <div className="detail-item">
        <label>STATUS</label>
        <span className="status-badge">CONTA ATIVA</span>
      </div>
      
      <div className="detail-group">
        <div className="detail-sub">
          <label>MEMBRO DESDE</label>
          <span>{userData.createdAt?.seconds ? new Date(userData.createdAt.seconds * 1000).getFullYear() : '2024'}</span>
        </div>

      </div>



    </div>

    <div className="profile-actions-wrapper">
      <Button onClick={handleLogout} className="btn-logout-variant">ENCERRAR SESSÃO</Button>
    </div>
  </div>
</aside>
      </main>
    </div>
  );
}