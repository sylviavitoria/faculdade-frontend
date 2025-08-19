import React from 'react';
import { render, screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';

describe('Sidebar', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
  });

  it('deve renderizar os itens do menu corretamente', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Alunos/i)).toBeInTheDocument();
    expect(screen.getByText(/Professores/i)).toBeInTheDocument();
    expect(screen.getByText(/Disciplinas/i)).toBeInTheDocument();
    expect(screen.getByText(/Matrículas/i)).toBeInTheDocument();
  });

  it('deve adicionar classe "active" no item correto baseado na rota', () => {
    render(
      <MemoryRouter initialEntries={['/disciplinas']}>
        <Sidebar />
      </MemoryRouter>
    );

    const activeLink = screen.getByText(/Disciplinas/i).closest('li');
    expect(activeLink).toHaveClass('active');
  });

  it('não deve renderizar overlay quando não estiver aberto em mobile', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });

    render(
      <MemoryRouter>
        <Sidebar isOpen={false} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('sidebar-overlay')).not.toBeInTheDocument();
  });
});
