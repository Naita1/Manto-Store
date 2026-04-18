import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import { MainLayout } from './components/MainLayout';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ChatButton } from './components/ChatButton';

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
          </Routes>

          <Footer />
          <ChatButton />
                    
          <Toaster 
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              style: {
                minWidth: '600px',      
                fontSize: '1.1rem',      
                padding: '16px 24px',   
                background: '#1E1E1E',  
                color: '#fff',           
                borderRadius: '12px',    
                border: '2px solid #333',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)', 
                fontWeight: '500',
              },
              success: {
                duration: 4000,          
                iconTheme: {
                  primary: '#B22222', 
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ff4b4b',
                  secondary: '#fff',
                },
              },
            }}
          />
        </MainLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;