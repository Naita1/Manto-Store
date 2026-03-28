// src/App.jsx
import { MainLayout } from './components/MainLayout';
import { Header } from './components/Header';
import { LoginCard } from './components/LoginCard';
import { RegisterCard } from './components/RegisterCard';
import './styles/global.css'; 

function App() {
  return (
    // Envolvemos tudo no MainLayout
    <MainLayout>
      <Header />
      
      {/* No futuro, os formulários entrarão aqui */}
      <main style={{flex: 1, display: 'flex', flexDirection: 'row', gap: '10rem',
         justifyContent: 'center', alignItems: 'stretch', flexWrap: 'wrap', width: '100%', padding: '2rem' }}>
      <LoginCard/>
      <RegisterCard/>
      </main>

      {/* No futuro, o Footer entrará aqui */}
    </MainLayout>
  );
}

export default App;