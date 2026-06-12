import { CreateProductUseCase } from '@application/use-cases/product/CreateProductUseCase';
import { IProductRepository } from '@domain/repositories/IProductRepository';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { Product } from '@domain/entities/Product';
import { Category } from '@domain/entities/Category';
import { NotFoundError } from '@shared/errors';

const makeProductRepo = (): jest.Mocked<IProductRepository> => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const makeCategoryRepo = (): jest.Mocked<ICategoryRepository> => ({
  findAll: jest.fn(),
  findById: jest.fn(),
});

const mockCategory: Category = {
  id: 'c1',
  name: 'Tradicionais',
  description: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

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

describe('CreateProductUseCase', () => {
  it('creates product when category exists', async () => {
    const productRepo = makeProductRepo();
    const categoryRepo = makeCategoryRepo();
    categoryRepo.findById.mockResolvedValue(mockCategory);
    productRepo.create.mockResolvedValue(mockProduct);

    const useCase = new CreateProductUseCase(productRepo, categoryRepo);
    const result = await useCase.execute({ categoryId: 'c1', name: 'Margherita', price: 35 });

    expect(categoryRepo.findById).toHaveBeenCalledWith('c1');
    expect(result).toEqual(mockProduct);
  });

  it('throws NotFoundError when category does not exist', async () => {
    const productRepo = makeProductRepo();
    const categoryRepo = makeCategoryRepo();
    categoryRepo.findById.mockResolvedValue(null);

    const useCase = new CreateProductUseCase(productRepo, categoryRepo);
    await expect(
      useCase.execute({ categoryId: 'bad-cat', name: 'Test', price: 10 }),
    ).rejects.toThrow(NotFoundError);
    expect(productRepo.create).not.toHaveBeenCalled();
  });
});
