import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../Input';
import { Button } from '../Button';
import { Loading } from '../Loading';

const REGISTER_ERROR_MESSAGES = {
  'auth/email-already-in-use': 'Este e-mail já está em uso.',
  'auth/invalid-email': 'E-mail inválido.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/network-request-failed': 'Erro de conexão com o servidor.',
};

export function RegisterCard() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordCriteria = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const metCriteriaCount = Object.values(passwordCriteria).filter(Boolean).length;
  const isPasswordStrong = metCriteriaCount === 5;

  const getStrengthColor = () => {
    if (metCriteriaCount === 0) return 'transparent';
    if (metCriteriaCount <= 2) return '#ff4d4d';
    if (metCriteriaCount === 3) return '#ffa64d';
    if (metCriteriaCount === 4) return '#ffd24d';
    return '#51cf66';
  };

  const getStrengthText = () => {
    if (metCriteriaCount === 0) return '';
    if (metCriteriaCount <= 2) return 'Senha Fraca';
    if (metCriteriaCount === 3) return 'Senha Razoável';
    if (metCriteriaCount === 4) return 'Quase lá...';
    return 'Senha Forte!';
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error('As senhas não coincidem!');
    }

    setLoading(true);

    try {
      await signUp(email, password, name);
      toast.success('Conta criada! Bem-vindo à Manto Store!');

      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Erro no cadastro:', error.code);
      const friendlyMessage =
        REGISTER_ERROR_MESSAGES[error.code] ||
        'Erro ao criar conta. Tente novamente.';
      toast.error(friendlyMessage);
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-[#161616]/85 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-white/20 group overflow-hidden">
      {loading && <Loading message="Criando sua conta..." />}

      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 bg-primary/20 rounded-full blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-70" />

      <div className="relative mb-5 text-center">
        <h2 className="text-xl font-bold uppercase tracking-widest text-white">
          Primeiro Acesso
        </h2>
        <p className="mt-1 text-xs text-neutral-400">
          Crie sua conta para começar
        </p>
      </div>

      <form className="relative flex flex-col gap-4" onSubmit={handleRegister}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            id="full-name"
            label="Nome"
            type="text"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            id="email-register"
            label="E-mail"
            type="email"
            placeholder="exemplo@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            id="password-register"
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            id="confirm-password"
            label="Confirme a Senha"
            type="password"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        {password.length > 0 && (
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/3 border border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="h-1.5 grow overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${(metCriteriaCount / 5) * 100}%`,
                    backgroundColor: getStrengthColor(),
                  }}
                />
              </div>
              <span
                className="text-xs font-bold whitespace-nowrap transition-colors duration-300"
                style={{ color: getStrengthColor() }}
              >
                {getStrengthText()}
              </span>
            </div>

            {!isPasswordStrong && (
              <p className="text-[11px] italic text-neutral-400">
                Dica: Use 8+ caracteres, letras (A, a), números e símbolos (!@#$).
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || !isPasswordStrong || password !== confirmPassword}
          className="mt-1"
        >
          Cadastrar
        </Button>
      </form>

      <div className="relative mt-5 pt-4 border-t border-white/10 text-center flex flex-col gap-2.5">
        <p className="text-xs text-neutral-400">Já tem cadastro?</p>
        <Button
          type="button"
          className="bg-transparent! border border-primary text-primary! hover:bg-primary! hover:text-white! shadow-none hover:shadow-lg hover:shadow-primary/20"
          onClick={() => navigate('/login')}
          disabled={loading}
        >
          Entrar na minha conta
        </Button>
      </div>
    </div>
  );
}