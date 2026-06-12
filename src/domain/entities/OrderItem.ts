export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  sizeId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderItemDTO {
  productId: string;
  sizeId: string;
  quantity: number;
}
