export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

const MIN_LENGTH = 6;
const MAX_LENGTH = 100;

/**
 * Valida senha: mínimo 6 caracteres, pelo menos uma letra e um número.
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  if (password.length < MIN_LENGTH) {
    errors.push(`Mínimo ${MIN_LENGTH} caracteres.`);
  }
  if (password.length > MAX_LENGTH) {
    errors.push(`Máximo ${MAX_LENGTH} caracteres.`);
  }
  if (password.length >= MIN_LENGTH && !/\d/.test(password)) {
    errors.push('Pelo menos um número.');
  }
  if (password.length >= MIN_LENGTH && !/[a-zA-Z]/.test(password)) {
    errors.push('Pelo menos uma letra.');
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}
