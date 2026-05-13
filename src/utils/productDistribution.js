
export const distribuirProdutos = (todos) => {
  if (!todos || todos.length === 0) {
    return {
      ofertas: [],
      lancamentos: [],
      maisDesejados: [],
      outras: [],
      jaMostrados: new Set()
    };
  }

  const ofertas = todos.filter(p => p.hasDiscount);
  
  const jaMostrados = new Set([
    ...ofertas.map(p => p.id)
  ]);

  const semaDesconto = todos.filter(p => !p.hasDiscount);
  const lancamentos = semaDesconto.slice(0, 8);
  lancamentos.forEach(p => jaMostrados.add(p.id));

  const maisDesejados = semaDesconto
    .slice(8, 16)
    .reverse();
  maisDesejados.forEach(p => jaMostrados.add(p.id));

  const outras = todos.filter(p => !jaMostrados.has(p.id));

  return {
    ofertas,
    lancamentos,
    maisDesejados,
    outras,
    jaMostrados
  };
};

export const filtrarPorPaisETime = (produtos, pais, time = null) => {
  if (pais === 'Todos') return produtos;
  
  let filtrados = produtos.filter(p => p.category === pais);
  
  if (time) {
    filtrados = filtrados.filter(p => p.team === time);
  }
  
  return filtrados;
};

export const extrairMenuFiltros = (produtos) => {
  const menu = {};
  
  produtos.forEach(p => {
    if (p.category) {
      if (!menu[p.category]) menu[p.category] = [];
      if (p.team && !menu[p.category].includes(p.team)) {
        menu[p.category].push(p.team);
      }
    }
  });
  
  return menu;
};

export const formatarBRL = (valor) => {
  return valor.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });
};

export const temProdutosNaCategoria = (produtos, categoria) => {
  return produtos && produtos.length > 0;
};
