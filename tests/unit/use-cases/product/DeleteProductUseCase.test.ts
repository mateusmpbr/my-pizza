import { DeleteProductUseCase } from '@application/use-cases/product/DeleteProductUseCase';
import { IProductRepository } from '@domain/repositories/IProductRepository';
import { Product } from '@domain/entities/Product';
import { NotFoundError } from '@shared/errors';

const makeRepo = (): jest.Mocked<IProductRepository> => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockProduct: Product = {
  id: 'p1',
  categoryId: 'c1',
  name: 'Margherita',
  description: null,
  price: 35,
  imageUrl: null,
  isAvailable: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('DeleteProductUseCase', () => {
  it('deletes product when it exists', async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(mockProduct);
    repo.delete.mockResolvedValue();

    const useCase = new DeleteProductUseCase(repo);
    await useCase.execute('p1');

    expect(repo.delete).toHaveBeenCalledWith('p1');
  });

  it('throws NotFoundError when product does not exist', async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(null);

    const useCase = new DeleteProductUseCase(repo);
    await expect(useCase.execute('bad-id')).rejects.toThrow(NotFoundError);
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
