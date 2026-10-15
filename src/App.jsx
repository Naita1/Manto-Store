import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ChatButton } from './components/ChatButton';
import { MainLayout } from './components/MainLayout';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { Loading } from './components/Loading';
import './styles/global.css';

const RegisterPage = lazy(() => import('./pages/Register').then(({ RegisterPage }) => ({ default: RegisterPage })));
const AuthProvider = lazy(() => import('./contexts/AuthContext').then(({ AuthProvider }) => ({ default: AuthProvider })));
const CollectionPage = lazy(() => import('./pages/Collection').then(({ CollectionPage }) => ({ default: CollectionPage })));
const ProductPage = lazy(() => import('./pages/Product').then(({ ProductPage }) => ({ default: ProductPage })));
const ProfilePage = lazy(() => import('./pages/Profile').then(({ ProfilePage }) => ({ default: ProfilePage })));
const SearchPage = lazy(() => import('./pages/Search').then(({ SearchPage }) => ({ default: SearchPage })));
const LoginPage = lazy(() => import('./pages/Login').then(({ LoginPage }) => ({ default: LoginPage })));
const CartPage = lazy(() => import('./pages/Cart').then(({ CartPage }) => ({ default: CartPage })));
const HomePage = lazy(() => import('./pages/Home').then(({ HomePage }) => ({ default: HomePage })));
const Help = lazy(() => import('./components/Help').then(({ Help }) => ({ default: Help })));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading message="Inicializando aplicação..." />}>
        <AuthProvider>
          <MainLayout>
            <Header />

            <Suspense fallback={<Loading message="Carregando página..." />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/produto/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/help" element={<Help />} />
                <Route path="/colecao/:id" element={<CollectionPage />} />
              </Routes>
            </Suspense>

            <Footer />
            <ChatButton />
            <Toast />
          </MainLayout>
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;