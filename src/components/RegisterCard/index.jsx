import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; 
import { Button } from '../Button';
import { Input } from '../Input';
import './RegisterCard.css';


export function RegisterCard() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const { signUp } = useAuth();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return alert("As senhas não coincidem!");
        }

        try {
            await signUp(email, password, name);
            alert("Conta criada com sucesso! Agora pode adicionar produtos ao carrinho.");
        } catch (error) {
            console.error(error);
            alert("Erro ao cadastrar: " + error.message);
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
        </div>
    );
}