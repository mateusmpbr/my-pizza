import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { ICustomerRepository } from '@domain/repositories/ICustomerRepository';
import { IProductRepository } from '@domain/repositories/IProductRepository';
import { Order, CreateOrderDTO } from '@domain/entities/Order';
import { NotFoundError, ValidationError } from '@shared/errors';

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly customerRepository: ICustomerRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(dto: CreateOrderDTO): Promise<Order> {
    const customer = await this.customerRepository.findById(dto.customerId);
    if (!customer) throw new NotFoundError(`Cliente com id '${dto.customerId}' não encontrado`);

    if (!dto.items || dto.items.length === 0) {
      throw new ValidationError('O pedido deve ter ao menos um item');
    }

    const enrichedItems: Array<{
      productId: string;
      sizeId: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }> = [];

    let totalPrice = 0;

    for (const item of dto.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new NotFoundError(`Produto com id '${item.productId}' não encontrado`);
      }

      const size = product.sizes?.find((s) => s.id === item.sizeId);
      if (!size) {
        throw new NotFoundError(
          `Tamanho com id '${item.sizeId}' não encontrado para o produto '${product.name}'`,
        );
      }

      const unitPrice = product.price + size.additionalPrice;
      const subtotal = unitPrice * item.quantity;
      totalPrice += subtotal;

      enrichedItems.push({
        productId: item.productId,
        sizeId: item.sizeId,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      });
    }

    return this.orderRepository.create({
      customerId: dto.customerId,
      notes: dto.notes,
      totalPrice: Math.round(totalPrice * 100) / 100,
      items: enrichedItems,
    });
  }
}
