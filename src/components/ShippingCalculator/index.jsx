import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

import { Loading } from '../Loading';
import './ShippingCalculator.css';

const REGIONAL_SHIPPING_RULES = {
  SP: { basePreco: 12.0, basePrazo: 2 },
  SUDESTE: { ufs: ['RJ', 'MG', 'ES'], basePreco: 18.5, basePrazo: 4 },
  SUL: { ufs: ['PR', 'SC', 'RS'], basePreco: 22.0, basePrazo: 5 },
  CENTRO_OESTE: { ufs: ['MS', 'MT', 'GO', 'DF'], basePreco: 28.0, basePrazo: 6 },
  NORDESTE: {
    ufs: ['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'],
    basePreco: 38.0,
    basePrazo: 9,
  },
  NORTE: { ufs: ['TO', 'PA', 'AP', 'RR', 'AM', 'AC', 'RO'], basePreco: 45.0, basePrazo: 12 },
};

export function ShippingCalculator({ cartItems = [], onShippingSelected, selectedShipping }) {

  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [opcoes, setOpcoes] = useState([]);
  const [cidade, setCidade] = useState('');
  const [selecionadoId, setSelecionadoId] = useState(null);

  useEffect(() => {
    setSelecionadoId(selectedShipping?.id || null);

    if (selectedShipping?.cep && !cep) {
      setCep(selectedShipping.cep);
      if (selectedShipping.cidade) setCidade(selectedShipping.cidade);
    }
  }, [selectedShipping]);

  useEffect(() => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8 && opcoes.length > 0 && cartItems.length > 0) {
      calcular(false);
    }
  }, [cartItems]);

  const handleCepChange = (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 5) v = v.replace(/^(\d{5})(\d)/, '$1-$2');
    setCep(v);
  };

  const gerarFreteDinamico = useCallback((uf, cepNumerico, items) => {
    let regra = REGIONAL_SHIPPING_RULES.SP;

    if (uf !== 'SP') {
      for (const regiao in REGIONAL_SHIPPING_RULES) {
        if (REGIONAL_SHIPPING_RULES[regiao].ufs?.includes(uf)) {
          regra = REGIONAL_SHIPPING_RULES[regiao];
          break;
        }
      }
    }

    let pesoTotalKg = 0;
    let volumeTotalCm3 = 0;

    const listaProdutos =
      items.length > 0
        ? items
        : [{ quantity: 1, weight: 0.2, length: 25, width: 20, height: 2 }];

    listaProdutos.forEach((item) => {
      const qtd = item.quantity || 1;
      pesoTotalKg += (item.weight || 0.2) * qtd;
      const l = item.length || 25;
      const w = item.width || 20;
      const h = item.height || 2;
      volumeTotalCm3 += l * w * h * qtd;
    });

    const taxaCep = parseInt(cepNumerico.slice(-3)) / 100;
    const adicionalPeso = pesoTotalKg * 2.5;
    const adicionalVolume = (volumeTotalCm3 / 5000) * 1.5;

    const precoBaseCalculado =
      regra.basePreco + taxaCep + adicionalPeso + adicionalVolume;

    return [
      {
        id: 'pac',
        nome: 'PAC',
        preco: precoBaseCalculado,
        prazo: regra.basePrazo + 4,
      },
      {
        id: 'sedex',
        nome: 'SEDEX',
        preco: precoBaseCalculado * 1.5 + 10,
        prazo: regra.basePrazo,
      },
    ];
  }, []);

  const calcular = async (exibirErro = true, idForcado = null) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      if (exibirErro) toast.error('CEP inválido');
      return;
    }

    if (exibirErro) setLoading(true);

    try {
      const res = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      const data = await res.json();

      if (data.erro) {
        if (exibirErro) toast.error('CEP não encontrado');
        setLoading(false);
        return;
      }

      const cidadeFormatada = `${data.localidade} - ${data.uf}`;
      setCidade(cidadeFormatada);

      const opcoesCalculadas = gerarFreteDinamico(
        data.uf,
        cepLimpo,
        cartItems
      );
      setOpcoes(opcoesCalculadas);

      const idAlvo = idForcado || selecionadoId || selectedShipping?.id;
      if (idAlvo && onShippingSelected) {
        const opcaoCorrespondente = opcoesCalculadas.find(
          (opt) => opt.id === idAlvo
        );
        if (opcaoCorrespondente) {
          onShippingSelected({
            id: opcaoCorrespondente.id,
            tipo: opcaoCorrespondente.nome,
            valor: opcaoCorrespondente.preco,
            prazo: opcaoCorrespondente.prazo,
            cep,
            cidade: cidadeFormatada,
          });
        }
      }
    } catch {
      if (exibirErro) toast.error('Erro ao buscar CEP');
    } finally {
      setLoading(false);
    }
  };

  const selecionarOpcao = (opt) => {
    setSelecionadoId(opt.id);
    calcular(false, opt.id);
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
          onKeyDown={(e) => e.key === 'Enter' && calcular(true)}
        />
        <button onClick={() => calcular(true)} disabled={loading}>
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
            {opcoes.map((opt) => (
              <div
                key={opt.id}
                className={`shipping-method ${
                  selecionadoId === opt.id ? 'active' : ''
                }`}
                onClick={() => selecionarOpcao(opt)}
              >
                <div className="method-info">
                  <span className="method-name">{opt.nome}</span>
                  <span className="method-deadline">
                    {' '}- Até {opt.prazo} dias úteis
                  </span>
                </div>
                <strong className="method-price">
                  {opt.preco.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}