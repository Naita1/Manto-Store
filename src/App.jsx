import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ChatButton } from './components/ChatButton';
import { Toast } from './components/Toast';
import { Help } from './components/Help';

import { HomePage } from './pages/Home';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { ProductPage } from './pages/Product';
import { CartPage } from './pages/Cart';
import { AuthProvider } from './contexts/AuthContext';
import { ProfilePage } from './pages/Profile';
import { SearchPage } from './pages/Search';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainLayout>
          <Header />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} /> 
            <Route path="/produto/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} /> 
            <Route path='/profile' element={<ProfilePage/>} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/help" element={<Help />} />
          </Routes>

          <Footer />
          <ChatButton />
                    
          <Toast/>
        </MainLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;