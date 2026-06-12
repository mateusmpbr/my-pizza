import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { Order, OrderStatus } from '@domain/entities/Order';
import { NotFoundError, ValidationError } from '@shared/errors';

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(id: string, newStatus: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundError(`Pedido com id '${id}' não encontrado`);

    const allowed = ALLOWED_TRANSITIONS[order.status];
    if (!allowed.includes(newStatus)) {
      throw new ValidationError(
        `Transição de status inválida: '${order.status}' → '${newStatus}'. Transições permitidas: ${allowed.join(', ') || 'nenhuma'}`,
      );
    }

    return this.orderRepository.updateStatus(id, newStatus);
  }
}
