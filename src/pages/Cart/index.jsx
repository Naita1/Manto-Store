import { useState, useEffect, useCallback } from 'react';
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

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const cartRef = doc(db, "carrinhos", user.uid);

    const unsubscribe = onSnapshot(cartRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCartItems(data.items || []);
        setShipping(data.shipping || null);
      } else {
        setCartItems([]);
        setShipping(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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

  const updateQuantity = async (productId, size, newQuantity) => {
    if (newQuantity < 1) return;

    const cartRef = doc(db, "carrinhos", user.uid);
    const updatedItems = cartItems.map(item => 
      (item.productId === productId && item.size === size) 
        ? { ...item, quantity: newQuantity } 
        : item
    );

    try {
      await updateDoc(cartRef, { items: updatedItems });
    } catch (error) {
      console.error("Erro ao atualizar a quantidade:", error);
    }
  };

  const removeItem = async (productId, size) => {
    const cartRef = doc(db, "carrinhos", user.uid);
    const updatedItems = cartItems.filter(item => 
      !(item.productId === productId && item.size === size)
    );

    try {
      const novoFrete = updatedItems.length === 0 ? null : shipping;
      await updateDoc(cartRef, { 
        items: updatedItems,
        shipping: novoFrete 
      });
    } catch (error) {
      console.error("Erro ao remover item:", error);
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
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 text-white">
        <div className="relative flex flex-col items-center justify-center p-10 sm:p-16 text-center rounded-[28px] bg-gradient-to-b from-[#161616]/90 to-[#101010]/90 backdrop-blur-2xl border border-white/[0.06] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-[#B3282D]/10 blur-[100px]" />
          <div className="relative w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-6">
            <span className="text-3xl">🛒</span>
          </div>
          <p className="relative text-base sm:text-lg font-medium tracking-wide mb-8 text-neutral-300 max-w-sm">
            Precisas de fazer login para ver o teu carrinho.
          </p>
          <button 
            className="relative w-full max-w-xs py-4 px-6 bg-[#B3282D] hover:bg-[#932025] text-white text-sm font-bold tracking-[0.15em] uppercase rounded-full transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 cursor-pointer shadow-[0_10px_30px_-8px_rgba(179,40,45,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B3282D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]"
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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-white">
      <style>{`
        @keyframes cart-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cart-fade-up {
          animation: cart-fade-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .cart-fade-up { animation: none; }
        }
      `}</style>

      <div className="text-[11px] sm:text-xs tracking-[0.2em] mb-5 text-neutral-500 font-medium uppercase">
        <Link to="/" className="hover:text-neutral-200 transition-colors duration-200">← Página inicial</Link>
        <span className="mx-2 text-neutral-700">/</span>
        <span className="text-neutral-300">Carrinho de compras</span>
      </div>

      <div className="flex items-baseline justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-[0.08em] text-white">
          Carrinho
        </h1>
        {cartItems.length > 0 && (
          <span className="text-xs tracking-widest text-neutral-500 uppercase font-medium">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 p-5 sm:p-8 rounded-[28px] bg-gradient-to-b from-[#171717]/90 to-[#111111]/90 backdrop-blur-2xl border border-white/[0.06] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]">
        
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-4 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
            Produtos
          </h2>
          
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-14 text-center rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-neutral-500 gap-3">
              <span className="text-4xl opacity-30">🛒</span>
              <p className="text-sm tracking-wide">O teu carrinho está vazio.</p>
              <Link 
                to="/" 
                className="mt-2 text-xs font-semibold tracking-widest uppercase text-[#d3585d] hover:text-[#e37d81] transition-colors duration-200"
              >
                Continuar a comprar →
              </Link>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div 
                className="cart-fade-up group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pb-5 border-b border-white/[0.06] last:border-b-0 last:pb-0" 
                style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
                key={`${item.productId}-${item.size}-${index}`}
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-neutral-900 flex-shrink-0 border border-white/[0.06]">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />
                </div>
                
                <div className="flex-1 flex flex-col gap-1.5 w-full min-w-0">
                  <Link to={`/produto/${item.productId}`} className="no-underline w-fit">
                    <h3 className="text-sm sm:text-base font-semibold text-neutral-200 hover:text-white transition-colors duration-200 line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-[11px] text-neutral-500 uppercase tracking-widest">
                    Tamanho <span className="text-neutral-300 font-medium">{item.size}</span>
                  </p>
                  <strong className="text-base sm:text-lg font-bold text-white mt-1 tabular-nums">
                    {formatCurrency(item.price)}
                  </strong>
                  <button 
                    className="text-[11px] text-neutral-500 hover:text-[#d3585d] uppercase tracking-widest mt-1.5 cursor-pointer transition-colors duration-200 w-fit inline-flex items-center gap-1"
                    onClick={() => removeItem(item.productId, item.size)}
                  >
                    Remover
                  </button>
                </div>
                
                <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] p-1.5 rounded-full self-start sm:self-center shrink-0">
                  <button 
                    aria-label="Diminuir quantidade"
                    className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-[#B3282D] active:scale-90 text-white flex items-center justify-center text-base font-bold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B3282D]"
                    onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                  >
                    <span>−</span>
                  </button>
                  <span className="text-xs font-semibold tracking-wider min-w-[32px] text-center text-white tabular-nums">
                    {item.quantity}
                  </span>
                  <button 
                    aria-label="Aumentar quantidade"
                    className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-[#B3282D] active:scale-90 text-white flex items-center justify-center text-base font-bold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B3282D]"
                    onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                  >
                    <span>+</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-5 xl:col-span-4 flex flex-col lg:sticky lg:top-8 h-fit lg:border-l lg:border-white/[0.06] lg:pl-8">
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-neutral-500 uppercase mb-5">
            Resumo do Pedido
          </h2>
          
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex justify-between items-center text-sm text-neutral-400 tracking-wide">
              <span>Subtotal</span>
              <span className="text-neutral-200 tabular-nums">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between items-center text-sm text-neutral-400 tracking-wide">
              <span>Frete {shipping?.tipo && <span className="text-neutral-600">({shipping.tipo})</span>}</span>
              <span className={`tabular-nums ${totalFrete > 0 ? 'text-neutral-200' : 'text-neutral-500 italic'}`}>
                {totalFrete > 0 ? formatCurrency(totalFrete) : 'A calcular'}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-end pt-4 mb-6 border-t border-dashed border-white/15">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400">Total</span>
            <span className="text-xl sm:text-2xl font-extrabold tracking-wide text-white tabular-nums">
              {formatCurrency(totalPedido)}
            </span>
          </div>
          
          {cartItems.length > 0 && (
            <div className="mb-6 pt-5 border-t border-white/[0.06]">
              <ShippingCalculator 
                cartItems={cartItems}
                selectedShipping={shipping}
                onShippingSelected={handleShippingSelected}
              />
            </div>
          )}
          
          <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.02] mb-6">
            <div className="bg-white/[0.04] py-2.5 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-center border-b border-white/[0.06] text-neutral-500">
              Endereço de Entrega
            </div>
            <div className="p-4 text-xs sm:text-sm text-neutral-300 text-center leading-relaxed">
              <p>{cartItems.length === 0 ? 'Endereço indisponível' : dadosEntrega}</p>
            </div>
          </div>

          <button 
            className="w-full py-4 px-6 bg-[#B3282D] hover:bg-[#932025] disabled:bg-white/[0.04] disabled:text-neutral-600 disabled:cursor-not-allowed text-white text-sm font-bold tracking-[0.15em] uppercase rounded-full shadow-[0_10px_30px_-8px_rgba(179,40,45,0.55)] disabled:shadow-none transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B3282D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]"
            disabled={cartItems.length === 0}
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
}