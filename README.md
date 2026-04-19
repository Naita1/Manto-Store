# ⚽ Manto Store

> Um e-commerce front-end moderno e responsivo dedicado à venda de camisas de futebol, com foco na melhor experiência de utilizador (UX) e segurança.

🌐 **Aceda ao projeto em produção:** [Manto Store - Live Demo](https://manto-store-eight.vercel.app/)

---

## 📖 Sobre o Projeto

A **Manto Store** é uma aplicação web desenvolvida para simular uma loja online de artigos desportivos. O grande diferencial deste projeto é o cuidado com a interface e a interação do utilizador, oferecendo fluxos de autenticação fluidos, tratamento de erros amigável e componentes visuais interativos.

Um dos principais destaques técnicos é o sistema de registo, que conta com um **Medidor de Força de Senha Dinâmico** (Password Strength Meter) criado do zero, que orienta o utilizador a criar credenciais seguras através de feedback visual em tempo real.

## ✨ Funcionalidades Principais

- **Autenticação de Utilizadores:** Fluxo completo de Sign Up e Sign In.
- **Validação Dinâmica de Palavra-passe:** - Verificação em tempo real de requisitos (mínimo de 8 caracteres, maiúsculas, minúsculas, números e caracteres especiais).
  - Barra de progresso visual que muda de cor (Vermelho -> Laranja -> Amarelo -> Verde) conforme a força da senha.
  - Bloqueio inteligente de submissão para garantir a integridade dos dados e confirmação de senha.
- **Notificações Amigáveis (Toasts):** Feedback imediato de sucesso ou erro nas ações do utilizador (ex: credenciais inválidas, conta criada).
- **Design Responsivo:** Interface adaptável (Mobile-First) que funciona perfeitamente em smartphones, tablets e desktops.
- **Interface Minimalista (UI/UX):** Componentes limpos, transições suaves e foco na usabilidade.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias e bibliotecas:

- **[React](https://reactjs.org/)** - Biblioteca JavaScript para construção da interface.
- **[React Router Dom](https://reactrouter.com/)** - Navegação e roteamento de páginas (SPA).
- **[React Hot Toast](https://react-hot-toast.com/)** - Sistema de notificações e alertas.
- **Context API** - Gestão de estado global (utilizado no `AuthContext` para a sessão do utilizador).
- **CSS3 / CSS Modules** - Estilização pura com variáveis CSS para fácil manutenção e temas.
- **Vercel** - Hospedagem e CI/CD.

## 🚀 Como executar o projeto localmente

Para clonar e executar esta aplicação, vai precisar do [Git](https://git-scm.com) e do [Node.js](https://nodejs.org/) instalados no seu computador.

No seu terminal, execute os seguintes comandos:

```bash
# Clone este repositório
$ git clone [https://github.com/SEU-USUARIO/manto-store.git](https://github.com/SEU-USUARIO/manto-store.git)

# Aceda à pasta do projeto
$ cd manto-store

# Instale as dependências
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run dev