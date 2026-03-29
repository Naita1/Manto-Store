import { Input } from '../Input';
import { Button } from '../Button';
import './HelpCard.css';

export function HelpCard() {
  return (
    <div className="help-card-container">
      <form className="help-form">
        
        <div className="help-columns">
          
          <div className="help-col-left">
            <Input id="help-nome" label="Nome" />
            <Input id="help-email" label="E-mail" type="email" />
            <Input id="help-telefone" label="Telefone" type="tel" />
          </div>

          <div className="help-col-right">
            <textarea className="manto-textarea" placeholder="Digite sua mensagem aqui..."></textarea>
          </div>
          
        </div>

        <Button type="submit">Enviar</Button>
      </form>
    </div>
  );
}