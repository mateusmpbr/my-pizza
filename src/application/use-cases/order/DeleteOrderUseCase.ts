import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { NotFoundError, ValidationError } from '@shared/errors';

export class DeleteOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(id: string): Promise<void> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundError(`Pedido com id '${id}' não encontrado`);

    if (order.status !== 'pending' && order.status !== 'cancelled') {
      throw new ValidationError(
        `Pedido não pode ser removido no status '${order.status}'. Apenas pedidos com status 'pending' ou 'cancelled' podem ser removidos`,
      );
    }

    return this.orderRepository.delete(id);
  }
}
