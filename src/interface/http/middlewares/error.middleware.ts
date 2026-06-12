import { Request, Response, NextFunction } from 'express';
import { UniqueConstraintError, ValidationError as SequelizeValidationError } from 'sequelize';
import { AppError } from '@shared/errors';
import { errorResponse } from '@shared/utils/response';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.message, err.details));
    return;
  }

  if (err instanceof UniqueConstraintError) {
    res.status(409).json(errorResponse('Registro duplicado'));
    return;
  }

  if (err instanceof SequelizeValidationError) {
    res.status(422).json(
      errorResponse(
        'Dados inválidos',
        err.errors.map((e) => e.message),
      ),
    );
    return;
  }

  console.error('Erro não tratado:', err);
  res.status(500).json(errorResponse('Erro interno do servidor'));
}
