import { IOrderRepository, OrderFilterOptions } from '@domain/repositories/IOrderRepository';
import { Order } from '@domain/entities/Order';

export class ListOrdersUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(options: OrderFilterOptions): Promise<{ rows: Order[]; count: number }> {
    return this.orderRepository.findAll(options);
  }
}
