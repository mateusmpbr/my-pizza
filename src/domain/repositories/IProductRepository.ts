import { Product, CreateProductDTO, UpdateProductDTO } from '@domain/entities/Product';
import { PaginationOptions } from '@shared/utils/pagination';

export interface ProductFilterOptions extends PaginationOptions {
  categoryId?: string;
  isAvailable?: boolean;
}

export interface IProductRepository {
  findAll(options: ProductFilterOptions): Promise<{ rows: Product[]; count: number }>;
  findById(id: string): Promise<Product | null>;
  create(dto: CreateProductDTO): Promise<Product>;
  update(id: string, dto: UpdateProductDTO): Promise<Product>;
  delete(id: string): Promise<void>;
}
