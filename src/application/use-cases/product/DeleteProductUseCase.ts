import { IProductRepository } from '@domain/repositories/IProductRepository';
import { NotFoundError } from '@shared/errors';

export class DeleteProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.productRepository.findById(id);
    if (!existing) throw new NotFoundError(`Produto com id '${id}' não encontrado`);
    return this.productRepository.delete(id);
  }
}
