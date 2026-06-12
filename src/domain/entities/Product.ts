import { ProductSize } from './ProductSize';

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  sizes?: ProductSize[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface UpdateProductDTO {
  categoryId?: string;
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  isAvailable?: boolean;
}
