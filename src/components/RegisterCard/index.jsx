import { useAuth } from '../../contexts/UseAuth'; 
import { useState, useRef } from 'react';

import { Input } from '../Input';
import { Button } from '../Button';
import { Toast } from 'primereact/toast';

import './RegisterCard.css';

const registerErrorMessages = {
  'auth/email-already-in-use': 'Este e-mail já está em uso.',
  'auth/invalid-email': 'E-mail inválido.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/network-request-failed': 'Erro de conexão com o servidor.'
};

export function RegisterCard() {
  const toast = useRef(null);
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.current.show({ 
        severity: 'warn', 
        summary: 'Atenção', 
        detail: 'As senhas não coincidem!', 
        life: 3000 
      });
    }

    try {
      await signUp(email, password, name);
      
      toast.current.show({ 
        severity: 'success', 
        summary: 'Conta Criada!', 
        detail: 'Bem-vindo à Manto Store!', 
        life: 3000 
      });
      
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } 
    catch (error) {
      console.error("Erro no cadastro:", error.code);
      
      const friendlyMessage = registerErrorMessages[error.code] || 'Erro ao criar conta. Tente novamente.';

      toast.current.show({ 
        severity: 'error', 
        summary: 'Erro no Registro', 
        detail: friendlyMessage, 
        life: 4000 
      });
    }
  };

  return (
    <div className='card-container'>
      <Toast ref={toast}/>
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
    </div>
  );
}