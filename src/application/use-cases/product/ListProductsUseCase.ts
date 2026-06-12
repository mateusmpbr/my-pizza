import { IProductRepository, ProductFilterOptions } from '@domain/repositories/IProductRepository';
import { Product } from '@domain/entities/Product';

export class ListProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(options: ProductFilterOptions): Promise<{ rows: Product[]; count: number }> {
    return this.productRepository.findAll(options);
  }
}
