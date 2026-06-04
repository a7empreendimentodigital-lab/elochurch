/** Remove caracteres não numéricos do CPF */
export function stripCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

/** Formata CPF: 000.000.000-00 */
export function formatCpf(cpf: string): string {
  const d = stripCpf(cpf);
  if (d.length !== 11) return cpf;
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/** Valida dígitos verificadores do CPF brasileiro */
export function isValidCpf(cpf: string): boolean {
  const digits = stripCpf(cpf);
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i], 10) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(digits[9], 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i], 10) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  return rest === parseInt(digits[10], 10);
}
