import { Button } from '../Button';
import { Input } from '../Input';
import './RegisterCard.css';

export function RegisterCard(){
    return(
        <div className='card-container'>
            <h2 className='card-title'>Primeiro Acesso</h2>
            <form className='card-form'>

                <Input
                    id="full-name"
                    label="Nome"
                    type="name"
                    placeholder = "Seu nome completo"
                />

                <Input
                    id="email-register"
                    label="E-mail"
                    type="email"
                    placeholder = "exemplo@gmail.com"
                />

                <Input
                    id="password-register"
                    label="Senha"
                    type="password"
                    placeholder = "Digite sua senha"
                />

                <Input
                    id="confirm-password"
                    label="Senha"
                    type="password"
                    placeholder = "Confirme sua senha"
                />

                <Button type="submit">Cadastrar</Button>
            </form>
        </div>
    )
}