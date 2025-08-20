export function montarParametroOrdenacao(
  ordenacao?: string,
  padrao: { campo: string; direcao: 'asc' | 'desc' }
): string {
  if (!ordenacao) {
    return `&sort=${padrao.campo}&direction=${padrao.direcao}`;
  }

  const parts = ordenacao.split(',');
  if (parts.length > 1) {
    return `&sort=${parts[0]}&direction=${parts[1]}`;
  }

  return `&sort=${ordenacao}`;
}
