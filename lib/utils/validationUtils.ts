export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (password.length < 6) {
    return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
  }
  return { isValid: true };
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || value.trim() === '') {
    return `${fieldName} es requerido`;
  }
  return null;
}

export function validateRegisterForm(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  jobOccupation: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // Validar campos requeridos
  const firstNameError = validateRequired(data.firstName, 'Nombre');
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateRequired(data.lastName, 'Apellido');
  if (lastNameError) errors.lastName = lastNameError;

  const emailError = validateRequired(data.email, 'Correo electrónico');
  if (emailError) errors.email = emailError;
  else if (!validateEmail(data.email)) {
    errors.email = 'Correo electrónico inválido';
  }

  const passwordError = validateRequired(data.password, 'Contraseña');
  if (passwordError) errors.password = passwordError;
  else {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message!;
    }
  }

  const jobError = validateRequired(data.jobOccupation, 'Ocupación');
  if (jobError) errors.jobOccupation = jobError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
