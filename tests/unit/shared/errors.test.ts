import { AppError, NotFoundError, ValidationError, ConflictError } from '@shared/errors';

describe('AppError hierarchy', () => {
  it('AppError stores all properties', () => {
    const err = new AppError('msg', 500, 'CODE', { extra: true });
    expect(err.message).toBe('msg');
    expect(err.statusCode).toBe(500);
    expect(err.code).toBe('CODE');
    expect(err.details).toEqual({ extra: true });
    expect(err instanceof Error).toBe(true);
  });

  it('NotFoundError has 404 and NOT_FOUND code', () => {
    const err = new NotFoundError();
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err instanceof AppError).toBe(true);
  });

  it('NotFoundError accepts custom message', () => {
    const err = new NotFoundError('Cliente não encontrado');
    expect(err.message).toBe('Cliente não encontrado');
  });

  it('ValidationError has 422 and VALIDATION_ERROR code', () => {
    const err = new ValidationError('Dados inválidos', [{ field: 'email' }]);
    expect(err.statusCode).toBe(422);
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.details).toEqual([{ field: 'email' }]);
  });

  it('ConflictError has 409 and CONFLICT code', () => {
    const err = new ConflictError();
    expect(err.statusCode).toBe(409);
    expect(err.code).toBe('CONFLICT');
  });
});
