import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login';
import { useAuth } from '../../hooks/useAuth';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../hooks/useAuth');

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('Login Page', () => {
  const loginMock = jest.fn();

  beforeEach(() => {
    loginMock.mockReset();
    mockedUseAuth.mockReturnValue({ login: loginMock });
  });

  const renderLogin = () =>
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

  it('deve renderizar o formulário de login', () => {
    renderLogin();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve permitir digitar e-mail e senha', () => {
    renderLogin();
    const emailInput = screen.getByLabelText(/e-mail/i);
    const senhaInput = screen.getByLabelText(/senha/i);

    fireEvent.change(emailInput, { target: { value: 'teste@teste.com' } });
    fireEvent.change(senhaInput, { target: { value: '123456' } });

    expect(emailInput).toHaveValue('teste@teste.com');
    expect(senhaInput).toHaveValue('123456');
  });

  it('deve chamar login ao enviar o formulário', async () => {
    loginMock.mockResolvedValueOnce(undefined);
    renderLogin();

    const emailInput = screen.getByLabelText(/e-mail/i);
    const senhaInput = screen.getByLabelText(/senha/i);
    const button = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'teste@teste.com' } });
    fireEvent.change(senhaInput, { target: { value: '123456' } });

    fireEvent.click(button);

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('teste@teste.com', '123456');
    });
  });

  it('deve exibir mensagem de erro se login falhar', async () => {
    loginMock.mockRejectedValueOnce(new Error('Falha no login'));
    renderLogin();

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'teste@teste.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/falha no login/i)).toBeInTheDocument();
    });
  });
});
