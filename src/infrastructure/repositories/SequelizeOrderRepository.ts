import {
  IOrderRepository,
  OrderFilterOptions,
  CreateOrderRepositoryDTO,
} from '@domain/repositories/IOrderRepository';
import { Order, OrderStatus } from '@domain/entities/Order';
import { OrderItem } from '@domain/entities/OrderItem';
import { OrderModel } from '@infrastructure/database/models/OrderModel';
import { OrderItemModel } from '@infrastructure/database/models/OrderItemModel';
import { CustomerModel } from '@infrastructure/database/models/CustomerModel';
import { ProductModel } from '@infrastructure/database/models/ProductModel';
import { ProductSizeModel } from '@infrastructure/database/models/ProductSizeModel';
import { sequelize } from '@infrastructure/database/connection';

export class SequelizeOrderRepository implements IOrderRepository {
  async findAll(options: OrderFilterOptions): Promise<{ rows: Order[]; count: number }> {
    const where: Record<string, unknown> = {};
    if (options.customerId) where['customerId'] = options.customerId;
    if (options.status) where['status'] = options.status;

    const result = await OrderModel.findAndCountAll({
      where: Object.keys(where).length > 0 ? where : undefined,
      offset: options.offset,
      limit: options.limit,
      include: [
        { model: CustomerModel },
        {
          model: OrderItemModel,
          as: 'items',
          include: [{ model: ProductModel }, { model: ProductSizeModel, as: 'size' }],
        },
      ],
      order: [['created_at', 'DESC']],
      distinct: true,
    });

    return { rows: result.rows.map(this.toDomain), count: result.count };
  }

  async findById(id: string): Promise<Order | null> {
    const model = await OrderModel.findByPk(id, {
      include: [
        { model: CustomerModel },
        {
          model: OrderItemModel,
          as: 'items',
          include: [{ model: ProductModel }, { model: ProductSizeModel, as: 'size' }],
        },
      ],
    });
    return model ? this.toDomain(model) : null;
  }

  async create(input: CreateOrderRepositoryDTO): Promise<Order> {
    const transaction = await sequelize.transaction();
    try {
      const order = await OrderModel.create(
        {
          customerId: input.customerId,
          notes: input.notes ?? null,
          totalPrice: input.totalPrice,
          status: 'pending',
        } as Partial<OrderModel>,
        { transaction },
      );

      await OrderItemModel.bulkCreate(
        input.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          sizeId: item.sizeId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })),
        { transaction },
      );

      await transaction.commit();

      const full = await this.findById(order.id);
      return full!;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const model = await OrderModel.findByPk(id);
    if (!model) throw new Error(`Order ${id} not found`);
    await model.update({ status });
    const full = await this.findById(id);
    return full!;
  }

  async delete(id: string): Promise<void> {
    await OrderModel.destroy({ where: { id } });
  }

  private toDomain(model: OrderModel): Order {
    const items: OrderItem[] = model.items
      ? model.items.map((item: OrderItemModel) => ({
          id: item.id,
          orderId: item.orderId,
          productId: item.productId,
          sizeId: item.sizeId,
          quantity: item.quantity,
          unitPrice: parseFloat(String(item.getDataValue('unitPrice'))),
          subtotal: parseFloat(String(item.getDataValue('subtotal'))),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }))
      : [];

    return {
      id: model.id,
      customerId: model.customerId,
      status: model.status as OrderStatus,
      totalPrice: parseFloat(String(model.getDataValue('totalPrice'))),
      notes: model.notes,
      items,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
