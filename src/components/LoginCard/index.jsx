import { Input } from '../Input';
import { Button } from '../Button';
import './LoginCard.css';

export function LoginCard() {
  return (
    <div className="card-container">
      <h2 className="card-title">Já sou cadastrado</h2>
      
      <form className="card-form">
        
        <Input 
          id="email-login" 
          label="E-mail" 
          type="email" 
          placeholder="exemplo@email.com" 
        />
        
        <Input 
          id="senha-login" 
          label="Senha" 
          type="password" 
          placeholder="Sua senha" 
        />
        
        <a href="#" className="forgot-password">Esqueci minha senha</a>
        
        <Button type="submit">Entrar</Button>
      </form>
    </div>
  );
}