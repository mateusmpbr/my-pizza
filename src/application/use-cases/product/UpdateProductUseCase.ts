import { IProductRepository } from '@domain/repositories/IProductRepository';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { Product, UpdateProductDTO } from '@domain/entities/Product';
import { NotFoundError } from '@shared/errors';

export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(id: string, dto: UpdateProductDTO): Promise<Product> {
    const existing = await this.productRepository.findById(id);
    if (!existing) throw new NotFoundError(`Produto com id '${id}' não encontrado`);

    if (dto.categoryId) {
      const category = await this.categoryRepository.findById(dto.categoryId);
      if (!category) throw new NotFoundError(`Categoria com id '${dto.categoryId}' não encontrada`);
    }

    return this.productRepository.update(id, dto);
  }
}
