import { useAuth } from '../../contexts/UseAuth';
import { useState, useRef } from 'react';

import { Toast } from 'primereact/toast';
import { Button } from '../Button';
import { Input } from '../Input';

import './LoginCard.css';

export function LoginCard() {

  const toast = useRef(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {login} = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try{
      await login(email, password);
      toast.current.show({ severity: 'success', summary: 'Login Bem-Sucedido', detail: 'Bem-vindo de volta!', life: 3000 });
      setEmail('');
      setPassword('');
    }
    catch(error){
      console.error(error);
      if(error.code === 'auth/user-not-found'){
        toast.current.show({ severity: 'warn', summary: 'Usuário Não Encontrado', detail: 'Verifique seu e-mail ou cadastre-se.', life: 3000 });
      }else{
        toast.current.show({ severity: 'error', summary: 'Erro de Login', detail: error.message, life: 3000 });
      }
    }
  }

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
        />
        
        <Input 
          id="senha-login" 
          label="Senha" 
          type="password" 
          placeholder="Sua senha" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <a href="#" className="forgot-password">Esqueci minha senha</a>
        
        <Button type="submit">Entrar</Button>
      </form>
    </div>
  );
}