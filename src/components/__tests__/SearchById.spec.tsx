import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchById from "../SearchById";

describe("SearchById Component", () => {
  let onSearchMock: jest.Mock;

  beforeEach(() => {
    onSearchMock = jest.fn();
  });

  it("renderiza com label e placeholder padrão", () => {
    render(<SearchById onSearch={onSearchMock} isLoading={false} />);

    expect(screen.getByLabelText(/buscar por id/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/digite o id para buscar/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /buscar/i })).toBeDisabled();
  });

  it("habilita o botão quando há valor válido", () => {
    render(<SearchById onSearch={onSearchMock} isLoading={false} />);

    const input = screen.getByLabelText(/buscar por id/i);
    const button = screen.getByRole("button", { name: /buscar/i });

    fireEvent.change(input, { target: { value: "123" } });
    expect(button).toBeEnabled();
  });

  it("desabilita botão quando isLoading é true", () => {
    render(<SearchById onSearch={onSearchMock} isLoading={true} />);

    const input = screen.getByLabelText(/buscar por id/i);
    const button = screen.getByRole("button", { name: /buscando/i });

    fireEvent.change(input, { target: { value: "123" } });
    expect(button).toBeDisabled();
  });

  it("chama onSearch com ID válido ao submeter", () => {
    render(<SearchById onSearch={onSearchMock} isLoading={false} />);

    const input = screen.getByLabelText(/buscar por id/i);
    const button = screen.getByRole("button", { name: /buscar/i });

    fireEvent.change(input, { target: { value: "42" } });
    fireEvent.click(button);

    expect(onSearchMock).toHaveBeenCalledTimes(1);
    expect(onSearchMock).toHaveBeenCalledWith(42);
  });

  it("não chama onSearch quando input está vazio", () => {
    render(<SearchById onSearch={onSearchMock} isLoading={false} />);

    const button = screen.getByRole("button", { name: /buscar/i });
    fireEvent.click(button);

    expect(onSearchMock).not.toHaveBeenCalled();
  });

  it("não permite caracteres não numéricos no input", () => {
    render(<SearchById onSearch={onSearchMock} isLoading={false} />);

    const input = screen.getByLabelText(/buscar por id/i);

    fireEvent.change(input, { target: { value: "abc" } });
    expect(input).toHaveValue("");

    fireEvent.change(input, { target: { value: "123" } });
    expect(input).toHaveValue("123");
  });
});
