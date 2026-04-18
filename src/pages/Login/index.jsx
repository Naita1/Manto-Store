import { LoginCard } from '../../components/LoginCard';

export function LoginPage() {
  return (
    <main style={{ flex: 1, width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <section style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'stretch', flexWrap: 'wrap', width: '100%', maxWidth: '900px' }}>
        <LoginCard />
      </section>

      <div style={{ width: '100%', maxWidth: '1000px', height: '2px', backgroundColor: '#1F1F1F', margin: '4rem 0' }}></div>
      
    </main>
  );
}