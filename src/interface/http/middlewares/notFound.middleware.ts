import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '@shared/errors';

export function notFoundMiddleware(_req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError('Rota não encontrada'));
}
