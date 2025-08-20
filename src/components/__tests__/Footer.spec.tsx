import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../Footer';

jest.mock('../style/Footer.css', () => ({}));

describe('Footer Component', () => {
  test('deve renderizar o componente Footer', () => {
    render(<Footer />);

    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  test('deve exibir o texto de copyright correto', () => {
    render(<Footer />);

    const copyrightText = screen.getByText('© Criado por Sylvia');
    expect(copyrightText).toBeInTheDocument();
  });

  test('deve ter a classe CSS correta', () => {
    render(<Footer />);

    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toHaveClass('footer');
  });

  test('deve conter um parágrafo com o texto de copyright', () => {
    render(<Footer />);

    const paragraph = screen.getByText('© Criado por Sylvia');
    expect(paragraph.tagName).toBe('P');
  });

  test('deve renderizar sem erros quando chamado múltiplas vezes', () => {
    const { unmount } = render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    
    unmount();
    
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
