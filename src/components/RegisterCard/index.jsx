import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

import { Input } from '../Input';
import { Button } from '../Button';
import { Loading } from '../Loading'; 
import toast from 'react-hot-toast';

import './RegisterCard.css';

const registerErrorMessages = {
  'auth/email-already-in-use': 'Este e-mail já está em uso.',
  'auth/invalid-email': 'E-mail inválido.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/network-request-failed': 'Erro de conexão com o servidor.'
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
      
      setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
      setTimeout(() => {
        navigate('/login'); 
      }, 2000);

    } catch (error) {
      console.error("Erro no cadastro:", error.code);
      const friendlyMessage = registerErrorMessages[error.code] || 'Erro ao criar conta. Tente novamente.';
      toast.error(friendlyMessage);
      setLoading(false); 
    }
  };

  return (
    <div className='card-container'>
      {loading && <Loading message="Criando sua conta..." />}
      
      <h2 className='card-title'>Primeiro Acesso</h2>
      
      <form className='card-form' onSubmit={handleRegister}>
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

        <div className="password-input-group">
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

          {password.length > 0 && (
            <div className="strength-indicator">
              <div className="strength-bar-container">
                <div 
                  className="strength-bar-fill" 
                  style={{ 
                    width: `${(metCriteriaCount / 5) * 100}%`, 
                    backgroundColor: getStrengthColor() 
                  }}
                ></div>
              </div>
              <span className="strength-text" style={{ color: getStrengthColor() }}>
                {getStrengthText()}
              </span>
            </div>
          )}
          
          {password.length > 0 && !isPasswordStrong && (
            <p className="password-hint">
              Dica: Use 8+ caracteres, letras (A, a), números e símbolos (!@#$).
            </p>
          )}
        </div>

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

        <Button 
          type="submit" 
          disabled={loading || !isPasswordStrong || password !== confirmPassword}
          style={{ marginTop: '1rem' }}
        >
          Cadastrar
        </Button>
      </form>
      
      <div className="login-section">
        <p className="login-text">Já tem cadastro?</p>
        <Button 
          type="button" 
          className="button-secondary"
          onClick={() => navigate('/login')}
          disabled={loading}
        >
          Entrar na minha conta
        </Button>
      </div>
    </div>
  );
}