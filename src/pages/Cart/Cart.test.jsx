import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CartPage } from './index';
import { useAuth } from '../../contexts/authContextValue';
import { doc, onSnapshot } from 'firebase/firestore';

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  onSnapshot: vi.fn(),
  updateDoc: vi.fn(),
}));

vi.mock('../../services/firebase', () => ({ db: {} }));
vi.mock('../../contexts/authContextValue', () => ({ useAuth: vi.fn() }));
vi.mock('../../components/ShippingCalculator', () => ({
  ShippingCalculator: () => null,
}));

describe('CartPage', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: { uid: 'user-1' } });
    doc.mockReturnValue({});
    onSnapshot.mockImplementation((_reference, onUpdate) => {
      onUpdate({
        exists: () => true,
        data: () => ({
          items: [
            { productId: 'shirt-1', title: 'Camisa A', size: 'M', price: 100, quantity: 2 },
            { productId: 'shirt-2', title: 'Camisa B', size: 'G', price: 50, quantity: 1 },
          ],
          shipping: { tipo: 'PAC', valor: 18.5, cep: '01000-000', cidade: 'São Paulo - SP' },
        }),
      });
      return vi.fn();
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('soma os itens e o frete no total do pedido', async () => {
    render(
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/250,00/)).toBeInTheDocument();
    expect(screen.getByText(/18,50/)).toBeInTheDocument();
    expect(screen.getByText(/268,50/)).toBeInTheDocument();
    expect(screen.getByText(/São Paulo - SP - CEP: 01000-000/)).toBeInTheDocument();
  });
});
