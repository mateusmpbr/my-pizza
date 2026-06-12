import { Order, OrderStatus } from '@domain/entities/Order';
import { PaginationOptions } from '@shared/utils/pagination';

export interface OrderFilterOptions extends PaginationOptions {
  customerId?: string;
  status?: OrderStatus;
}

export interface CreateOrderRepositoryDTO {
  customerId: string;
  notes?: string;
  totalPrice: number;
  items: Array<{
    productId: string;
    sizeId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
}

export interface IOrderRepository {
  findAll(options: OrderFilterOptions): Promise<{ rows: Order[]; count: number }>;
  findById(id: string): Promise<Order | null>;
  create(dto: CreateOrderRepositoryDTO): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
  delete(id: string): Promise<void>;
}
