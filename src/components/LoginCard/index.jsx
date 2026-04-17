import { useAuth } from '../../contexts/UseAuth';
import { useState, useRef } from 'react';

import { Toast } from 'primereact/toast';
import { Button } from '../Button';
import { Input } from '../Input';

import { Link } from 'react-router-dom';

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

  const toast = useRef(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      
      toast.current.show({ 
        severity: 'success', 
        summary: 'Login Bem-Sucedido', 
        detail: 'Bem-vindo de volta!', 
        life: 3000 
      });
      
      setEmail('');
      setPassword('');
    } 
    catch (error) {
      console.error("Erro original:", error.code);

      const friendlyMessage = loginErrorMessages[error.code] || 'Ocorreu um erro inesperado. Tente novamente.';

      toast.current.show({ 
        severity: 'error', 
        summary: 'Erro de Acesso', 
        detail: friendlyMessage, 
        life: 4000 
      });
    }
  };

  return (
    <div className="card-container">
      <Toast ref={toast}/>
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
        
        <a href="#" className="forgot-password">Esqueci minha senha</a>
        
        <Button type="submit">Entrar</Button>
      </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/register" className="login-link">
            Primeiro Acesso
          </Link>
        </div>
    </div>
  );6
}