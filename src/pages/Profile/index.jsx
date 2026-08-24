import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../components/Loading';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({ 
    name: '', 
    phone: '', 
    address: '',
    email: '',
  });
  
  const [orders, setOrders] = useState([]); 
  const [cartItems, setCartItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (user?.uid) {
        try {
          const userDocSnap = await getDoc(doc(db, "users", user.uid));
          if (userDocSnap.exists()) {
            setUserData(prev => ({ ...prev, ...userDocSnap.data() }));
          }

          const qOrders = query(
            collection(db, "orders"), 
            where("userId", "==", user.uid),
            limit(3)
          );
          const orderSnap = await getDocs(qOrders);
          setOrders(orderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

          const cartDocRef = doc(db, "carrinhos", user.uid);
          const cartSnap = await getDoc(cartDocRef);
          
          if (cartSnap.exists()) {
            const cartData = cartSnap.data();
            const items = cartData.items || (cartData.title ? [cartData] : []);
            setCartItems(items.slice(0, 3));
          } else {
            setCartItems([]);
          }

        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [user?.uid]);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), userData);
      setIsEditing(false);
    } catch (e) { console.error(e); }
  };

  const handleLogout = async () => {
    try { await logout(); navigate('/login'); } catch (e) { console.error(e); }
  };

  if (loading) {
    return <Loading message="Carregando dados do seu perfil..." />;
  }

  const initialLetter = userData?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen w-full bg-[#0B0B0D] text-[#ECECEE] selection:bg-[#9C2A32] selection:text-white pb-20 font-sans antialiased">
      <style>{`
        @keyframes profileReveal {
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
          animation: profileReveal 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .stagger-1 { animation-delay: 0ms; }
        .stagger-2 { animation-delay: 60ms; }
        .stagger-3 { animation-delay: 120ms; }

        .edit-action-expand {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          margin-top: 0;
          padding-top: 0;
          border-top-color: transparent;
          transition: 
            grid-template-rows 280ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 220ms ease-out,
            margin-top 280ms cubic-bezier(0.16, 1, 0.3, 1),
            padding-top 280ms cubic-bezier(0.16, 1, 0.3, 1),
            border-color 280ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .edit-action-expand.is-open {
          grid-template-rows: 1fr;
          opacity: 1;
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top-color: rgba(255, 255, 255, 0.06);
        }

        .edit-action-content {
          overflow: hidden;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-reveal {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .edit-action-expand {
            transition: none !important;
          }
        }
      `}</style>

      <div className="relative border-b border-white/8 bg-linear-to-b from-white/2 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 animate-reveal stagger-1">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative group shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#141417] border border-white/10 group-hover:border-white/20 transition-colors duration-200 ease-out flex items-center justify-center font-bold text-2xl sm:text-3xl text-white tracking-wider">
                  {initialLetter}
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0B0B0D] rounded-full" title="Sessão ativa" />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                    {userData?.name || "Usuário"}
                  </h1>
                  <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/8">
                    Conta Cliente
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-normal">
                  {userData?.email || user?.email}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 ease-out cursor-pointer active:scale-[0.985] ${
                isEditing 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/15' 
                  : 'bg-white/4 text-neutral-200 border border-white/8 hover:bg-white/8 hover:text-white hover:border-white/15'
              }`}
            >
              {isEditing ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  CANCELAR EDIÇÃO
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  EDITAR PERFIL
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-reveal stagger-2">
          
          <section className={`lg:col-span-7 bg-[#131316] border rounded-2xl p-6 sm:p-7 backdrop-blur-md flex flex-col justify-between h-full transition-all duration-300 ease-out ${
            isEditing ? 'border-amber-500/30 bg-[#151519]' : 'border-white/8'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/6">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg transition-colors duration-200 ${isEditing ? 'bg-amber-500/10 text-amber-400' : 'bg-[#9C2A32]/10 text-[#9C2A32]'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Informações Pessoais
                  </h2>
                </div>
                
                <span className={`text-[11px] text-amber-400/90 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 transition-all duration-200 ease-out ${
                  isEditing ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-1 scale-95 pointer-events-none'
                }`}>
                  Modo de Edição
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                      Nome Completo
                    </label>
                    <input 
                      disabled={!isEditing} 
                      value={userData.name} 
                      onChange={e => setUserData({...userData, name: e.target.value})} 
                      placeholder="Seu nome" 
                      className="w-full bg-[#0B0B0D] border border-white/8 focus:border-amber-500/40 focus:bg-[#0E0E11] text-white text-sm rounded-xl px-3.5 py-2.5 outline-none transition-all duration-200 ease-out disabled:opacity-40 disabled:bg-[#08080A] disabled:border-transparent placeholder:text-neutral-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                      E-mail
                    </label>
                    <input 
                      disabled={!isEditing} 
                      value={userData.email} 
                      onChange={e => setUserData({...userData, email: e.target.value})} 
                      placeholder="seu@email.com" 
                      className="w-full bg-[#0B0B0D] border border-white/8 focus:border-amber-500/40 focus:bg-[#0E0E11] text-white text-sm rounded-xl px-3.5 py-2.5 outline-none transition-all duration-200 ease-out disabled:opacity-40 disabled:bg-[#08080A] disabled:border-transparent placeholder:text-neutral-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                      Telefone
                    </label>
                    <input 
                      disabled={!isEditing} 
                      value={userData.phone || ''} 
                      onChange={e => setUserData({...userData, phone: e.target.value})} 
                      placeholder="(00) 00000-0000" 
                      className="w-full bg-[#0B0B0D] border border-white/8 focus:border-amber-500/40 focus:bg-[#0E0E11] text-white text-sm rounded-xl px-3.5 py-2.5 outline-none transition-all duration-200 ease-out disabled:opacity-40 disabled:bg-[#08080A] disabled:border-transparent placeholder:text-neutral-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                      Endereço Salvo
                    </label>
                    <input 
                      disabled={!isEditing} 
                      value={userData.address || ''} 
                      onChange={e => setUserData({...userData, address: e.target.value})} 
                      placeholder="Rua, número, bairro" 
                      className="w-full bg-[#0B0B0D] border border-white/8 focus:border-amber-500/40 focus:bg-[#0E0E11] text-white text-sm rounded-xl px-3.5 py-2.5 outline-none transition-all duration-200 ease-out disabled:opacity-40 disabled:bg-[#08080A] disabled:border-transparent placeholder:text-neutral-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`border-t edit-action-expand ${isEditing ? 'is-open' : ''}`}>
              <div className="edit-action-content flex justify-end">
                <button 
                  onClick={handleSave}
                  tabIndex={isEditing ? 0 : -1}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#9C2A32] hover:bg-[#88242B] text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-all duration-200 ease-out cursor-pointer active:scale-[0.985]"
                >
                  Confirmar Alterações
                </button>
              </div>
            </div>
          </section>

          <section className="lg:col-span-5 bg-[#131316] border border-white/8 rounded-2xl p-6 sm:p-7 backdrop-blur-md flex flex-col justify-between h-full transition-colors duration-200">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/6">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#9C2A32]/10 text-[#9C2A32]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z" /></svg>
                  </div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Resumo do Carrinho
                  </h2>
                </div>
                {cartItems.length > 0 && (
                  <span className="text-[11px] font-mono text-neutral-400 bg-white/4 px-2 py-0.5 rounded-md border border-white/8">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}
                  </span>
                )}
              </div>

              <div className="space-y-2.5 flex-1 flex flex-col justify-center">
                {cartItems.length > 0 ? (
                  cartItems.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => navigate(`/produto/${item.productId}`)}
                      className="group flex items-center justify-between p-2.5 rounded-xl bg-[#0B0B0D] border border-white/6 hover:border-white/12 hover:bg-white/2 transition-all duration-200 ease-out cursor-pointer active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-lg bg-neutral-900 overflow-hidden shrink-0 border border-white/8">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-400">Sem foto</div>
                          )}
                        </div>
                        <span className="text-xs font-medium text-neutral-200 group-hover:text-white transition-colors duration-200 truncate">
                          {item.title}
                        </span>
                      </div>
                      <svg className="w-4 h-4 text-neutral-500 group-hover:text-neutral-200 group-hover:translate-x-0.5 transition-all duration-200 ease-out shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center rounded-xl border border-dashed border-white/8 bg-[#0B0B0D]/40 flex flex-col items-center justify-center h-full">
                    <p className="text-xs text-neutral-400">Seu carrinho está vazio.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/6">
              <button 
                onClick={() => navigate(cartItems.length > 0 ? '/cart' : '/')}
                className="w-full py-3 px-4 bg-[#9C2A32] hover:bg-[#88242B] text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition-all duration-200 ease-out cursor-pointer active:scale-[0.985]"
              >
                {cartItems.length > 0 ? 'Ver Carrinho Completo' : 'Adicionar Produtos'}
              </button>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-reveal stagger-3">
          
          <section className="lg:col-span-7 bg-[#131316] border border-white/8 rounded-2xl p-6 sm:p-7 backdrop-blur-md flex flex-col justify-between h-full transition-colors duration-200">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/6">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#9C2A32]/10 text-[#9C2A32]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m-8-10l8 4m-8-4v10l8 4" /></svg>
                  </div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Últimos Pedidos
                  </h2>
                </div>
              </div>

              <div className="space-y-3 flex-1 flex flex-col justify-center">
                {orders.length > 0 ? (
                  orders.map(order => (
                    <div 
                      key={order.id} 
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#0B0B0D] border border-white/6 hover:border-white/12 hover:bg-white/2 transition-all duration-200 ease-out gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/3 border border-white/8 flex items-center justify-center font-mono text-xs text-neutral-400 shrink-0">
                          #
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-medium text-white tracking-tight">
                            {order.id.slice(-8).toUpperCase()}
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : 'Recente'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {order.status || 'Processando'}
                        </span>
                        <span className="font-mono text-sm font-semibold text-white tabular-nums">
                          R$ {order.total}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center rounded-xl border border-dashed border-white/8 bg-[#0B0B0D]/40 flex flex-col items-center justify-center h-full">
                    <p className="text-xs text-neutral-400">Nenhum pedido realizado recentemente.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="lg:col-span-5 bg-[#131316] border border-white/8 rounded-2xl p-6 sm:p-7 backdrop-blur-md flex flex-col justify-between h-full transition-colors duration-200">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/6">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#9C2A32]/10 text-[#9C2A32]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Segurança da Conta
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0B0D] border border-white/6">
                  <span className="text-xs text-neutral-400">Status da Conta</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Ativa
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0B0D] border border-white/6">
                  <span className="text-xs text-neutral-400">Membro Desde</span>
                  <span className="font-mono text-xs font-medium text-white">
                    {userData.createdAt?.seconds ? new Date(userData.createdAt.seconds * 1000).getFullYear() : '2026'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/6">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-transparent hover:bg-rose-500/10 text-neutral-400 hover:text-rose-400 border border-white/8 hover:border-rose-500/20 text-xs font-medium tracking-wider uppercase rounded-xl transition-all duration-200 ease-out cursor-pointer active:scale-[0.985]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Encerrar Sessão
              </button>
            </div>
          </section>

        </div>

      </main>
    </div>
  );
}