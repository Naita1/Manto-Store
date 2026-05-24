# 🏆 Manto Store

<div align="center">

[![Vercel Deploy](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://manto-store-eight.vercel.app/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/firebase-%23FFA400.svg?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

**Plataforma de e-commerce premium para camisas de futebol com experiência de usuário imersiva, design dark moderno e navegação fluida.**

[🚀 Acessar Aplicação](#-acessar-aplicação) • [📋 Funcionalidades](#-funcionalidades-principais) • [🛠️ Stack Técnico](#-stack-técnico) • [📁 Estrutura](#-estrutura-do-projeto)

</div>

---

## 🎯 Sobre o Projeto

**Manto Store** é uma aplicação web full-stack que apresenta uma experiência de compra premium para entusiastas de futebol. O projeto foi desenvolvido com foco em design intuitivo, performance otimizada e integração completa com banco de dados em tempo real.

### 💡 Proposta Principal

Criar um marketplace especializado em camisas de futebol que combine:
- **Interface imersiva** com tema escuro premium
- **Personalização em tempo real** (nome e número na camisa)
- **Cálculo dinâmico de frete** com múltiplas opções de entrega
- **Autenticação segura** e gestão de perfil de usuário
- **Sincronização real-time** entre usuários e banco de dados
- **Design responsivo** para todos os dispositivos

---

## 🚀 Acessar Aplicação

**[Manto Store - Live Demo](https://manto-store-eight.vercel.app/)**

> Acesse a aplicação deployada na Vercel e explore todas as funcionalidades

---

## ✨ Funcionalidades Principais

### 🛍️ Catálogo & Produto

- **Galeria Interativa com Zoom**
  - Sistema de miniaturas para navegação fluida
  - Efeito de lupa (zoom) ao passar o mouse
  - Precarregamento automático de imagens

- **Personalização de Manto** ⚽
  - Adicione nome e número personalizados
  - Visualização em tempo real
  - Validação de caracteres

- **Calculadora de Frete Dinâmica**
  - Cálculo baseado em CEP
  - Múltiplas opções de entrega
  - Prazos por região
  - Simulação em tempo real

- **Acordeões de Informação**
  - Descrição detalhada
  - Tabela de medidas
  - Avaliações (espaço preparado)
  - FAQ de dúvidas

- **Carrossel de Recomendações**
  - "Você também pode gostar"
  - Navegação suave
  - Produtos relacionados

### 🛒 Carrinho & Checkout

- **Carrinho Inteligente**
  - Controle de quantidade (+ / -)
  - Agrupamento automático de itens idênticos
  - Cálculo automático de subtotal/total
  - Sincronização real-time com Firebase

- **Resumo do Pedido**
  - Visualização clara de itens
  - Endereço de entrega
  - Método de pagamento
  - Total com impostos

### 👤 Autenticação & Perfil

- **Sistema de Autenticação**
  - Registro e login seguros
  - Recuperação de senha
  - Validação de email
  - Sessão persistente

- **Painel do Usuário**
  - Gerenciamento de dados pessoais
  - Histórico de pedidos
  - Preferências de notificação
  - Endereços salvos

### 🔍 Busca & Filtros

- **Busca Avançada**
  - Busca por nome/palavras-chave
  - Filtro por coleções (times)
  - Filtro por preço
  - Ordenação (preço, popularidade)

- **Navegação Inteligente**
  - Sistema de coleções
  - Sidebar dinâmica
  - Breadcrumbs de navegação
  - Links de filtros rápidos

### 💬 Suporte & Experiência

- **Chat Support** (UI preparada)
  - Botão flutuante
  - Central de ajuda
  - FAQ integrado
  - Sistema de notificações toast

---

## 🛠️ Stack Técnico

### Frontend
| Tecnologia | Versão | Uso |
|:---|:---:|:---|
| **React** | 19.2.4 | Biblioteca principal para UI |
| **Vite** | 8.0.1 | Build tool e dev server |
| **React Router DOM** | 7.14.1 | Roteamento SPA e navegação |
| **Tailwind CSS** | 4.3.0 | Estilização e utilidades (preparado) |
| **Lucide React** | 1.16.0 | Ícones vetoriais modernos |
| **React Hot Toast** | 2.6.0 | Notificações e toasts |

### Backend & Infraestrutura
| Tecnologia | Versão | Uso |
|:---|:---:|:---|
| **Firebase Firestore** | 12.11.0 | Banco de dados NoSQL em tempo real |
| **Firebase Auth** | 12.11.0 | Autenticação e gerenciamento de sessão |
| **PrimeReact** | 10.9.7 | Componentes UI adicionais |
| **Radix UI** | 1.4.3 | Componentes acessíveis |

### Utilitários & Dev
| Tecnologia | Uso |
|:---|:---|
| **ESLint** | Linting e padronização de código |
| **Vite TSConfig Paths** | Aliases para imports |
| **PostCSS & Autoprefixer** | Processamento e compatibilidade CSS |

### Características de Implementação
- ✅ CSS custom construído do zero (pixel perfect)
- ✅ Animações avançadas (keyframes, transições grid)
- ✅ Responsividade completa (mobile-first)
- ✅ Sincronização real-time com Firestore
- ✅ Context API para gerenciamento de estado
- ✅ Hooks customizados e otimizações

---

## 📁 Estrutura do Projeto

```
manto-store/
├── src/
│   ├── components/               # Componentes reutilizáveis
│   │   ├── Button/              # Botão genérico
│   │   ├── Header/              # Navegação principal
│   │   ├── Footer/              # Rodapé
│   │   ├── ProductCard/         # Card de produto
│   │   ├── ShippingCalculator/  # Calculadora de frete
│   │   ├── LoginCard/           # Formulário de login
│   │   ├── RegisterCard/        # Formulário de registro
│   │   ├── Input/               # Campo de input
│   │   ├── Loading/             # Skeleton/loader
│   │   ├── ChatButton/          # Suporte flutuante
│   │   ├── Sidebar/             # Filtros laterais
│   │   ├── Toast/               # Sistema de notificações
│   │   ├── Help/                # Central de ajuda
│   │   └── MainLayout/          # Layout principal
│   │
│   ├── pages/                    # Páginas (rotas)
│   │   ├── Home/                # Homepage com catálogo
│   │   ├── Product/             # Detalhes do produto
│   │   ├── Cart/                # Carrinho de compras
│   │   ├── Collection/          # Coleção de produtos
│   │   ├── Search/              # Página de busca
│   │   ├── Login/               # Página de login
│   │   ├── Register/            # Página de registro
│   │   └── Profile/             # Perfil do usuário
│   │
│   ├── contexts/                 # Context API
│   │   └── AuthContext.jsx      # Contexto de autenticação
│   │
│   ├── services/                 # Serviços externos
│   │   └── firebase.js          # Configuração Firebase
│   │
│   ├── utils/                    # Funções utilitárias
│   │   ├── offerRules.js        # Lógica de descontos
│   │   └── productDistribution.js # Distribuição de produtos
│   │
│   ├── styles/                   # Estilos globais
│   │   └── global.css           # CSS global
│   │
│   ├── assets/                   # Imagens e midia
│   ├── App.jsx                  # Componente raiz
│   └── main.jsx                 # Entry point
│
├── public/                       # Arquivos estáticos
├── vite.config.js               # Configuração Vite
├── eslint.config.js             # Configuração ESLint
├── components.json              # Config componentes
└── package.json                 # Dependências e scripts
```

---

## 🏗️ Arquitetura & Fluxo

```
┌─────────────────────────────────────────────────────────┐
│                    MANTO STORE - ARQUITETURA             │
└─────────────────────────────────────────────────────────┘

FRONTEND (React + Vite)
├── Pages (Roteadas com React Router)
│   ├── HomePage (Catálogo + Carrossel)
│   ├── ProductPage (Detalhes + Personalização)
│   ├── CartPage (Carrinho + Cálculo)
│   ├── SearchPage (Busca avançada)
│   └── ProfilePage (Dados do usuário)
│
├── Components (Reutilizáveis)
│   ├── Header (Navegação)
│   ├── Sidebar (Filtros)
│   └── ProductCard (Card do produto)
│
└── Context (Gerenciamento de Estado)
    └── AuthContext (Usuário + Sessão)

        ↓ ↓ ↓

BACKEND (Firebase)
├── Firestore (Banco de dados)
│   ├── Products (Catálogo)
│   ├── Users (Perfis)
│   ├── Carts (Carrinhos)
│   └── Orders (Pedidos)
│
└── Authentication (Firebase Auth)
    ├── Email/Password
    ├── Session Management
    └── Token Handling

        ↓ ↓ ↓

FEATURES
├── Real-time Sync (onSnapshot)
├── Dynamic Pricing (Descontos)
├── Shipping Calculator (CEP-based)
└── Product Personalization
```

### Fluxo de Autenticação
```
Usuário → Login/Register → Firebase Auth
                                ↓
                        Session Verificada
                                ↓
                        AuthContext Atualizado
                                ↓
                    App Renderiza Conteúdo Protegido
```

### Fluxo de Compra
```
Produto → Personalização → Carrinho (Real-time)
                                ↓
                        Cálculo de Frete
                                ↓
                        Resumo do Pedido
                                ↓
                    Sincronização Firebase
```

---

## 📱 Responsividade

A aplicação foi desenvolvida com **mobile-first approach**:

- ✅ **Desktop** (1024px+) - Layout completo com sidebar
- ✅ **Tablet** (768px - 1024px) - Adaptações de grid
- ✅ **Mobile** (320px - 768px) - Navegação otimizada
- ✅ **Micro-interações** - Animações fluidas em todos os tamanhos
- ✅ **Touch-friendly** - Botões otimizados para toque

---

## 🎨 Design & Identidade Visual

### Paleta de Cores Premium

| Cor | Hexadecimal | Utilização |
|:---|:---:|:---|
| **Primary** | `#B22222` | Botões, ícones, destaques, accordeões |
| **Background** | `#121212` | Fundo principal (Dark Mode) |
| **Surface** | `#1E1E1E` | Cards, modais, caixas de informação |
| **Text** | `#FFFFFF` | Textos, títulos, informações primárias |

### Tipografia
- **Font Family**: Inter Variable (Google Fonts)
- **Escalas**: Robusta e consistente
- **Contraste**: AAA (Acessibilidade)

### Componentes Visuais
- Sistema de ícones vetoriais (Lucide React)
- Animações customizadas (CSS keyframes)
- Transições suaves (Grid transitions)
- Efeitos de hover e estados ativos

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- **Node.js** 16+ e **npm** ou **yarn**
- Conta **Firebase** (Firestore + Authentication)
- Variáveis de ambiente configuradas

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/manto-store.git
cd manto-store
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

Obtenha essas credenciais no [Firebase Console](https://console.firebase.google.com/)

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## 📦 Scripts Disponíveis

| Script | Descrição |
|:---|:---|
| `npm run dev` | Inicia servidor de desenvolvimento com HMR |
| `npm run build` | Build otimizado para produção |
| `npm run preview` | Visualiza build de produção localmente |
| `npm run lint` | Executa ESLint para verificar código |

---

## 🔐 Variáveis de Ambiente

### Desenvolvimento
```bash
VITE_FIREBASE_*  # Credenciais Firebase
NODE_ENV=development
```

### Produção
- Variáveis configuradas no Vercel Dashboard
- Build otimizado com minificação
- Assets servidos de CDN

---

## 💡 Diferenciais Técnicos

### ✅ Performance
- **Lazy loading** de componentes
- **Code splitting** automático (Vite)
- **Asset optimization** (Imagens comprimidas)
- **Caching** inteligente com Firebase

### ✅ UX/UI
- **Animações smooth** sem jank
- **Loading states** definidos
- **Toast notifications** para feedback
- **Accordeões dinâmicos** para economia de espaço

### ✅ Segurança
- **Firebase Auth** para autenticação segura
- **Validação** de entrada no cliente
- **HTTPS** em produção
- **Regras de segurança** no Firestore

### ✅ Acessibilidade
- **Semântica HTML** correta
- **ARIA labels** nos elementos
- **Contraste de cores** otimizado
- **Navegação por teclado**

### ✅ Organização de Código
- **Estrutura modular** com componentes reutilizáveis
- **Separação de responsabilidades** (Context, Utils, Services)
- **Naming conventions** consistentes
- **CSS-in-components** para isolamento

---

## 🎯 Funcionalidades por Página

### 🏠 Home
- Banners e destaque de coleções
- Carrossel de produtos featured
- Múltiplas seções de catálogo
- Filtros by team/collection
- Lazy loading de imagens

### 📦 Produto
- Galeria interativa com zoom
- Personalização (nome/número)
- Calculadora de frete
- Acordeões de informação
- Carrossel de recomendações
- Avaliações (preparado)

### 🛒 Carrinho
- Listagem de itens com imagens
- Controle de quantidade
- Cálculo automático de total
- Integração com frete
- Resumo de pedido

### 🔍 Busca
- Campo de busca avançado
- Filtros por preço
- Ordenação (preço, nome)
- Resultados em grid

### 👤 Perfil
- Dados do usuário
- Histórico de pedidos
- Endereços salvos
- Preferências de notificação

### 🔑 Autenticação
- Login com email/senha
- Registro de novo usuário
- Recuperação de senha
- Validações em tempo real

---

## 🔄 Melhorias Futuras

### Curto Prazo
- [ ] Sistema de avaliações (reviews com estrelas)
- [ ] Wishlist / Favoritos
- [ ] Cupons de desconto
- [ ] Checkout completo (pagamento)

### Médio Prazo
- [ ] Integração com Stripe/PayPal
- [ ] Sistema de recomendação IA
- [ ] Notificações push
- [ ] Social login (Google, GitHub)

### Longo Prazo
- [ ] App mobile nativo (React Native)
- [ ] Painel administrativo
- [ ] Analytics avançado
- [ ] Programa de fidelidade
- [ ] Sistema de afiliados

---

## 📊 Estatísticas do Projeto

| Métrica | Valor |
|:---|:---:|
| **Componentes** | 15+ |
| **Páginas** | 8 |
| **Linhas de Código** | 2000+ |
| **Pacotes NPM** | 20+ |
| **Tempo de Build** | ~1s |
| **Tamanho do Bundle** | <500KB |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ como projeto de portfólio.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/seu-usuario)
[![GitHub](https://img.shields.io/badge/GitHub-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/seu-usuario)

---

## 📞 Suporte

Encontrou um problema? Abra uma [issue](https://github.com/seu-usuario/manto-store/issues) no repositório.

---

<div align="center">

**[⬆ Voltar ao topo](#-manto-store)**

Feito com ❤️ para a comunidade dev

</div>
