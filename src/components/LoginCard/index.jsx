import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Button } from '../Button';
import { Input } from '../Input';
import { Loading } from '../Loading';

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
    <div className="relative w-full max-w-sm p-8 rounded-3xl bg-[#161616]/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-white/20 group">
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-20 bg-primary/25 rounded-full blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-70" />

      <div className="relative mb-8 text-center">
        <h2 className="text-xl font-bold uppercase tracking-widest text-white">
          Já sou cadastrado
        </h2>
        <p className="mt-1 text-xs text-neutral-400">
          Acesse sua conta para continuar
        </p>
      </div>

      <form className="relative flex flex-col gap-4" onSubmit={handleLogin}>
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

     <div className="flex justify-end -mt-1 mb-2">
        <Button 
          type="button"
          onClick={handleForgotPassword}
          disabled={loading}
          className="w-auto h-auto p-0 bg-transparent hover:bg-transparent normal-case rounded-none text-xs text-neutral-400 hover:text-primary transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed transform-gpu"
        >
          Esqueci minha senha
        </Button>
      </div>

        <Button type="submit" disabled={loading}>
          Entrar
        </Button>
      </form>

      <div className="relative mt-8 pt-6 border-t border-white/10 text-center flex flex-col gap-3">
        <span className="text-xs text-neutral-400">Ainda não tem acesso?</span>
        <Button
          type="button"
          className="bg-transparent! border border-primary text-primary! hover:bg-primary! hover:text-white! shadow-none hover:shadow-lg hover:shadow-primary/20"
          onClick={() => navigate('/register')}
          disabled={loading}
        >
          Criar conta
        </Button>
      </div>
    </div>
  );
}