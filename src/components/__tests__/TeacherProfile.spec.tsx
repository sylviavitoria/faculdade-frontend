import React from 'react';
import { render, screen } from '@testing-library/react';
import TeacherProfile from '../TeacherProfile';
import useProfile from '../../hooks/useProfile';

jest.mock('../../hooks/useProfile');

describe('TeacherProfile', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve mostrar loading enquanto carrega', () => {
    (useProfile as jest.Mock).mockReturnValue({
      profileData: null,
      loading: true,
      error: null,
    });

    render(<TeacherProfile />);
    expect(screen.getByText(/Carregando perfil/i)).toBeInTheDocument();
  });

  it('deve mostrar mensagem de erro se houver erro', () => {
    (useProfile as jest.Mock).mockReturnValue({
      profileData: null,
      loading: false,
      error: 'Erro ao carregar perfil',
    });

    render(<TeacherProfile />);
    expect(screen.getByText(/Erro ao carregar perfil/i)).toBeInTheDocument();
  });

});
