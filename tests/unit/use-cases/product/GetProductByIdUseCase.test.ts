import { GetProductByIdUseCase } from '@application/use-cases/product/GetProductByIdUseCase';
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

describe('GetProductByIdUseCase', () => {
  it('returns product when found', async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(mockProduct);
    const useCase = new GetProductByIdUseCase(repo);

    const result = await useCase.execute('p1');
    expect(result).toEqual(mockProduct);
  });

  it('throws NotFoundError when product not found', async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(null);
    const useCase = new GetProductByIdUseCase(repo);

    await expect(useCase.execute('bad-id')).rejects.toThrow(NotFoundError);
  });
});
