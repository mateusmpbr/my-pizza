import { Category } from '@domain/entities/Category';
import { PaginationOptions } from '@shared/utils/pagination';

export interface ICategoryRepository {
  findAll(options?: PaginationOptions): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
}
