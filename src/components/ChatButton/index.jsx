import { useState, useEffect, useRef } from 'react';
import './ChatButton.css';

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  
  const initialMessage = { id: 1, text: "Oi! Como posso te ajudar hoje?", sender: 'bot' };

  const [messages, setMessages] = useState([initialMessage]);
  const [showOptions, setShowOptions] = useState(true);
  const [isFinished, setIsFinished] = useState(false); 
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);
  const toggleChat = () => setIsOpen(!isOpen);

  const chatOptions = [
    { 
      id: 'opt1', 
      text: 'Prazo de entrega', 
      botReply: 'Para o seu CEP, a entrega leva em média de 3 a 5 dias úteis!' 
    },
    { 
      id: 'opt2', 
      text: 'Formas de pagamento', 
      botReply: 'Aceitamos PIX, cartões de crédito em até 12x e boleto bancário.' 
    },
    { 
      id: 'opt3', 
      text: 'Rastrear pedido', 
      botReply: 'Você pode rastrear o seu pedido na seção "Meus Pedidos" do seu perfil.' 
    }
  ];

  const handleOptionClick = (option) => {
    const newUserMsg = { id: Date.now(), text: option.text, sender: 'user' };
    setMessages((prev) => [...prev, newUserMsg]);
    setShowOptions(false);

    setTimeout(() => {
      const newBotMsg = { id: Date.now() + 1, text: option.botReply, sender: 'bot' };
      setMessages((prev) => [...prev, newBotMsg]);
      
      setTimeout(() => {
        setIsFinished(true);
      }, 500);
    }, 800);
  };

  const backToMenu = () => {
    setIsFinished(false);
    setShowOptions(true);
    const reminderMsg = { id: Date.now(), text: "Posso ajudar com algo mais?", sender: 'bot' };
    setMessages((prev) => [...prev, reminderMsg]);
  };

  return (
    <>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>Atendimento Manto Store</span>
            <button className="close-button" onClick={toggleChat}>X</button>
          </div>
          
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}

            {showOptions && (
              <div className="chat-options-container">
                {chatOptions.map((opt) => (
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
                  ← Voltar para o menu principal
                </button>
              </div>
            )}
          </div>

          <div className="chat-footer">
             <div className="footer-status">Chat - Manto Store</div>
          </div>
        </div>
      )}

      <button className="chat-button" onClick={toggleChat}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" />
        </svg>
      </button>
    </>
  );
}