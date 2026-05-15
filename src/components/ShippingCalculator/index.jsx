import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loading } from '../Loading';
import './ShippingCalculator.css';

export function ShippingCalculator({ onShippingSelected }) {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [opcoes, setOpcoes] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [cidade, setCidade] = useState('');

  const handleCepChange = (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 5) v = v.replace(/^(\d{5})(\d)/, '$1-$2');
    setCep(v);
  };

  const gerarFreteDinamico = (uf, cepNumerico) => {
    const regrasRegiao = {
      SP: { basePreco: 12.0, basePrazo: 2 },
      SUDESTE: { ufs: ['RJ', 'MG', 'ES'], basePreco: 18.5, basePrazo: 4 },
      SUL: { ufs: ['PR', 'SC', 'RS'], basePreco: 22.0, basePrazo: 5 },
      CENTRO_OESTE: { ufs: ['MS', 'MT', 'GO', 'DF'], basePreco: 28.0, basePrazo: 6 },
      NORDESTE: { ufs: ['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'], basePreco: 38.0, basePrazo: 9 },
      NORTE: { ufs: ['TO', 'PA', 'AP', 'RR', 'AM', 'AC', 'RO'], basePreco: 45.0, basePrazo: 12 },
    };

    let regra = regrasRegiao.SP;
    if (uf !== 'SP') {
      for (const regiao in regrasRegiao) {
        if (regrasRegiao[regiao].ufs?.includes(uf)) {
          regra = regrasRegiao[regiao];
          break;
        }
      }
    }

    const taxaCep = parseInt(cepNumerico.slice(-3)) / 100;
    const valorPac = regra.basePreco + taxaCep;
    const valorSedex = valorPac * 1.6 + 15;

    return [
      { 
        id: 'pac', 
        nome: 'PAC', 
        preco: valorPac, 
        prazo: regra.basePrazo + 4 
      },
      { 
        id: 'sedex', 
        nome: 'SEDEX', 
        preco: valorSedex, 
        prazo: regra.basePrazo 
      }
    ];
  };

const calcular = async () => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return toast.error("CEP inválido");

    setLoading(true);
    setOpcoes([]);
    setCidade('');
    setSelecionado(null);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      
      if (data.erro) {
        toast.error("CEP não encontrado");
        setLoading(false);
        return;
      }

      setCidade(`${data.localidade} - ${data.uf}`);
      const opcoesCalculadas = gerarFreteDinamico(data.uf, cepLimpo);
      setOpcoes(opcoesCalculadas);

    } catch {
      toast.error("Erro ao buscar CEP");
    } finally {
      setLoading(false);
    }
  };

  const selecionarOpcao = (opt) => {
    setSelecionado(opt.id);
    onShippingSelected({
      tipo: opt.nome,
      valor: opt.preco,
      prazo: opt.prazo,
      cep: cep,
      cidade: cidade
    });
  };

return (
    <div className="shipping-container">
      <p className="section-label">CALCULAR FRETE</p>
      <div className="shipping-input-group">
        <input 
          value={cep} 
          onChange={handleCepChange} 
          placeholder="00000-000" 
          maxLength="9"
          disabled={loading}
          onKeyDown={(e) => e.key === 'Enter' && calcular()}
        />
        <button onClick={calcular} disabled={loading}>
          OK
        </button>
      </div>

      <div className="shipping-feedback-area">
        {loading && (
          <div className="shipping-local-loading">
            <Loading message="Calculando..." />
          </div>
        )}

        {cidade && !loading && (
          <p className="shipping-city-display">
            Entregar em: <strong>{cidade}</strong>
          </p>
        )}

        {opcoes.length > 0 && !loading && (
          <div className="shipping-options">
            {opcoes.map(opt => (
              <div 
                key={opt.id} 
                className={`shipping-method ${selecionado === opt.id ? 'active' : ''}`}
                onClick={() => selecionarOpcao(opt)}
              >
                <div className="method-info">
                  <span className="method-name">{opt.nome}</span>
                  <span className="method-deadline"> - Até {opt.prazo} dias úteis</span>
                </div>
                <strong className="method-price">
                  {opt.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}