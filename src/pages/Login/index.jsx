import { LoginCard } from '../../components/LoginCard';
import { HelpCard } from '../../components/HelpCard';

export function LoginPage() {
  return (
    <main style={{ flex: 1, width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <section style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'stretch', flexWrap: 'wrap', width: '100%', maxWidth: '900px' }}>
        <LoginCard />
      </section>

      <div style={{ width: '100%', maxWidth: '1000px', height: '2px', backgroundColor: '#1F1F1F', margin: '4rem 0' }}></div>

      {/* <section style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', letterSpacing: '0.1rem', marginBottom: '2rem', color: 'var(--text-color)' }}>
          PRECISA DE AJUDA?
        </h2>
        <HelpCard />
      </section> */}
      
    </main>
  );
}