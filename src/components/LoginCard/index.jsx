import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import { useState } from 'react'; 

import toast from 'react-hot-toast'; 
import { Button } from '../Button';
import { Input } from '../Input';

import './LoginCard.css';

const loginErrorMessages = {
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'Usuário não encontrado. Verifique o e-mail.',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/invalid-email': 'E-mail inválido.',
  'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
  'auth/network-request-failed': 'Erro de conexão com o servidor.'
};

export function LoginCard() {
  const navigate = useNavigate(); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, resetPassword } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      
      toast.success('Bem-vindo de volta!');

      setTimeout(() => {
        navigate('/'); 
      }, 1500);

    } 
    catch (error) {
      console.error("Erro original:", error.code);
      const friendlyMessage = loginErrorMessages[error.code] || 'Ocorreu um erro inesperado.';

      toast.error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      return toast.error('Por favor, digite seu e-mail primeiro.');
    }

    try {
      setLoading(true);
      await resetPassword(email);
      toast.success('E-mail de redefinição enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        toast.error('E-mail não cadastrado.');
      } else {
        toast.error('Erro ao enviar e-mail de redefinição.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-container">
      <h2 className="card-title">Já sou cadastrado</h2>
      
      <form className="card-form" onSubmit={handleLogin}>
        <Input 
          id="email-login" 
          label="E-mail" 
          type="email" 
          placeholder="exemplo@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input 
          id="senha-login" 
          label="Senha" 
          type="password" 
          placeholder="Sua senha" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <Button 
          type="button" 
          className="forgot-password-btn" 
          onClick={handleForgotPassword}
          disabled={loading}
        >
          Esqueci minha senha
        </Button>     

        <Button type="submit" disabled={loading}>
          {loading ? 'Carregando...' : 'Entrar'}
        </Button>
      </form>

      <div className="register-section">
        <p className="register-text">Não possui uma conta?</p>
        <Button 
          type="button"
          className="button-secondary"
          onClick={() => navigate('/register')}
        >
          Criar conta
        </Button>
      </div>
    </div>
  );
}