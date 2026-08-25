import { useState, useEffect, useRef } from 'react';

const INITIAL_MESSAGE = { id: 1, text: 'Oi! Como posso te ajudar hoje?', sender: 'bot' };

const CHAT_OPTIONS = [
  { id: 'opt1', text: 'Prazo de entrega',    botReply: 'Para o seu CEP, a entrega leva em média de 3 a 5 dias úteis!' },
  { id: 'opt2', text: 'Formas de pagamento', botReply: 'Aceitamos PIX, cartões de crédito em até 12x e boleto bancário.' },
  { id: 'opt3', text: 'Rastrear pedido',     botReply: 'Você pode rastrear o seu pedido na seção "Meus Pedidos" do seu perfil.' },
];

export function ChatButton() {
  const [isOpen, setIsOpen]       = useState(false);
  const [isVisible, setIsVisible] = useState(false); 
  const [messages, setMessages]   = useState([INITIAL_MESSAGE]);
  const [showOptions, setShowOptions] = useState(true);
  const [isFinished, setIsFinished]   = useState(false);
  const chatBodyRef = useRef(null);
  const timersRef   = useRef([]);  

  const addTimeout = (callback, delay) => {
    const timerId = setTimeout(() => {
      callback();
      timersRef.current = timersRef.current.filter((id) => id !== timerId);
    }, delay);
    timersRef.current.push(timerId);
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, showOptions, isFinished]);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const openChat = () => {
    setIsOpen(true);
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  };

  const closeChat = () => {
    setIsVisible(false);
    addTimeout(() => setIsOpen(false), 250);
  };

  const toggleChat = () => (isOpen ? closeChat() : openChat());

  const handleOptionClick = (option) => {
    setMessages((prev) => [...prev, { id: Date.now(), text: option.text, sender: 'user' }]);
    setShowOptions(false);

    addTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: option.botReply, sender: 'bot' }]);

      addTimeout(() => setIsFinished(true), 350);
    }, 550);
  };

  const backToMenu = () => {
    setIsFinished(false);
    setShowOptions(true);
    setMessages((prev) => [...prev, { id: Date.now(), text: 'Posso ajudar com algo mais?', sender: 'bot' }]);
  };

  return (
    <>
      <style>{`
        @keyframes chatMsgIn {
          from {
            opacity: 0;
            transform: translate3d(0, 8px, 0) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes chatOptionIn {
          from {
            opacity: 0;
            transform: translate3d(6px, 0, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        .animate-msg-in {
          animation: chatMsgIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .animate-option-in {
          animation: chatOptionIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
      `}</style>

      {isOpen && (
        <div 
          className={`fixed bottom-26 right-8 w-[320px] h-112.5 bg-[#8B1A1A] rounded-2xl flex flex-col shadow-[0_8px_24px_rgba(0,0,0,0.3)] z-998 overflow-hidden transform-gpu transition-all duration-250 cubic-bezier(0.16,1,0.3,1) origin-bottom-right after:content-[''] after:absolute after:-bottom-3.75 after:right-5 after:border-t-15 after:border-t-[#8B1A1A] after:border-x-15 after:border-x-transparent after:border-b-0 after:w-0 after:h-0 ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95 pointer-events-none'
          }`}
        >
          <div className="bg-[#1A1A1A] text-white p-4 flex justify-between items-center font-semibold rounded-t-2xl shrink-0">
            <span>Atendimento Manto Store</span>
            <button 
              className="bg-transparent border-none text-white text-[1.1rem] cursor-pointer transition-transform duration-150 active:scale-90 hover:opacity-80 leading-none" 
              onClick={closeChat} 
              aria-label="Fechar chat"
            >
              ✕
            </button>
          </div>
          <div 
            className="flex-1 p-6 px-4 flex flex-col gap-3 overflow-y-auto scrollbar-thin [scrollbar-color:rgba(255,255,255,0.2)_transparent]" 
            ref={chatBodyRef}
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`animate-msg-in px-4 py-3 rounded-[20px] max-w-[85%] text-[0.9rem] leading-[1.4] text-[#333] ${
                  msg.sender === 'bot' 
                    ? 'bg-[#E2E2E2] self-start rounded-bl-sm' 
                    : 'bg-[#D6C4C4] self-end rounded-br-sm'
                }`}
              >
                {msg.text}
              </div>
            ))}

            {showOptions && (
              <div className="flex flex-col gap-2 mt-2 items-end">
                {CHAT_OPTIONS.map((opt, index) => (
                  <button
                    key={opt.id}
                    style={{ animationDelay: `${index * 35}ms` }}
                    className="animate-option-in bg-transparent text-[#E2E2E2] border border-[#E2E2E2] px-3 py-2 rounded-2xl text-[0.85rem] cursor-pointer transition-all duration-150 text-right max-w-[90%] hover:bg-[#E2E2E2] hover:text-[#8B1A1A] active:scale-[0.98]"
                    onClick={() => handleOptionClick(opt)}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            )}

            {isFinished && (
              <div className="flex justify-center mt-3.75 animate-msg-in">
                <button 
                  className="bg-transparent border-2 border-[#E2E2E2] text-[#E2E2E2] px-4 py-2 rounded-lg cursor-pointer text-[0.8rem] font-bold transition-all duration-150 hover:bg-[#E2E2E2] hover:text-[#8B1A1A] active:scale-95" 
                  onClick={backToMenu}
                >
                  ← Voltar ao menu
                </button>
              </div>
            )}
          </div>
          <div className="px-4 py-3 bg-black/15 flex items-center justify-center shrink-0">
            <span className="text-[0.7rem] text-[#E2E2E2] opacity-70">
              Chat · Manto Store
            </span>
          </div>
        </div>
      )}
      <button 
        className="fixed bottom-8 right-8 w-15 h-15 bg-[#c1121f] text-white border-none rounded-full flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.4)] z-999 transform-gpu transition-transform duration-200 ease-out hover:scale-105 active:scale-95" 
        onClick={toggleChat} 
        aria-label="Abrir chat de atendimento"
      >
        <svg 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          aria-hidden="true"
          className={`transform-gpu transition-transform duration-300 ease-out ${
            isOpen ? 'rotate-90' : 'rotate-0'
          }`}
        >
          {isOpen ? (
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          ) : (
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" />
          )}
        </svg>
      </button>
    </>
  );
}