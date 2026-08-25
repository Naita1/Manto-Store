import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, collection, query, limit, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { Loading } from '../../components/Loading';
import { applyPriceLogic } from '../../utils/offerRules';
import { ShippingCalculator } from '../../components/ShippingCalculator';
import { Button } from '../../components/Button'

const FALLBACK_IMAGE = 'https://placehold.co/600x600/1E1E1E/FFFFFF?text=Sem+Imagem';

const ACCORDIONS_DATA = [
  { id: 1, title: "DESCRIÇÃO DETALHADA", contentKey: "description", fallback: "Nenhuma descrição informada para este produto." },
  { id: 2, title: "TABELA DE MEDIDAS", content: "P: 50x70cm | M: 52x72cm | G: 54x74cm | GG: 56x76cm" },
  { id: 3, title: "AVALIAÇÕES DE CLIENTES", content: "Nenhuma avaliação no momento." },
  { id: 4, title: "DÚVIDAS SOBRE O PRODUTO", content: "Para personalizar, clique no botão 'PERSONALIZE DE GRAÇA'." }
];

const formatCurrency = (value) => value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00';
const handleImageError = (e) => { e.target.src = FALLBACK_IMAGE; };

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [produto, setProduto] = useState(null);
  const [produtosRecomendados, setProdutosRecomendados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagemPrincipal, setImagemPrincipal] = useState('');
  const [imgChanging, setImgChanging] = useState(false);
  
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('');
  const [querPersonalizar, setQuerPersonalizar] = useState(false);
  const [nomePersonalizado, setNomePersonalizado] = useState('');
  const [numeroPersonalizado, setNumeroPersonalizado] = useState('');
  
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [accordionsAbertos, setAccordionsAbertos] = useState([]);
  
  const carouselRef = useRef(null);
  const zoomImgRef = useRef(null);

  const listaImagens = produto?.image?.length > 0 ? produto.image : [FALLBACK_IMAGE];
  const tamanhosDisponiveis = produto?.sizes || [];
  
  const veioDeFiltro = location.state?.veioDeFiltro;
  const filtroTimeAtivo = location.state?.filtroTimeAtivo; 
  const categoriaInfo = produto?.category || produto?.categoria;
  const timeInfo = produto?.team || produto?.time;

  const handleSelectImage = useCallback((img) => {
    if (img === imagemPrincipal) return;
    setImgChanging(true);
    setTimeout(() => {
      setImagemPrincipal(img);
      setImgChanging(false);
    }, 150);
  }, [imagemPrincipal]);

  const handleAddToCart = useCallback(async (redirect = false) => {
    if (!user) {
      toast.error("Você precisa estar logado para adicionar itens ao carrinho!");
      return navigate('/login');
    }

    if (tamanhosDisponiveis.length > 0 && !tamanhoSelecionado) {
      return toast.error("Por favor, selecione um tamanho antes de continuar.");
    }

    if (querPersonalizar && (!nomePersonalizado || !numeroPersonalizado)) {
      return toast.error("Você escolheu personalizar! Por favor, preencha o Nome e o Número.");
    }

    try {
      const cartRef = doc(db, 'carrinhos', user.uid);
      const cartSnap = await getDoc(cartRef);

      const novoItem = {
        productId: id,
        title: produto.title,
        price: produto.price,
        image: imagemPrincipal,
        size: tamanhoSelecionado,
        quantity: 1,
        personalizacao: querPersonalizar ? { nome: nomePersonalizado, numero: numeroPersonalizado } : null,
        addedAt: new Date()
      };

      const formatarPers = (p) => p ? `${p.nome}-${p.numero}` : 'nenhuma';

      if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        const items = [...(cartData.items || [])];

        const itemIndex = items.findIndex(item => 
          item.productId === novoItem.productId && 
          item.size === novoItem.size && 
          formatarPers(item.personalizacao) === formatarPers(novoItem.personalizacao)
        );

        if (itemIndex > -1) {
          items[itemIndex].quantity += 1;
        } else {
          items.push(novoItem);
        }

        await updateDoc(cartRef, { items });
      } else {
        await setDoc(cartRef, { 
          items: [novoItem],
          shipping: null 
        });
      }

      if (redirect) {
        navigate('/cart');
      } else {
        toast.success("Produto adicionado ao manto-carrinho!");
      }
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      toast.error("Erro ao salvar no banco de dados.");
    }
  }, [user, tamanhosDisponiveis, tamanhoSelecionado, querPersonalizar, nomePersonalizado, numeroPersonalizado, produto, imagemPrincipal, id, navigate]);
   
  const scrollCarousel = useCallback((offset) => {
    carouselRef.current?.scrollBy({ left: offset, behavior: 'smooth' });
  }, []);

  const toggleAccordion = useCallback((index) => {
    setAccordionsAbertos(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  }, []);

  const openLightbox = () => {
    setIsLightboxOpen(true);
    requestAnimationFrame(() => setLightboxVisible(true));
  };
  
  const closeLightbox = () => {
    setLightboxVisible(false);
    setTimeout(() => setIsLightboxOpen(false), 200);
  };

  const handleZoomMove = useCallback((e) => {
    if (window.innerWidth <= 768 || !zoomImgRef.current) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const { offsetWidth, offsetHeight } = e.currentTarget;
    const x = (offsetX / offsetWidth) * 100;
    const y = (offsetY / offsetHeight) * 100;
    zoomImgRef.current.style.transformOrigin = `${x}% ${y}%`;
  }, []);

  const handleZoomLeave = useCallback(() => {
    if (zoomImgRef.current) {
      zoomImgRef.current.style.transformOrigin = 'center center';
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setProduto(null);
    setTamanhoSelecionado('');
    setQuerPersonalizar(false);
    setNomePersonalizado('');
    setNumeroPersonalizado('');

    const buscarProduto = async () => {
      try {
        const docRef = doc(db, 'produtos', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dadosComDesconto = applyPriceLogic({ id: docSnap.id, ...docSnap.data() });
          setProduto(dadosComDesconto);
          setImagemPrincipal(dadosComDesconto.image?.[0] || FALLBACK_IMAGE);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
      }
      setLoading(false);
    };

    const buscarProdutosRelacionados = async () => {
      try {
        const q = query(collection(db, 'produtos'), limit(20));
        const querySnapshot = await getDocs(q);
        const produtos = [];

        querySnapshot.forEach(doc => {
          if (doc.id !== id) {
            produtos.push(applyPriceLogic({ id: doc.id, ...doc.data() }));
          }
        });

        const embaralhados = produtos.sort(() => 0.5 - Math.random()).slice(0, 10);
        setProdutosRecomendados(embaralhados);
      } catch (error) {
        console.error("Erro ao buscar produtos recomendados:", error);
      }
    };

    if (id) {
      buscarProduto();
      buscarProdutosRelacionados();
    }
  }, [id]);

  if (loading) {
    return <Loading message="Preparando detalhes do manto..." />;
  }

  if (!produto) {
    return (
      <div className="min-h-screen w-full bg-[#0B0B0D] text-[#ECECEE] font-sans flex items-center justify-center p-4">
        <div className="text-center p-12 bg-[#131316] border border-white/8 rounded-2xl max-w-md w-full">
          <p className="text-lg text-neutral-300 font-medium">Produto não encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0B0B0D] text-[#ECECEE] selection:bg-[#9C2A32] selection:text-white font-sans antialiased pb-20 transform-gpu">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        <nav className="text-[11px] font-medium tracking-wider text-neutral-400 uppercase flex flex-wrap gap-2 items-center mb-6 sm:mb-8">
          <span 
            onClick={() => navigate('/')} 
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            PÁGINA INICIAL
          </span>

          {veioDeFiltro && categoriaInfo && (
            <>
              <span className="text-neutral-600">/</span>
              <span 
                onClick={() => navigate('/', { state: { filtroPais: categoriaInfo, filtroTime: null } })} 
                className="hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {categoriaInfo.toUpperCase()}
              </span>
            </>
          )}

          {veioDeFiltro && filtroTimeAtivo && timeInfo && (
            <>
              <span className="text-neutral-600">/</span>
              <span 
                onClick={() => navigate('/', { state: { filtroPais: categoriaInfo, filtroTime: timeInfo } })} 
                className="hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {timeInfo.toUpperCase()}
              </span>
            </>
          )}

          <span className="text-neutral-600">/</span> 
          <span className="text-neutral-200 font-semibold truncate max-w-50 sm:max-w-xs">{produto.title}</span>
        </nav>
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14 items-start">
          <div className="lg:col-span-6 w-full flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-3 w-full sm:w-20 overflow-x-auto sm:overflow-visible py-1 sm:py-0 shrink-0 justify-start scrollbar-none">
              {listaImagens.map((img, index) => (
               <Button
                key={index}
                type="button"
                onClick={() => handleSelectImage(img)}
                className={`p-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border bg-neutral-900 transition-all duration-200 active:scale-95 ${
                  imagemPrincipal === img 
                    ? 'border-[#9C2A32] ring-2 ring-[#9C2A32]/40 scale-[1.03]' 
                    : 'border-white/8 opacity-60 hover:opacity-100 hover:border-white/20 hover:scale-[1.02]'
                }`}
              >
                <img
                  src={img}
                  alt={`${produto.title} - Miniatura ${index + 1}`}
                  className="w-full h-full object-cover pointer-events-none transition-opacity duration-200"
                  onError={handleImageError}
                />
              </Button>
              ))}
            </div>
            <div
              className="relative flex-1 bg-[#131316] border border-white/8 rounded-2xl overflow-hidden flex items-center justify-center aspect-square sm:aspect-4/5 w-full cursor-zoom-in group shadow-2xl transform-gpu"
              onClick={openLightbox}
              onMouseMove={handleZoomMove}
              onMouseLeave={handleZoomLeave}
            >
              <img 
                ref={zoomImgRef}
                src={imagemPrincipal} 
                alt={produto.title || "Produto"} 
                onError={handleImageError}
                className={`w-full h-full object-cover object-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform transform-gpu lg:group-hover:scale-[1.75] pointer-events-none ${
                  imgChanging ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`} 
              />
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md p-2.5 rounded-xl text-neutral-300 opacity-0 group-hover:opacity-100 transition-all duration-300 transform-gpu translate-y-2 group-hover:translate-y-0 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 w-full flex flex-col space-y-4">
           <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                <span>★★★★</span><span className="text-neutral-600">★</span>
                <span className="text-xs text-neutral-400 ml-1.5 font-medium">(4.8 / 5.0) • 128 avaliações</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-white leading-tight">
                {produto.title}
              </h1>
            </div>
            <div className="p-4 rounded-2xl bg-[#131316] border border-white/8 space-y-1 transition-all duration-300 hover:border-white/12">
              {produto.hasDiscount && (
                <p className="line-through text-neutral-400 text-xs sm:text-sm">{formatCurrency(produto.originalPrice)}</p>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {formatCurrency(produto.price)}
                </span>
                {produto.hasDiscount && (
                  <span className="bg-[#9C2A32]/20 text-[#9C2A32] border border-[#9C2A32]/30 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider animate-pulse">
                    -{produto.discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-400 font-mono tracking-wide pt-1">
                EM ATÉ 12X DE <span className="text-neutral-200 font-semibold">{formatCurrency(produto.price / 12)}</span> SEM JUROS
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold tracking-wider text-neutral-300 uppercase">SELECIONE O TAMANHO</span>
                {tamanhoSelecionado && (
                  <span className="text-neutral-400 transition-opacity duration-200">
                    Selecionado: <strong className="text-white">{tamanhoSelecionado}</strong>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {tamanhosDisponiveis.length > 0 ? (
                  tamanhosDisponiveis.map(size => (
                  <Button
                    key={size}
                    type="button"
                    onClick={() => setTamanhoSelecionado(size)}
                    className={`w-auto py-2 px-3.5 min-w-13 rounded-xl font-bold text-xs border transition-transform duration-150 active:scale-95 transform-gpu ${
                      tamanhoSelecionado === size 
                        ? 'bg-[#9C2A32] text-white border-[#9C2A32] scale-105' 
                        : 'bg-[#131316] text-neutral-300 border-white/8 hover:bg-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {size}
                  </Button>
                  ))
                ) : (
                  <p className="text-xs text-neutral-400 py-1">Tamanho único ou indisponível</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
             <Button 
                type="button"
                onClick={() => setQuerPersonalizar(!querPersonalizar)}
                className={`py-2.5 px-4 rounded-xl border transition-all duration-200 ease-out transform-gpu ${
                  querPersonalizar 
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/70 hover:text-rose-300' 
                    : 'bg-[#131316] text-neutral-200 border-white/12 hover:bg-white/5 hover:border-white/20'
                }`}
              >
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${querPersonalizar ? 'rotate-12 scale-110' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                PERSONALIZE DE GRAÇA
              </Button>

              <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
                querPersonalizar ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
              }`}>
                <div className="overflow-hidden">
                  <div className="p-3.5 rounded-xl bg-[#131316] border border-white/8 space-y-2.5">
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="text"
                        placeholder="NOME (Ex: RONALDO)"
                        value={nomePersonalizado}
                        onChange={(e) => setNomePersonalizado(e.target.value.toUpperCase())}
                        maxLength="15"
                        className="flex-2 py-2 px-3 rounded-lg border border-white/10 bg-[#0B0B0D] text-white text-xs outline-none uppercase placeholder:text-neutral-500 focus:border-[#9C2A32] transition-colors duration-200"
                      />
                      <input
                        type="text"
                        placeholder="Nº"
                        value={numeroPersonalizado}
                        onChange={(e) => setNumeroPersonalizado(e.target.value.replace(/\D/g, ''))}
                        maxLength="2"
                        className="flex-1 py-2 px-3 rounded-lg border border-white/10 bg-[#0B0B0D] text-white text-xs outline-none text-center placeholder:text-neutral-500 focus:border-[#9C2A32] transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
           <div className="pt-1">
              <div className="flex items-center w-full rounded-xl overflow-hidden border border-[#9C2A32] bg-[#9C2A32] transform-gpu transition-transform duration-200 active:scale-[0.98]">
                  <Button
                    type="button"
                    onClick={() => handleAddToCart(false)}
                    title="Adicionar ao Carrinho"
                    aria-label="Adicionar ao carrinho"
                    className="w-auto p-3.5 sm:p-4 rounded-none bg-black/20 hover:bg-black/35 active:bg-black/45 border-r border-white/10 active:scale-100"
                  >
                    <svg 
                      className="w-5 h-5 text-white" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => handleAddToCart(true)}
                    className="flex-1 py-3.5 sm:py-4 px-4 text-xs sm:text-sm font-bold bg-transparent hover:bg-black/20 active:bg-black/30 rounded-none active:scale-100" 
                  >
                    COMPRAR AGORA
                  </Button>
                </div>
              </div>
            <div className="pt-1">
              <ShippingCalculator />
            </div>
          </div>
        </section>
        <section className="w-full space-y-6 mb-16 border-t border-white/6 pt-10">          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#131316] border border-white/8 rounded-2xl">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B0B0D]/60 border border-white/4">
              <div className="p-2 rounded-lg bg-[#9C2A32]/10 text-[#9C2A32] shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10M7 12h10M7 17h10" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-medium">Tecido Premium</p>
                <p className="text-xs text-neutral-200 font-semibold">Respirável / Dry-Fit</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B0B0D]/60 border border-white/4">
              <div className="p-2 rounded-lg bg-[#9C2A32]/10 text-[#9C2A32] shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-medium">Acabamento</p>
                <p className="text-xs text-neutral-200 font-semibold">Escudo Bordado</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B0B0D]/60 border border-white/4">
              <div className="p-2 rounded-lg bg-[#9C2A32]/10 text-[#9C2A32] shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-medium">Modelagem</p>
                <p className="text-xs text-neutral-200 font-semibold">Caimento Padrão</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B0B0D]/60 border border-white/4">
              <div className="p-2 rounded-lg bg-[#9C2A32]/10 text-[#9C2A32] shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-medium">Garantia</p>
                <p className="text-xs text-neutral-200 font-semibold">7 Dias Contra Defeitos</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {ACCORDIONS_DATA.map((item, index) => {
              const isOpen = accordionsAbertos.includes(index);
              const content = item.contentKey === "description" ? (produto.description || item.fallback) : item.content;

              return (
                <div key={item.id} className="bg-[#131316] border border-white/8 rounded-2xl overflow-hidden transform-gpu transition-colors duration-200 hover:border-white/15">
                  <Button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={isOpen}
                    className={`justify-between px-5 py-4 bg-transparent hover:bg-white/2 text-neutral-200 text-left rounded-none active:scale-100 ${
                      isOpen ? 'border-b border-white/6' : ''
                    }`}
                  >
                    <span>{item.title}</span>
                    <span 
                      className={`p-1 rounded-md text-[#9C2A32] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                  </Button>
                  <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}>
                    <div className="overflow-hidden">
                      <p className="p-5 text-neutral-400 text-xs sm:text-sm leading-relaxed whitespace-pre-line m-0">
                        {content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <section className="space-y-5">
          <h3 className="text-white text-base sm:text-lg tracking-wider uppercase font-bold">
            VOCÊ TAMBÉM PODE GOSTAR
          </h3>
          <div className="relative flex items-center gap-3 w-full">
            
            {produtosRecomendados.length > 0 && (
              <Button 
                type="button"
                onClick={() => scrollCarousel(-300)} 
                aria-label="Produtos anteriores"
                className="hidden sm:flex p-0 w-10 h-10 rounded-full bg-[#131316] text-neutral-300 border border-white/10 text-sm shrink-0 hover:bg-[#9C2A32] hover:text-white hover:border-[#9C2A32] active:scale-95 transition-colors duration-200 transform-gpu" 
              >
                ‹
              </Button>
            )}

            <div 
              className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth py-2 flex-1 scrollbar-none snap-x snap-mandatory transform-gpu" 
              ref={carouselRef}
            >
              {produtosRecomendados.length > 0 ? (
                produtosRecomendados.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-[#131316] border border-white/8 rounded-2xl w-47.5 sm:w-55 shrink-0 flex flex-col cursor-pointer overflow-hidden transition-all duration-300 ease-out hover:border-white/25 hover:-translate-y-1 hover:shadow-xl snap-start group transform-gpu" 
                    onClick={() => navigate(`/produto/${item.id}`)}
                  >
                    <div className="bg-neutral-900 h-47.5 sm:h-55 w-full flex justify-center items-center overflow-hidden relative">
                      <img
                        src={item.image?.[0] || FALLBACK_IMAGE}
                        alt={item.title || "Produto Recomendado"}
                        onError={handleImageError}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108 pointer-events-none transform-gpu"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 p-4">
                      <p className="text-xs text-neutral-300 uppercase font-medium leading-snug line-clamp-2 truncate group-hover:text-white transition-colors duration-200">
                        {item.title}
                      </p>
                      <p className="text-sm sm:text-base text-white font-mono font-bold">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-neutral-500 text-xs p-4">Buscando produtos...</p>
              )}
            </div>

            {produtosRecomendados.length > 0 && (
             <Button 
                type="button"
                onClick={() => scrollCarousel(300)} 
                aria-label="Próximos produtos"
                className="hidden sm:flex p-0 w-10 h-10 rounded-full bg-[#131316] text-neutral-300 border border-white/10 text-sm shrink-0 hover:bg-[#9C2A32] hover:text-white hover:border-[#9C2A32] active:scale-95 transition-colors duration-200 transform-gpu" 
              >
                ›
              </Button>
            )}

          </div>
        </section>
        {isLightboxOpen && (
          <div 
            className={`fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-1000 cursor-pointer p-4 transform-gpu transition-opacity duration-200 ${
              lightboxVisible ? 'opacity-100' : 'opacity-0'
            }`} z-1000
            onClick={closeLightbox}
          >
            <Button 
              type="button"
              onClick={closeLightbox}
              aria-label="Fechar"
              className="absolute top-4 right-6 p-0 w-auto h-auto bg-transparent hover:bg-transparent text-3xl text-neutral-400 hover:text-white font-light transition-colors duration-200 z-[1001] active:scale-90 transform-gpu"
            >
              &times;
            </Button>
            <img 
              src={imagemPrincipal} 
              alt={produto.title} 
              className={`max-w-[90vw] max-h-[90vh] object-contain cursor-zoom-in rounded-lg shadow-2xl transform-gpu transition-transform duration-300 ease-out ${
                lightboxVisible ? 'scale-100' : 'scale-95'
              }`} 
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        )}
      </div>
    </div>
  );
}