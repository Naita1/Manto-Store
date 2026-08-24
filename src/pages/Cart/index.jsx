import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase'; 
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext'; 
import { Loading } from '../../components/Loading';
import { ShippingCalculator } from '../../components/ShippingCalculator'; 

export function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [shipping, setShipping] = useState(null); 
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const pendingTimeoutRef = useRef(null);
  const isPendingSyncRef = useRef(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const cartRef = doc(db, "carrinhos", user.uid);

    const unsubscribe = onSnapshot(cartRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!isPendingSyncRef.current) {
          setCartItems(data.items || []);
        }
        setShipping(data.shipping || null);
      } else {
        if (!isPendingSyncRef.current) {
          setCartItems([]);
        }
        setShipping(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
      }
    };
  }, [user]);

  const handleShippingSelected = useCallback(async (shippingData) => {
    if (!user) return;
    const cartRef = doc(db, "carrinhos", user.uid);
    try {
      await updateDoc(cartRef, { shipping: shippingData });
    } catch (error) {
      console.error("Erro ao atualizar o frete:", error);
    }
  }, [user]);

  const debouncedSyncCart = useCallback((updatedItems) => {
    isPendingSyncRef.current = true;

    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
    }

    pendingTimeoutRef.current = setTimeout(async () => {
      if (!user) {
        isPendingSyncRef.current = false;
        return;
      }
      const cartRef = doc(db, "carrinhos", user.uid);
      try {
        await updateDoc(cartRef, { items: updatedItems });
      } catch (error) {
        console.error("Erro ao atualizar a quantidade:", error);
      } finally {
        isPendingSyncRef.current = false;
      }
    }, 300);
  }, [user]);

  const updateQuantity = (productId, size, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        (item.productId === productId && item.size === size)
          ? { ...item, quantity: newQuantity }
          : item
      );
      debouncedSyncCart(updatedItems);
      return updatedItems;
    });
  };

  const removeItem = async (productId, size) => {
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
    }

    let updatedItems = [];
    setCartItems((prevItems) => {
      updatedItems = prevItems.filter((item) => 
        !(item.productId === productId && item.size === size)
      );
      return updatedItems;
    });

    if (!user) return;

    const cartRef = doc(db, "carrinhos", user.uid);
    try {
      isPendingSyncRef.current = true;
      const novoFrete = updatedItems.length === 0 ? null : shipping;
      await updateDoc(cartRef, { 
        items: updatedItems,
        shipping: novoFrete 
      });
    } catch (error) {
      console.error("Erro ao remover item:", error);
    } finally {
      isPendingSyncRef.current = false;
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalFrete = shipping ? (shipping.valor || 0) : 0;
  const totalPedido = subtotal + totalFrete;

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const dadosEntrega = shipping && shipping.cep
    ? `${shipping.cidade} - CEP: ${shipping.cep}`
    : 'Nenhum CEP calculado';

  if (!user && !loading) {
    return (
      <div className="min-h-screen w-full bg-[#0B0B0D] text-[#ECECEE] selection:bg-[#9C2A32] selection:text-white flex items-center justify-center px-4 py-12 font-sans antialiased">
        <div className="w-full max-w-md bg-[#131316] border border-white/8 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#9C2A32]/10 text-[#9C2A32] border border-[#9C2A32]/20 flex items-center justify-center mx-auto mb-5">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" /></svg>
          </div>
          <h2 className="text-lg font-semibold text-white tracking-tight mb-2">Acesso Necessário</h2>
          <p className="text-xs text-neutral-400 font-normal leading-relaxed mb-6">
            Você precisa estar conectado em uma conta para visualizar seu carrinho.
          </p>
          <button 
            className="w-full py-3 px-4 bg-[#9C2A32] hover:bg-[#88242B] text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-[background-color,transform] duration-200 ease-out cursor-pointer active:scale-[0.985]"
            onClick={() => navigate('/login')}
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading message="Buscando seu carrinho..." />;
  }

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 animate-reveal stagger-1">
          <div className="text-[11px] font-medium tracking-wider mb-3 text-neutral-400 uppercase flex items-center gap-2">
            <Link to="/" className="hover:text-white transition-colors duration-200">← Página inicial</Link>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-300">Carrinho</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                Carrinho de Compras
              </h1>
            </div>
            {cartItems.length > 0 && (
              <span className="text-[11px] font-mono text-neutral-400 bg-white/4 px-2.5 py-1 rounded-md border border-white/8">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}
              </span>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 animate-reveal stagger-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <section className="lg:col-span-7 bg-[#131316] border border-white/8 rounded-2xl p-6 sm:p-7">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/6">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#9C2A32]/10 text-[#9C2A32]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" /></svg>
                </div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Produtos Selecionados
                </h2>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="py-12 text-center rounded-xl border border-dashed border-white/8 bg-[#0B0B0D]/40 flex flex-col items-center justify-center gap-3 min-h-50">
                <p className="text-xs text-neutral-400">Seu carrinho está atualmente vazio.</p>
                <Link 
                  to="/" 
                  className="text-xs font-medium uppercase tracking-wider text-[#9C2A32] hover:text-[#88242B] transition-colors duration-200"
                >
                  Explorar Produtos →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item, index) => (
                  <div 
                    key={`${item.productId}-${item.size}-${index}`}
                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl bg-[#0B0B0D] border border-white/6 hover:border-white/12 hover:bg-white/2 transition-[border-color,background-color] duration-200 ease-out gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-neutral-900 overflow-hidden shrink-0 border border-white/8">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <Link to={`/produto/${item.productId}`} className="no-underline">
                          <h3 className="text-xs sm:text-sm font-medium text-neutral-200 group-hover:text-white transition-colors duration-200 truncate">
                            {item.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                          <span>Tamanho: <strong className="text-white font-medium">{item.size}</strong></span>
                        </div>
                        <span className="font-mono text-xs sm:text-sm font-semibold text-white tabular-nums mt-0.5">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/4">
                      <div className="flex items-center gap-2 bg-white/3 border border-white/8 p-1 rounded-xl">
                        <button 
                          aria-label="Diminuir quantidade"
                          className="w-7 h-7 rounded-lg bg-white/4 hover:bg-white/10 active:scale-95 text-white flex items-center justify-center text-xs font-bold transition-[background-color,transform] duration-150 cursor-pointer"
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="font-mono text-xs font-medium min-w-6 text-center text-white tabular-nums">
                          {item.quantity}
                        </span>
                        <button 
                          aria-label="Aumentar quantidade"
                          className="w-7 h-7 rounded-lg bg-white/4 hover:bg-white/10 active:scale-95 text-white flex items-center justify-center text-xs font-bold transition-[background-color,transform] duration-150 cursor-pointer"
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button 
                        className="p-2 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors duration-200 cursor-pointer"
                        title="Remover item"
                        onClick={() => removeItem(item.productId, item.size)}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="lg:col-span-5 bg-[#131316] border border-white/8 rounded-2xl p-6 sm:p-7 lg:sticky lg:top-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/6">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#9C2A32]/10 text-[#9C2A32]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Resumo do Pedido
                </h2>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between items-center text-xs text-neutral-400">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-neutral-200 tabular-nums">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-neutral-400">
                <span>Frete {shipping?.tipo && <span className="text-neutral-500">({shipping.tipo})</span>}</span>
                <span className={`font-mono text-xs ${totalFrete > 0 ? 'font-medium text-neutral-200' : 'text-neutral-500'}`}>
                  {totalFrete > 0 ? formatCurrency(totalFrete) : 'A calcular'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-dashed border-white/12">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Total</span>
                <span className="font-mono text-lg font-bold text-white tabular-nums">
                  {formatCurrency(totalPedido)}
                </span>
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="mb-5 pt-4 border-t border-white/6">
                <ShippingCalculator 
                  cartItems={cartItems}
                  selectedShipping={shipping}
                  onShippingSelected={handleShippingSelected}
                />
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-[#0B0B0D] border border-white/6 mb-6">
              <span className="block text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1">
                Endereço de Entrega
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {cartItems.length === 0 ? 'Endereço indisponível' : dadosEntrega}
              </p>
            </div>

            <button 
              className="w-full py-3 px-4 bg-[#9C2A32] hover:bg-[#88242B] disabled:bg-white/4 disabled:text-neutral-600 disabled:border disabled:border-white/4 disabled:cursor-not-allowed text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-[background-color,border-color,color,transform] duration-200 ease-out cursor-pointer active:scale-[0.985]"
              disabled={cartItems.length === 0}
            >
              Finalizar Compra
            </button>
          </section>

        </div>
      </main>
    </div>
  );
}