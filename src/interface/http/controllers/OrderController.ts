import { Request, Response, NextFunction } from 'express';
import { ListOrdersUseCase } from '@application/use-cases/order/ListOrdersUseCase';
import { GetOrderByIdUseCase } from '@application/use-cases/order/GetOrderByIdUseCase';
import { CreateOrderUseCase } from '@application/use-cases/order/CreateOrderUseCase';
import { UpdateOrderStatusUseCase } from '@application/use-cases/order/UpdateOrderStatusUseCase';
import { DeleteOrderUseCase } from '@application/use-cases/order/DeleteOrderUseCase';
import { CreateOrderDTO, OrderStatus } from '@domain/entities/Order';
import { successResponse } from '@shared/utils/response';
import { parsePagination, buildMeta } from '@shared/utils/pagination';

export class OrderController {
  constructor(
    private readonly listOrdersUseCase: ListOrdersUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly deleteOrderUseCase: DeleteOrderUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, offset } = parsePagination(req.query);
      const status = req.query['status'] as OrderStatus | undefined;
      const customerId = req.query['customerId'] as string | undefined;

      const { rows, count } = await this.listOrdersUseCase.execute({
        offset,
        limit,
        status,
        customerId,
      });
      res.json(
        successResponse(rows, 'Pedidos listados com sucesso', buildMeta(count, page, limit)),
      );
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.getOrderByIdUseCase.execute(req.params['id']!);
      res.json(successResponse(order, 'Pedido encontrado'));
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.createOrderUseCase.execute(req.body as CreateOrderDTO);
      res.status(201).json(successResponse(order, 'Pedido criado com sucesso'));
    } catch (err) {
      next(err);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.updateOrderStatusUseCase.execute(
        req.params['id']!,
        req.body.status as OrderStatus,
      );
      res.json(successResponse(order, 'Status do pedido atualizado com sucesso'));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteOrderUseCase.execute(req.params['id']!);
      res.json(successResponse(null, 'Pedido removido com sucesso'));
    } catch (err) {
      next(err);
    }
  };
}
