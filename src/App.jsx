import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ChatButton } from './components/ChatButton'

import { HomePage } from './pages/Home';
import { LoginPage } from './pages/Login';
import { ProductPage } from './pages/Product';
import { CartPage } from './pages/Cart';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Header />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/produto/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} /> 
        </Routes>

        <Footer />
        <ChatButton />
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;