import { OrderItem, CreateOrderItemDTO } from './OrderItem';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  totalPrice: number;
  notes: string | null;
  items?: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderDTO {
  customerId: string;
  notes?: string;
  items: CreateOrderItemDTO[];
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
}
