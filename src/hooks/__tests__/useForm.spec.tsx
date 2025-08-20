import { renderHook, act } from '@testing-library/react';
import {FormEvent } from 'react';
import useForm from '../useForm';

type TestForm = {
  nome: string;
  idade: number;
  aceite: boolean;
};

describe('useForm', () => {
  const initialValues: TestForm = { nome: '', idade: 0, aceite: false };
  const validationRules = {
    nome: [{ required: true, message: 'Nome é obrigatório' }],
    idade: [
      { custom: (value) => typeof value === 'number' && value > 0, message: 'Idade deve ser maior que 0' }
    ],
    aceite: [{ custom: (value) => value === true, message: 'Aceite obrigatório' }]
  };

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  it('valida formulário e define erros', () => {
    const { result } = renderHook(() => useForm({ initialValues, validationRules }));

    act(() => {

      const formEvent = { preventDefault: jest.fn() } as unknown as FormEvent<HTMLFormElement>;
      result.current.handleSubmit(formEvent);
    });

    expect(result.current.errors.nome).toBe('Nome é obrigatório');
    expect(result.current.errors.idade).toBe('Idade deve ser maior que 0');
    expect(result.current.errors.aceite).toBe('Aceite obrigatório');
  });

});
