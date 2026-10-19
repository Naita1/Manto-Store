import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { collection, getDocs, limit, query, startAfter } from 'firebase/firestore';
import { SearchPage } from './index';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  limit: vi.fn(size => ({ type: 'limit', size })),
  query: vi.fn((...constraints) => constraints),
  startAfter: vi.fn(cursor => ({ type: 'startAfter', cursor })),
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
    expect(query).toHaveBeenCalledWith(expect.anything(), { type: 'limit', size: 10 });

    await user.click(productLink);
    expect(screen.getByText('/produto/sao-paulo')).toBeInTheDocument();
    expect(limit).toHaveBeenCalledWith(10);
    expect(startAfter).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: /Carregar mais/ })).not.toBeInTheDocument();
  });

  it('busca a próxima página usando o último documento e oculta o botão ao terminar', async () => {
    const user = userEvent.setup();
    const primeiraPagina = Array.from({ length: 10 }, (_, index) => ({
      id: `produto-${index}`,
      data: () => ({
        title: index === 0 ? 'Manto inicial' : `Outro produto ${index}`,
        price: 100,
        image: [],
      }),
    }));
    const ultimaPagina = [{
      id: 'produto-final',
      data: () => ({ title: 'Manto final', price: 120, image: [] }),
    }];
    getDocs
      .mockResolvedValueOnce({ docs: primeiraPagina })
      .mockResolvedValueOnce({ docs: ultimaPagina });

    render(
      <MemoryRouter initialEntries={['/search?q=manto']}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('link', { name: /Manto inicial/ })).toBeInTheDocument();
    const loadMoreButton = screen.getByRole('button', { name: 'Carregar mais' });
    await user.click(loadMoreButton);

    expect(await screen.findByRole('link', { name: /Manto final/ })).toBeInTheDocument();
    expect(startAfter).toHaveBeenCalledWith(primeiraPagina.at(-1));
    expect(query).toHaveBeenLastCalledWith(
      expect.anything(),
      { type: 'startAfter', cursor: primeiraPagina.at(-1) },
      { type: 'limit', size: 10 },
    );
    expect(screen.queryByRole('button', { name: /Carregar mais/ })).not.toBeInTheDocument();
  });
});
