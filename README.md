# Manto Store

<p align="center">
  <a href="https://manto-store-eight.vercel.app/"><strong>Acessar a aplicação</strong></a>
</p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white">
  <img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white">
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?logo=firebase&logoColor=black">
  <img alt="Vitest" src="https://img.shields.io/badge/Vitest-enabled-6E9F18?logo=vitest&logoColor=white">
  <img alt="ESLint" src="https://img.shields.io/badge/ESLint-configured-4B32C3?logo=eslint&logoColor=white">
  <img alt="SPA" src="https://img.shields.io/badge/SPA-enabled-2563EB">
  <img alt="PWA não configurado" src="https://img.shields.io/badge/PWA-not%20configured-lightgrey">
</p>

**Manto Store** é uma aplicação de e-commerce especializada em camisas de futebol. A experiência combina catálogo organizado por coleções, busca paginada, autenticação e carrinho sincronizado, com uma interface responsiva construída para navegação fluida.

> O projeto é uma SPA. Não há configuração de instalação offline ou manifesto de PWA neste repositório.

## Arquitetura e decisões técnicas

### Arquitetura de aplicação

- **Frontend:** React 19 e Vite 8, com navegação cliente por React Router.
- **Backend como serviço (BaaS):** Firebase Authentication para sessão e Firebase Firestore como persistência NoSQL.
- **Organização:** páginas por rota, componentes reutilizáveis, contexto de autenticação, serviços de integração e utilitários de domínio.
- **Entrega:** build estático gerado pelo Vite, adequado a hospedagem em plataforma de conteúdo estático.

### Performance

- **Code splitting por rota:** páginas são carregadas com `React.lazy` e exibem estados de carregamento com `Suspense`. No build atual, chunks individuais de páginas ficam abaixo de 350 kB. O chunk compartilhado do Firebase mede aproximadamente **351,5 kB sem gzip**; portanto, o limite de 350 kB não se aplica a todos os chunks.
- **Paginação com cursores Firestore:** busca e coleções carregam resultados em páginas, usando `limit` e `startAfter` com o último documento recebido, evitando paginação por deslocamento.
- **Ciclo de vida controlado:** efeitos limpam inscrições em tempo real e timers no desmontar do componente. A busca também evita aplicar resultados de requisições obsoletas.
- **Memoização pontual:** callbacks do carrinho e da calculadora de frete usam `useCallback`; cálculos são mantidos próximos dos dados que os alimentam, sem memoização indiscriminada.

### Segurança e acesso a dados

As regras de [firestore.rules](./firestore.rules) adotam negação por padrão e permissões específicas por coleção:

- Carrinhos (`carrinhos`) e documentos de usuário (`users` e `profiles`) são acessíveis apenas ao usuário cujo UID corresponde ao caminho do documento (`request.auth.uid`).
- Produtos (`camisas`, `products` e `produtos`) têm leitura pública e escrita restrita a tokens autenticados com a custom claim `admin: true`.
- Pedidos (`orders`) podem ser lidos pelo usuário autenticado associado ao pedido; as regras não concedem gravação pelo cliente nessa coleção.
- A regra final bloqueia qualquer acesso que não tenha sido explicitamente permitido.

> As regras do Firestore são a fronteira de autorização dos dados. A configuração de claims administrativas e a validação de fluxos de negócio devem ser feitas em ambiente confiável, não pelo cliente.

## Qualidade e engenharia de software

- **Vitest + React Testing Library:** testes de componentes e contextos em ambiente `jsdom`.
- **Escopo validado:** carrinho, busca, paginação de busca e coleções, além do estado de autenticação.
- **Isolamento de dependências externas:** testes mockam Firebase Auth e Firestore, sem depender de serviços remotos.
- **ESLint:** configuração de lint para validar o código JavaScript/JSX. A execução realizada para esta revisão terminou com **0 erros e 0 avisos**.

O comando `npm run lint` verifica o código configurado pelo ESLint; ele não analisa a formatação nem o conteúdo deste README.

## Desenvolvimento local e emuladores

### Pré-requisitos

- Node.js compatível com Vite 8 (Node.js 20.19+ ou 22.12+).
- npm.
- Firebase CLI disponível como `firebase` no terminal para executar os emuladores.

### Instalação

```bash
npm install
```

Crie um arquivo `.env.local` na raiz com a configuração do projeto Firebase. Para desenvolvimento isolado, use o mesmo ID de projeto no cliente e nos emuladores:

```env
VITE_FIREBASE_API_KEY=chave-local
VITE_FIREBASE_AUTH_DOMAIN=localhost
VITE_FIREBASE_PROJECT_ID=manto-store-local
VITE_FIREBASE_STORAGE_BUCKET=manto-store-local.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:local
VITE_FIREBASE_MEASUREMENT_ID=
VITE_USE_FIREBASE_EMULATOR=true
```

Quando `VITE_USE_FIREBASE_EMULATOR=true` em desenvolvimento, o serviço do cliente conecta Authentication em `127.0.0.1:9099` e Firestore em `127.0.0.1:8080`. Essas portas e os emuladores estão declarados em [firebase.json](./firebase.json).

Em um terminal, inicie os emuladores:

```bash
firebase emulators:start --only auth,firestore --project manto-store-local
```

Em outro terminal, execute a aplicação:

```bash
npm run dev
```

O servidor local do Vite informa a URL ao iniciar (por padrão, `http://localhost:5173`). Sem o emulador, configure as credenciais de um projeto Firebase apropriado e defina `VITE_USE_FIREBASE_EMULATOR` como `false` ou remova a variável.

### Comandos principais

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia a aplicação em modo de desenvolvimento com HMR. |
| `npm run lint` | Executa o ESLint. |
| `npm run test` | Executa a suíte Vitest uma vez. |
| `npm run build` | Gera a versão de produção em `dist/`. |
| `npm run preview` | Serve localmente o build de produção. |

## Estrutura do projeto

```text
src/
├── assets/             # Imagens e recursos estáticos importados
├── components/         # UI reutilizável: layout, cartões, frete e navegação
├── contexts/           # Estado e contexto de autenticação
├── pages/              # Home, produto, carrinho, coleção, busca e conta
├── services/           # Inicialização Firebase e conexão opcional aos emuladores
├── styles/             # Estilos globais
├── utils/              # Regras de oferta e distribuição de produtos
├── App.jsx             # Rotas, lazy loading e composição da aplicação
├── main.jsx            # Ponto de entrada React
└── setupTests.js       # Configuração compartilhada dos testes
```

## Recursos implementados

- **Autenticação:** cadastro, login, recuperação de senha e contexto para acompanhar a sessão Firebase.
- **Carrinho:** leitura em tempo real do carrinho do usuário, atualização de quantidade, remoção de itens e cálculo de subtotal e total.
- **Cálculo de frete:** consulta de CEP pelo ViaCEP e estimativa de opções PAC/SEDEX com base em região, peso e dimensões dos itens.
- **Busca de catálogo:** pesquisa por texto, com normalização de acentos e carregamento progressivo por cursores.
- **Coleções e filtros:** navegação por país/time e consulta paginada das coleções.
- **Home:** seções de produtos em carrossel e animação de entrada com respeito à preferência por movimento reduzido.
- **Detalhes de produto:** galeria, seleção de tamanho e personalização quando disponível nos dados do produto.

## Observações de escopo

O fluxo presente cobre navegação, catálogo, autenticação, carrinho e estimativa de frete. Não há integração de pagamento nem finalização transacional de pedidos descrita como fluxo completo neste README. Da mesma forma, o badge de PWA permanece explicitamente como não configurado.
