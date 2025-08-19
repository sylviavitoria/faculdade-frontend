import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegistrationSearchById from "../RegistrationSearchById";
import { registrationService } from "../../service/RegistrationService";
import { RegistrationResponse } from "../../types/Registration";

jest.mock("../../service/RegistrationService", () => ({
  registrationService: {
    getById: jest.fn(),
  },
}));

const mockRegistration: RegistrationResponse = {
  id: 1,
  status: "APROVADA",
  dataMatricula: "2025-08-10T14:30:00Z",
  aluno: {
    id: 10,
    nome: "Maria Souza",
    matricula: "2023001",
    email: "maria@example.com",
  },
  disciplina: {
    id: 20,
    nome: "Matemática",
    cargaHoraria: 60,
  },
  nota1: 8,
  nota2: 9,
};

describe("RegistrationSearchById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve desabilitar botão buscar quando ID está vazio", async () => {
    render(<RegistrationSearchById />);

    const input = screen.getByLabelText(/id da matrícula/i);
    const button = screen.getByRole("button", { name: /buscar/i });

    expect(button).toBeDisabled();

    fireEvent.change(input, { target: { value: "1" } });
    expect(button).toBeEnabled();

    fireEvent.change(input, { target: { value: "" } });
    expect(button).toBeDisabled();

    expect(registrationService.getById).not.toHaveBeenCalled();
  });

  it("deve buscar matrícula com sucesso", async () => {
    (registrationService.getById as jest.Mock).mockResolvedValueOnce(
      mockRegistration
    );

    render(<RegistrationSearchById />);

    fireEvent.change(screen.getByLabelText(/id da matrícula/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /buscar/i }));

    expect(await screen.findByText(/matrícula #1/i)).toBeInTheDocument();
    expect(screen.getByText(/Maria Souza/i)).toBeInTheDocument();
    expect(screen.getByText(/Matemática/i)).toBeInTheDocument();
    expect(screen.getByText(/Aprovada/i)).toBeInTheDocument();

    expect(registrationService.getById).toHaveBeenCalledTimes(1);
    expect(registrationService.getById).toHaveBeenCalledWith(1);
  });

  it("deve exibir erro quando o service lança exceção", async () => {
    (registrationService.getById as jest.Mock).mockRejectedValueOnce(
      new Error("Erro ao buscar matrícula")
    );

    render(<RegistrationSearchById />);

    fireEvent.change(screen.getByLabelText(/id da matrícula/i), {
      target: { value: "99" },
    });
    fireEvent.click(screen.getByRole("button", { name: /buscar/i }));

    expect(
      await screen.findByText(/erro ao buscar matrícula/i)
    ).toBeInTheDocument();
  });

  it("deve limpar busca quando clicar no botão Limpar", async () => {
    (registrationService.getById as jest.Mock).mockResolvedValueOnce(
      mockRegistration
    );

    render(<RegistrationSearchById />);

    fireEvent.change(screen.getByLabelText(/id da matrícula/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /buscar/i }));

    expect(await screen.findByText(/matrícula #1/i)).toBeInTheDocument();

    const clearButton = screen.getByRole("button", { name: /limpar/i });
    fireEvent.click(clearButton);

    await waitFor(() =>
      expect(screen.queryByText(/matrícula #1/i)).not.toBeInTheDocument()
    );
  });

  it("deve mostrar mensagem de nenhum resultado encontrado", async () => {
    (registrationService.getById as jest.Mock).mockResolvedValueOnce(null);

    render(<RegistrationSearchById />);

    fireEvent.change(screen.getByLabelText(/id da matrícula/i), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /buscar/i }));

    await waitFor(() => {
      expect(screen.queryByText(/matrícula #/i)).not.toBeInTheDocument();
    });
  });
});
