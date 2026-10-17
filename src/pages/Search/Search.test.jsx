import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { SearchPage } from './index';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
}));

vi.mock('../../services/firebase', () => ({ db: {} }));

function CurrentPath() {
  const location = useLocation();
  return <p>{location.pathname}</p>;
}

describe('SearchPage', () => {
  beforeEach(() => {
    collection.mockReturnValue({});
    getDocs.mockResolvedValue({
      docs: [
        { id: 'sao-paulo', data: () => ({ title: 'São Paulo Home', price: 200, image: [] }) },
        { id: 'flamengo', data: () => ({ title: 'Flamengo Home', price: 180, image: [] }) },
      ],
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('filtra sem diferenciar acentos e navega ao selecionar um manto', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/search?q=sao%20paulo']}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
          <Route path="/produto/:id" element={<CurrentPath />} />
        </Routes>
      </MemoryRouter>,
    );

    const productLink = await screen.findByRole('link', { name: /São Paulo Home/ });

    expect(screen.getByText('1 manto encontrado')).toBeInTheDocument();
    expect(screen.queryByText('Flamengo Home')).not.toBeInTheDocument();

    await user.click(productLink);
    expect(screen.getByText('/produto/sao-paulo')).toBeInTheDocument();
  });
});
