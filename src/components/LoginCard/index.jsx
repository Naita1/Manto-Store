import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Button } from '../Button';
import { Input } from '../Input';
import { Loading } from '../Loading';
import './LoginCard.css';

const LOGIN_ERROR_MESSAGES = {
  'auth/invalid-credential':      'E-mail ou senha incorretos.',
  'auth/user-not-found':          'Usuário não encontrado. Verifique o e-mail.',
  'auth/wrong-password':          'Senha incorreta.',
  'auth/invalid-email':           'E-mail inválido.',
  'auth/too-many-requests':       'Muitas tentativas. Tente novamente mais tarde.',
  'auth/network-request-failed':  'Erro de conexão com o servidor.',
};

export function LoginCard() {
  const navigate            = useNavigate();
  const { login, resetPassword } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Bem-vindo de volta!');
      timerRef.current = setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Login error:', error.code);
      toast.error(LOGIN_ERROR_MESSAGES[error.code] ?? 'Ocorreu um erro inesperado.');
      setLoading(false);
    }
  }, [email, password, login, navigate]);

  const handleForgotPassword = useCallback(async () => {
    if (!email) {
      toast.error('Por favor, digite seu e-mail primeiro.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      toast.success('E-mail de redefinição enviado!');
    } catch (error) {
      toast.error(
        error.code === 'auth/user-not-found'
          ? 'E-mail não cadastrado.'
          : 'Erro ao enviar e-mail.'
      );
    } finally {
      setLoading(false);
    }
  }, [email, resetPassword]);

  if (loading) return <Loading message="Autenticando..." />;

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

        <button
          type="button"
          className="forgot-password-btn"
          onClick={handleForgotPassword}
          disabled={loading}
        >
          Esqueci minha senha
        </button>

        <Button type="submit" disabled={loading}>
          Entrar
        </Button>
      </form>

      <div className="register-section">
        <p className="register-text">Não possui uma conta?</p>
        <Button
          type="button"
          className="button-secondary"
          onClick={() => navigate('/register')}
          disabled={loading}
        >
          Criar conta
        </Button>
      </div>
    </div>
  );
}