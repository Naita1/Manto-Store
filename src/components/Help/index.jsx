import { useState, useCallback, useEffect, useRef } from 'react';
import { Loading } from '../../components/Loading';

const FAQS = [
  {
    id: 1,
    question: 'Qual é o prazo de entrega?',
    answer: 'O prazo varia de acordo com o seu CEP. Em média, as entregas levam de 3 a 5 dias úteis após a confirmação do pagamento.',
  },
  {
    id: 2,
    question: 'As camisas podem ser personalizadas?',
    answer: "Sim! Trabalhamos com fontes oficiais. Na página do produto, basta preencher os campos 'Nome' e 'Número' antes de adicionar ao carrinho.",
  },
  {
    id: 3,
    question: 'Como funciona a política de trocas?',
    answer: 'A primeira troca é por nossa conta! Você tem até 30 dias após o recebimento para solicitar. Atenção: itens personalizados não podem ser trocados, exceto por defeito de fabricação.',
  },
  {
    id: 4,
    question: 'Quais as formas de pagamento?',
    answer: 'Aceitamos PIX (com 5% de desconto instantâneo), cartões de crédito em até 12x sem juros e boleto bancário.',
  },
];

const TRACKING_MOCK = {
  '12345': { status: 'Em rota de entrega',  date: 'Hoje, 08:45',    location: 'São Paulo, SP',           color: '#eab308' },
  'BR123': { status: 'Em rota de entrega',  date: 'Hoje, 08:45',    location: 'São Paulo, SP',           color: '#eab308' },
  '99999': { status: 'Pedido Entregue',     date: 'Ontem, 14:20',   location: 'Rio de Janeiro, RJ',      color: '#22c55e' },
};

const DEFAULT_TRACKING = { status: 'Pedido em Separação', date: 'Hoje, 10:00', location: 'Centro de Distribuição', color: '#3b82f6' };

const IconGitHub = () => (
  <svg className="w-6 h-6 text-[#9C2A32] group-hover:scale-110 transition-transform duration-200 mb-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const IconLinkedIn = () => (
  <svg className="w-6 h-6 text-[#9C2A32] group-hover:scale-110 transition-transform duration-200 mb-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className={`bg-[#0B0B0D] border rounded-xl transition-colors duration-200 overflow-hidden ${isOpen ? 'border-[#9C2A32]/60 bg-white/[0.01]' : 'border-white/6 hover:border-white/12'}`}>
      <button
        className="w-full text-left px-4 py-3.5 sm:px-5 sm:py-4 bg-transparent border-none text-xs sm:text-sm font-medium text-neutral-200 hover:text-white flex justify-between items-center cursor-pointer transition-colors duration-150"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{faq.question}</span>
        <span className={`text-base font-semibold text-[#9C2A32] transition-transform duration-300 ease-out select-none ml-3 ${isOpen ? 'rotate-45' : 'rotate-0'}`} aria-hidden="true">+</span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`} role="region">
        <p className={`overflow-hidden text-xs text-neutral-400 leading-relaxed transition-all duration-300 ${isOpen ? 'px-4 pb-4 sm:px-5 sm:pb-4 opacity-100' : 'px-4 pb-0 sm:px-5 sm:pb-0 opacity-0'}`}>
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export function Help() {
  const [openFaq, setOpenFaq]           = useState(null);
  const [trackingCode, setTrackingCode] = useState('');
  const [isLoading, setIsLoading]       = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const toggleFaq = useCallback((id) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  }, []);

  const handleTrackOrder = useCallback((e) => {
    e.preventDefault();
    const code = trackingCode.trim().toUpperCase();
    if (!code) return;

    setIsLoading(true);
    setTrackingResult(null);

    timerRef.current = setTimeout(() => {
      setTrackingResult(TRACKING_MOCK[code] ?? DEFAULT_TRACKING);
      setIsLoading(false);
    }, 1500);
  }, [trackingCode]);

  return (
    <div className="min-h-screen w-full bg-[#0B0B0D] text-[#ECECEE] selection:bg-[#9C2A32] selection:text-white pb-20 font-sans antialiased">
      <style>{`
        @keyframes pageReveal {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-reveal {
          opacity: 0;
          animation: pageReveal 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .stagger-1 { animation-delay: 0ms; }
        .stagger-2 { animation-delay: 60ms; }

        @media (prefers-reduced-motion: reduce) {
          .animate-reveal {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
      <div className="relative border-b border-white/8 bg-linear-to-b from-white/2 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 animate-reveal stagger-1 text-center">
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-1.5">
            Central de Ajuda
          </h1>
          <p className="text-xs text-neutral-400 font-normal leading-relaxed">
            Como podemos te ajudar hoje?
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 animate-reveal stagger-2 space-y-6">
        <section className="bg-[#131316] border border-white/8 rounded-2xl p-6 sm:p-7">
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-white/6">
            <div className="p-1.5 rounded-lg bg-[#9C2A32]/10 text-[#9C2A32]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Rastreie seu Pedido
            </h2>
          </div>

          <form className="flex flex-col sm:flex-row gap-2.5 w-full" onSubmit={handleTrackOrder}>
            <input
              type="text"
              placeholder="Código de rastreio ou nº do pedido"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-[#0B0B0D] border border-white/8 rounded-xl text-xs text-white placeholder:text-neutral-500 outline-none focus:border-[#9C2A32] transition-colors duration-200 disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-6 py-3 bg-[#9C2A32] hover:bg-[#88242B] disabled:bg-white/4 disabled:text-neutral-600 disabled:border disabled:border-white/4 disabled:cursor-not-allowed text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-all duration-200 ease-out active:scale-[0.985] transform-gpu cursor-pointer"
            >
              {isLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          {isLoading && (
            <div className="mt-4 p-8 bg-[#0B0B0D]/40 rounded-xl border border-dashed border-white/8 flex items-center justify-center">
              <Loading message="Localizando sua encomenda..." />
            </div>
          )}

          {trackingResult && !isLoading && (
            <div className="mt-4 bg-[#0B0B0D] border border-white/8 rounded-xl p-4 sm:p-5 flex items-center gap-4 transition-all duration-200">
              <div
                className="w-3.5 h-3.5 rounded-full shrink-0"
                style={{ backgroundColor: trackingResult.color, boxShadow: `0 0 10px ${trackingResult.color}` }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-white mb-0.5">{trackingResult.status}</h3>
                <p className="text-xs text-neutral-400 m-0 leading-relaxed">
                  <strong className="text-neutral-300 font-medium">Atualizado em:</strong> {trackingResult.date}
                </p>
                <p className="text-xs text-neutral-400 m-0 leading-relaxed">
                  <strong className="text-neutral-300 font-medium">Local:</strong> {trackingResult.location}
                </p>
              </div>
            </div>
          )}
        </section>
        <section className="bg-[#131316] border border-white/8 rounded-2xl p-6 sm:p-7">
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-white/6">
            <div className="p-1.5 rounded-lg bg-[#9C2A32]/10 text-[#9C2A32]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Perguntas Frequentes (FAQ)
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                isOpen={openFaq === faq.id}
                onToggle={() => toggleFaq(faq.id)}
              />
            ))}
          </div>
        </section>
        <section className="bg-[#131316] border border-white/8 rounded-2xl p-6 sm:p-7">
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-white/6">
            <div className="p-1.5 rounded-lg bg-[#9C2A32]/10 text-[#9C2A32]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Conheça a Desenvolvedora
            </h2>
          </div>

          <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
            Gostou do projeto? Conecte-se comigo nas redes!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="https://github.com/Naita1"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#0B0B0D] border border-white/6 hover:border-[#9C2A32]/50 hover:bg-white/[0.02] p-5 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-200 no-underline active:scale-[0.985] transform-gpu"
            >
              <IconGitHub />
              <h3 className="text-xs font-semibold text-neutral-200 group-hover:text-white mb-1">GitHub</h3>
              <p className="text-[11px] text-neutral-400 m-0">Veja meus projetos</p>
            </a>

            <a
              href="https://www.linkedin.com/in/taina-cl-ribeiro/"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#0B0B0D] border border-white/6 hover:border-[#9C2A32]/50 hover:bg-white/[0.02] p-5 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-200 no-underline active:scale-[0.985] transform-gpu"
            >
              <IconLinkedIn />
              <h3 className="text-xs font-semibold text-neutral-200 group-hover:text-white mb-1">LinkedIn</h3>
              <p className="text-[11px] text-neutral-400 m-0">Vamos nos conectar</p>
            </a>

            <div className="bg-[#0B0B0D] border border-dashed border-white/10 p-5 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-2xl mb-2" aria-hidden="true">💬</span>
              <h3 className="text-xs font-semibold text-neutral-200 mb-1">Chat Online</h3>
              <p className="text-[11px] text-neutral-400 m-0 leading-relaxed">Clique no ícone flutuante da tela para testar</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}