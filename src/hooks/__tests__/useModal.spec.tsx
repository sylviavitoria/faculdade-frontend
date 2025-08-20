import { renderHook, act } from '@testing-library/react';
import useModal from '../useModal';

describe('useModal', () => {
  it('inicializa fechado por padrão', () => {
    const { result } = renderHook(() => useModal());
    expect(result.current.isOpen).toBe(false);
  });

  it('inicializa aberto se defaultOpen = true', () => {
    const { result } = renderHook(() => useModal({ defaultOpen: true }));
    expect(result.current.isOpen).toBe(true);
  });

  it('abre o modal com open()', () => {
    const { result } = renderHook(() => useModal());
    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('fecha o modal com close()', () => {
    const { result } = renderHook(() => useModal({ defaultOpen: true }));
    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('alterna o estado com toggle()', () => {
    const { result } = renderHook(() => useModal());
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });
});
