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
    notifications: { email: true, sms: false }, 
  });
  
  const [orders, setOrders] = useState([]); 
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (user?.uid) {
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            setUserData(prev => ({ ...prev, ...docSnap.data() }));
          }

          const q = query(
            collection(db, "orders"), 
            where("userId", "==", user.uid),
            limit(3)
          );
          const querySnapshot = await getDocs(q);
          setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        } catch (error) {
          console.error("Erro ao carregar:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [user?.uid]);

  const handleToggleNotification = async (type) => {
    const newPrefs = { ...userData.notifications, [type]: !userData.notifications[type] };
    setUserData(prev => ({ ...prev, notifications: newPrefs }));
    await updateDoc(doc(db, "users", user.uid), { notifications: newPrefs });
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), userData);
      setIsEditing(false);
    } catch (e) { console.error(e); }
  };

  const handleLogout = async () => {
    try { await logout(); navigate('/login'); } catch (e) { console.error(e); }
  };

  if (loading) return <div className="loading-msg">Carregando perfil...</div>;

  return (
    <div className="product-page-container profile-view">
      <div className="profile-hero">
        <div className="avatar-circle-placeholder">
          {userData?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
         
        </div>

        <h1 className="profile-display-name">{userData?.name || "Usuário"}</h1>
        <button className="btn-edit-toggle" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'CANCELAR' : 'EDITAR PERFIL'}
        </button>
      </div>

      <div className="profile-content-grid">
        <div className="main-profile-column">
          <div className="info-box-styled">
            <div className="box-header">INFORMAÇÕES PESSOAIS</div>
            <div className="box-inputs">
              <div className="input-wrapper">
                <label>NOME COMPLETO</label>
                <input disabled={!isEditing} value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} />
              </div>
              <div className="input-wrapper">
                <label>E-MAIL</label>
                <input disabled={!isEditing} value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} />
              </div>
              <div className="input-wrapper">
                <label>TELEFONE</label>
                <input disabled={!isEditing} value={userData.phone || ''} onChange={e => setUserData({...userData, phone: e.target.value})} />
              </div>
              <div className="input-wrapper">
                <label>ENDEREÇO SALVO</label>
                <input disabled={!isEditing} value={userData.address || ''} onChange={e => setUserData({...userData, address: e.target.value})} />
              </div>
            </div>
            {isEditing && <Button onClick={handleSave}>CONFIRMAR ALTERAÇÕES</Button>}
          </div>
        </div>

        <div className="side-profile-column">
          <div className="info-box-styled">
            <div className="box-header">NOTIFICAÇÕES</div>
            <div className="notification-settings">
              <div className="notif-item">
                <span>E-mail Marketing</span>
                <input type="checkbox" checked={userData.notifications?.email} onChange={() => handleToggleNotification('email')} />
              </div>
              <div className="notif-item">
                <span>SMS de Promoções</span>
                <input type="checkbox" checked={userData.notifications?.sms} onChange={() => handleToggleNotification('sms')} />
              </div>
            </div>
          </div>

          <div className="info-box-styled" style={{ marginTop: '2rem' }}>
            <div className="box-header">AÇÕES DA CONTA</div>
            <div className="profile-actions-wrapper">
              <Button onClick={() => navigate('/cart')}>MEU CARRINHO</Button>
              <Button onClick={handleLogout} className="btn-logout-variant">SAIR DA CONTA</Button>
            </div>
          </div>
        </div>
      </div>
               <div className="info-box-styled" style={{ marginTop: '2rem' }}>
            <div className="box-header">ÚLTIMOS PEDIDOS</div>
            <div className="orders-list">
              {orders.length > 0 ? orders.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <span>#{order.id.slice(-6).toUpperCase()}</span>
                    <small>{order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Recente'}</small>
                  </div>
                  <div className="order-status">{order.status || 'Processando'}</div>
                  <div className="order-total">R$ {order.total}</div>
                </div>
              )) : <p className="empty-msg">Nenhum pedido encontrado.</p>}
            </div>
          </div>
    </div>
  );
}