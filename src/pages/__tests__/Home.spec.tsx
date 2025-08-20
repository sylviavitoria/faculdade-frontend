import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Home from '../Home';
import Banner from '../../components/Banner';

jest.mock('../../components/Banner', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="banner-mock" />),
}));

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o Banner com título e descrição corretos', async () => {
    const mockTitle = "Bem-vindo ao Sistema da Faculdade!";
    const mockDescription = "Nosso sistema oferece uma plataforma prática e segura para você acompanhar as atividades acadêmicas, participar das assembleias e exercer seu direito de voto com transparência. Conectando alunos, professores e colaboradores para uma gestão colaborativa e eficiente.";

    (Banner as jest.Mock).mockImplementation(({ title, description }) => (
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    ));

    await act(async () => {
      render(<Home />);
    });

    expect(screen.getByRole('heading', { level: 1, name: mockTitle })).toBeInTheDocument();
    expect(screen.getByText(mockDescription)).toBeInTheDocument();
  });
});
