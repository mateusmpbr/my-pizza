import { IProductRepository } from '@domain/repositories/IProductRepository';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { Product, CreateProductDTO } from '@domain/entities/Product';
import { NotFoundError } from '@shared/errors';

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(dto: CreateProductDTO): Promise<Product> {
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) throw new NotFoundError(`Categoria com id '${dto.categoryId}' não encontrada`);
    return this.productRepository.create(dto);
  }
}
