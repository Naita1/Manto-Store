import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { collection, getDocs, limit, query, startAfter } from 'firebase/firestore';
import { CollectionPage } from './index';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  limit: vi.fn(size => ({ type: 'limit', size })),
  query: vi.fn((...constraints) => constraints),
  startAfter: vi.fn(cursor => ({ type: 'startAfter', cursor })),
}));

vi.mock('../../services/firebase', () => ({ db: {} }));

describe('CollectionPage', () => {
  beforeEach(() => {
    collection.mockReturnValue({});
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('carrega páginas com cursor e remove o botão quando não há mais produtos', async () => {
    const user = userEvent.setup();
    const primeiraPagina = Array.from({ length: 10 }, (_, index) => ({
      id: `produto-${index}`,
      data: () => ({ title: `Camisa ${index}`, price: 100, image: [] }),
    }));
    const ultimaPagina = [{
      id: 'produto-final',
      data: () => ({ title: 'Camisa final', price: 120, image: [] }),
    }];
    getDocs
      .mockResolvedValueOnce({ docs: primeiraPagina })
      .mockResolvedValueOnce({ docs: ultimaPagina });

    render(
      <MemoryRouter initialEntries={['/colecao/camisa']}>
        <Routes>
          <Route path="/colecao/:id" element={<CollectionPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('link', { name: /Camisa 0/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Carregar mais' })).toBeInTheDocument();
    expect(limit).toHaveBeenCalledWith(10);
    expect(query).toHaveBeenCalledWith(expect.anything(), { type: 'limit', size: 10 });

    await user.click(screen.getByRole('button', { name: 'Carregar mais' }));

    expect(await screen.findByRole('link', { name: /Camisa final/ })).toBeInTheDocument();
    expect(startAfter).toHaveBeenCalledWith(primeiraPagina.at(-1));
    expect(query).toHaveBeenLastCalledWith(
      expect.anything(),
      { type: 'startAfter', cursor: primeiraPagina.at(-1) },
      { type: 'limit', size: 10 },
    );
    expect(screen.queryByRole('button', { name: /Carregar mais/ })).not.toBeInTheDocument();
  });
});
