import { render, screen } from '@testing-library/react';
import Banner from '../Banner';

describe('Banner', () => {
  const title = 'Bem-vindo';
  const description = 'Este é um banner de teste';

  it('renderiza o título corretamente', () => {
    render(<Banner title={title} description={description} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(title);
  });

  it('renderiza a descrição corretamente', () => {
    render(<Banner title={title} description={description} />);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('possui a estrutura de classes correta', () => {
    render(<Banner title={title} description={description} />);
    const featuredDiv = screen.getByText(title).closest('.featured-image');
    expect(featuredDiv).toBeInTheDocument();
    expect(featuredDiv?.querySelector('.image-container')).toBeInTheDocument();
    expect(featuredDiv?.querySelector('.image-text')).toBeInTheDocument();
  });
});
