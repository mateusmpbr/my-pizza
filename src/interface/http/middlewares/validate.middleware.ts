import { Request, Response, NextFunction } from 'express';
import { ValidateFunction } from 'ajv';
import { ValidationError } from '@shared/errors';

export function validate(validateFn: ValidateFunction) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const valid = validateFn(req.body);
    if (!valid) {
      next(new ValidationError('Dados de entrada inválidos', validateFn.errors));
      return;
    }
    next();
  };
}
