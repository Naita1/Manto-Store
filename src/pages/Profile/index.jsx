import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.photoURL ? <img src={user.photoURL} alt="Avatar" /> : <div className="avatar-placeholder" />}
        </div>
        <h2 className="profile-name">{user.displayName || "NOME DO USUÁRIO"}</h2>
        <button className="btn-edit-profile">EDITAR PERFIL</button>
      </div>

      <div className="profile-grid">
        <div className="info-box">
          <div className="box-header">INFORMAÇÕES PESSOAIS</div>
          <div className="box-content-profile">
            <p><strong>E-MAIL</strong><br/>{user.email}</p>
            <p><strong>TELEFONE</strong><br/>(11) 91111-0000</p>
            <p><strong>ENDEREÇO SALVO</strong><br/>RUA ESPORTIVA, 100, SÃO PAULO - SP</p>
          </div>
        </div>

        <div className="info-box orders-box">
          <div className="box-header">MEUS PEDIDOS</div>
          <div className="box-content-profile">
            <div className="order-item">
              <span>PEDIDO #182947</span>
              <span className="order-status">+ STATUS: A CAMINHO</span>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <button className="settings-item">PRIVACIDADE <span className="plus-icon">+</span></button>
        <button className="settings-item">SEGURANÇA <span className="plus-icon">+</span></button>
        <button className="settings-item">GERAL <span className="plus-icon">+</span></button>
        
        <button onClick={handleLogout} className="btn-logout-profile">
          SAIR DA CONTA
        </button>
      </div>
    </div>
  );
}