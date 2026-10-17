import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthProvider } from './AuthContext';
import { useAuth } from './authContextValue';

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  onAuthStateChanged: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock('../services/firebase', () => ({ auth: {}, db: {} }));

function AuthStatus() {
  const { loading, signed, user } = useAuth();
  if (loading) return <p>Carregando autenticação</p>;
  return <p>{signed ? `Logado: ${user.email}` : 'Deslogado'}</p>;
}

describe('AuthProvider', () => {
  beforeEach(() => {
    onAuthStateChanged.mockImplementation((_auth, onChange) => {
      onChange(null);
      return vi.fn();
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('expõe o estado deslogado após a verificação inicial', async () => {
    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>,
    );

    expect(await screen.findByText('Deslogado')).toBeInTheDocument();
  });

  it('expõe o usuário quando a autenticação retorna uma sessão ativa', async () => {
    const authenticatedUser = { uid: 'user-1', email: 'cliente@manto.store' };
    onAuthStateChanged.mockImplementation((_auth, onChange) => {
      onChange(authenticatedUser);
      return vi.fn();
    });

    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>,
    );

    expect(await screen.findByText('Logado: cliente@manto.store')).toBeInTheDocument();
  });
});
