import { useState } from 'react';
import './Help.css';

export function Help() {
  const [openFaq, setOpenFaq] = useState(null);
  const [trackingCode, setTrackingCode] = useState('');

  const faqs = [
    {
      id: 1,
      question: "Qual é o prazo de entrega?",
      answer: "O prazo varia de acordo com o seu CEP. Em média, as entregas levam de 3 a 5 dias úteis após a confirmação do pagamento."
    },
    {
      id: 2,
      question: "As camisas podem ser personalizadas?",
      answer: "Sim! Trabalhamos com fontes oficiais. Na página do produto, basta preencher os campos 'Nome' e 'Número' antes de adicionar ao carrinho."
    },
    {
      id: 3,
      question: "Como funciona a política de trocas?",
      answer: "A primeira troca é por nossa conta! Você tem até 30 dias após o recebimento para solicitar. Atenção: itens personalizados não podem ser trocados, exceto por defeito de fabricação."
    },
    {
      id: 4,
      question: "Quais as formas de pagamento?",
      answer: "Aceitamos PIX (com 5% de desconto instantâneo), cartões de crédito em até 12x sem juros e boleto bancário."
    }
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (trackingCode) {
      alert(`Simulação: Buscando informações do pedido ${trackingCode}... Em rota de entrega!`);
      setTrackingCode('');
    }
  };

  return (
    <div className="help-page-container">
      <div className="help-header">
        <h1>Central de Ajuda</h1>
        <p>Como podemos te ajudar hoje?</p>
      </div>

      <div className="help-content">
        <section className="help-section tracking-section">
          <h2>Rastreie seu Pedido</h2>
          <form className="tracking-form" onSubmit={handleTrackOrder}>
            <input 
              type="text" 
              placeholder="Código de rastreio ou nº do pedido" 
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
            />
            <button type="submit" className="tracking-btn">Buscar</button>
          </form>
        </section>

        <section className="help-section faq-section">
          <h2>Perguntas Frequentes (FAQ)</h2>
          <div className="faq-list">
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className={`faq-item ${openFaq === faq.id ? 'open' : ''}`}
              >
                <button className="faq-question" onClick={() => toggleFaq(faq.id)}>
                  {faq.question}
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="help-section contact-section">
          <h2>Conheça a Desenvolvedora</h2>
          <p>Gostou do projeto? Conecte-se comigo nas redes profissionais!</p>
          
          <div className="contact-cards">
            
            <a href="https://github.com/Naita1" target="_blank" rel="noopener noreferrer" className="contact-card link-card">
              <svg className="contact-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <h3>GitHub</h3>
              <p>Veja meus códigos</p>
            </a>

            <a href="https://www.linkedin.com/in/taina-cl-ribeiro/" target="_blank" rel="noopener noreferrer" className="contact-card link-card">
              <svg className="contact-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <h3>LinkedIn</h3>
              <p>Vamos nos conectar</p>
            </a>

            <div className="contact-card chat-mock-card">
              <span className="contact-icon">💬</span>
              <h3>Chat Online</h3>
              <p>Clique no ícone flutuante da tela para testar</p>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}