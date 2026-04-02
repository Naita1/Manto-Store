import { useAuth } from '../../contexts/UseAuth'; 
import { useState, useRef } from 'react';

import { Input } from '../Input';
import { Button } from '../Button';
import { Toast } from 'primereact/toast';

import './RegisterCard.css';

export function RegisterCard() {
    const toast = useRef(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const { signUp } = useAuth();
    

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.current.show({ severity: 'warn', summary: 'Senhas Não Correspondem', detail: 'Por favor, verifique as senhas digitadas.', life: 3000 });
            return;
        }
        try {
            await signUp(email, password, name);
            toast.current.show({ severity: 'success', summary: 'Cadastro Bem-Sucedido', detail: 'Bem-vindo à Manto Store!', life: 3000 });
        } catch (error) {
            console.error(error);
            toast.current.show({ severity: 'error', summary: 'Erro de Cadastro', detail: error.message, life: 3000 });
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