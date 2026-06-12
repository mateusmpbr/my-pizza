import { Request, Response, NextFunction } from 'express';
import { ListCustomersUseCase } from '@application/use-cases/customer/ListCustomersUseCase';
import { GetCustomerByIdUseCase } from '@application/use-cases/customer/GetCustomerByIdUseCase';
import { CreateCustomerUseCase } from '@application/use-cases/customer/CreateCustomerUseCase';
import { UpdateCustomerUseCase } from '@application/use-cases/customer/UpdateCustomerUseCase';
import { CreateCustomerDTO, UpdateCustomerDTO } from '@domain/entities/Customer';
import { successResponse } from '@shared/utils/response';
import { parsePagination, buildMeta } from '@shared/utils/pagination';

export class CustomerController {
  constructor(
    private readonly listCustomersUseCase: ListCustomersUseCase,
    private readonly getCustomerByIdUseCase: GetCustomerByIdUseCase,
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, offset } = parsePagination(req.query);
      const { rows, count } = await this.listCustomersUseCase.execute({ offset, limit });
      res.json(
        successResponse(rows, 'Clientes listados com sucesso', buildMeta(count, page, limit)),
      );
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customer = await this.getCustomerByIdUseCase.execute(req.params['id']!);
      res.json(successResponse(customer, 'Cliente encontrado'));
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customer = await this.createCustomerUseCase.execute(req.body as CreateCustomerDTO);
      res.status(201).json(successResponse(customer, 'Cliente criado com sucesso'));
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customer = await this.updateCustomerUseCase.execute(
        req.params['id']!,
        req.body as UpdateCustomerDTO,
      );
      res.json(successResponse(customer, 'Cliente atualizado com sucesso'));
    } catch (err) {
      next(err);
    }
  };
}
