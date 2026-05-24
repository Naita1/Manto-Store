import { useState, useEffect, useRef } from 'react';
import './ChatButton.css';

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

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const openChat = () => {
    setIsOpen(true);
    setIsVisible(true);
  };

  const closeChat = () => {
    setIsVisible(false);
    const t = setTimeout(() => setIsOpen(false), 280);
    timersRef.current.push(t);
  };

  const toggleChat = () => (isOpen ? closeChat() : openChat());

  const handleOptionClick = (option) => {
    setMessages((prev) => [...prev, { id: Date.now(), text: option.text, sender: 'user' }]);
    setShowOptions(false);

    const t1 = setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: option.botReply, sender: 'bot' }]);

      const t2 = setTimeout(() => setIsFinished(true), 500);
      timersRef.current.push(t2);
    }, 800);

    timersRef.current.push(t1);
  };

  const backToMenu = () => {
    setIsFinished(false);
    setShowOptions(true);
    setMessages((prev) => [...prev, { id: Date.now(), text: 'Posso ajudar com algo mais?', sender: 'bot' }]);
  };

  return (
    <>
      {isOpen && (
        <div className={`chat-window ${isVisible ? 'chat-window--open' : 'chat-window--closing'}`}>
          <div className="chat-header">
            <span>Atendimento Manto Store</span>
            <button className="close-button" onClick={closeChat} aria-label="Fechar chat">✕</button>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}

            {showOptions && (
              <div className="chat-options-container">
                {CHAT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    className="chat-option-btn"
                    onClick={() => handleOptionClick(opt)}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            )}

            {isFinished && (
              <div className="back-menu-container">
                <button className="back-menu-btn" onClick={backToMenu}>
                  ← Voltar ao menu
                </button>
              </div>
            )}
          </div>

          <div className="chat-footer">
            <span className="footer-status">Chat · Manto Store</span>
          </div>
        </div>
      )}

      <button className="chat-button" onClick={toggleChat} aria-label="Abrir chat de atendimento">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" />
        </svg>
      </button>
    </>
  );
}