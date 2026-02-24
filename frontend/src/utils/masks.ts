/**
 * Aplica máscara de CPF: 000.000.000-00
 * Retorna apenas dígitos para o valor puro (envio à API).
 */
export function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/** Remove formatação do CPF (apenas dígitos). */
export function unmaskCpf(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Aplica máscara de telefone BR: (00) 00000-0000 ou (00) 0000-0000
 */
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : '';
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/** Remove formatação do telefone (apenas dígitos). */
export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, '');
}
