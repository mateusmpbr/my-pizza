import { AppError } from './AppError';

export class ConflictError extends AppError {
  constructor(message = 'Registro em conflito') {
    super(message, 409, 'CONFLICT');
  }
}
