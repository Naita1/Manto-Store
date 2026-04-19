import { useAuth } from '../../contexts/UseAuth'; 
import { useState } from 'react';

import { useNavigate } from 'react-router-dom'; 

import { Input } from '../Input';
import { Button } from '../Button';
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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error('As senhas não coincidem!');
    }

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
      console.error("Erro no cadastro:", error.code);
      const friendlyMessage = registerErrorMessages[error.code] || 'Erro ao criar conta. Tente novamente.';
      
      toast.error(friendlyMessage);
    }
  };

  return (
    <div className='card-container'>
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
        />

        <Input
          id="email-register"
          label="E-mail"
          type="email"
          placeholder="exemplo@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          id="password-register"
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          id="confirm-password"
          label="Confirme a Senha"
          type="password"
          placeholder="Confirme sua senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit">Cadastrar</Button>
      </form>
      
      <div className="login-section">
        <p className="login-text">Já tem cadastro?</p>
        <Button 
          type="button" 
          className="button-secondary"
          onClick={() => navigate('/login')}
        >
          Entrar na minha conta
        </Button>
      </div>
    </div>
  );
}