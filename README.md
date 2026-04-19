#  Manto Store

> Uma plataforma de e-commerce premium voltada para a venda de camisas de futebol, com foco em uma experiência de usuário imersiva, design dark moderno e navegação fluida.

**Acesse o projeto online:** [Manto Store - Vercel](https://manto-store-eight.vercel.app/)

---

##  Identidade Visual (Paleta de Cores)

O design foi construído para transmitir uma sensação "premium" e focada no esporte, utilizando um tema escuro de alto contraste.

| Cor | Hexadecimal | Uso Principal |
| :--- | :--- | :--- |
| **Primary** | `#B22222` | Botões de ação, ícones, destaques e painéis expansíveis (Accordions). |
| **Background** | `#121212` | Fundo principal da aplicação, criando o ambiente "Dark Mode". |
| **Card / Surface**| `#1E1E1E` | Fundo de caixas de informação, modais e cards de produtos. |
| **Text** | `#FFFFFF` | Textos principais, títulos e informações de alto nível. |

---

##  Funcionalidades Principais

###  Catálogo e Produto
* **Galeria Interativa com Zoom:** Página de detalhes com sistema de miniaturas e um efeito de lupa (zoom) ao passar o mouse sobre a imagem principal da camisa.
* **Personalização de Manto:** Os usuários podem adicionar Nome e Número personalizados à camisa antes de adicionar ao carrinho.
* **Calculadora de Frete:** Integração na página do produto para simular prazos e valores de entrega baseados no CEP.
* **Detalhes em Accordion:** Informações dinâmicas divididas em abas expansíveis (Descrição, Tabela de Medidas, Avaliações e Dúvidas), otimizando o espaço da tela.
* **Carrossel de Recomendações:** Seção "Você também pode gostar" exibindo um carrossel horizontal dinâmico com outros itens do banco de dados.

### 🛒 Carrinho e Checkout
* **Carrinho Inteligente:** Controle de quantidade (botões + e -), agrupamento automático de itens idênticos e cálculo de subtotal/total em tempo real.
* **Resumo do Pedido:** Interface limpa que exibe as preferências de pagamento e o endereço de entrega salvo pelo usuário.

### 👤 Perfil e Gestão
* **Painel do Usuário:** Área logada para gerenciamento de dados pessoais, preferências de notificação (Email/SMS) e histórico de "Últimos Pedidos".
* **Integração Real-time:** Todo o fluxo (produtos, usuários, carrinhos e pedidos) é sincronizado em tempo real com o banco de dados.

---

##  Tecnologias Utilizadas

| Tecnologia | Descrição |
| :--- | :--- |
| **React (Vite)** | Biblioteca principal para construção da interface de usuário (UI). |
| **React Router Dom** | Gerenciamento de rotas e navegação fluida entre páginas (SPA). |
| **Firebase Firestore** | Banco de dados NoSQL em nuvem para armazenar o catálogo, carrinhos individuais e histórico de usuários. |
| **Firebase Auth** | Autenticação e gerenciamento seguro de sessões. |
| **CSS3 Avançado** | Estilização "Pixel Perfect" construída do zero, animações (keyframes, transições de grid) e responsividade para dispositivos móveis. |

---
