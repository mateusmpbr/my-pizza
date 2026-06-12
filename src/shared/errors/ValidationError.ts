import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(message = 'Dados inválidos', details?: unknown) {
    super(message, 422, 'VALIDATION_ERROR', details);
  }
}
