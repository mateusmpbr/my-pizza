import { CreateOrderUseCase } from '@application/use-cases/order/CreateOrderUseCase';
import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { ICustomerRepository } from '@domain/repositories/ICustomerRepository';
import { IProductRepository } from '@domain/repositories/IProductRepository';
import { Order } from '@domain/entities/Order';
import { Customer } from '@domain/entities/Customer';
import { Product } from '@domain/entities/Product';
import { NotFoundError, ValidationError } from '@shared/errors';

const makeOrderRepo = (): jest.Mocked<IOrderRepository> => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateStatus: jest.fn(),
  delete: jest.fn(),
});

const makeCustomerRepo = (): jest.Mocked<ICustomerRepository> => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});

const makeProductRepo = (): jest.Mocked<IProductRepository> => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockCustomer: Customer = {
  id: 'cust-1',
  name: 'João',
  email: 'joao@test.com',
  phone: null,
  address: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProduct: Product = {
  id: 'prod-1',
  categoryId: 'cat-1',
  name: 'Margherita',
  description: null,
  price: 35,
  imageUrl: null,
  isAvailable: true,
  sizes: [
    {
      id: 'size-1',
      productId: 'prod-1',
      size: 'M',
      additionalPrice: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockOrder: Order = {
  id: 'order-1',
  customerId: 'cust-1',
  status: 'pending',
  totalPrice: 43,
  notes: null,
  items: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CreateOrderUseCase', () => {
  let orderRepo: jest.Mocked<IOrderRepository>;
  let customerRepo: jest.Mocked<ICustomerRepository>;
  let productRepo: jest.Mocked<IProductRepository>;
  let useCase: CreateOrderUseCase;

  beforeEach(() => {
    orderRepo = makeOrderRepo();
    customerRepo = makeCustomerRepo();
    productRepo = makeProductRepo();
    useCase = new CreateOrderUseCase(orderRepo, customerRepo, productRepo);
  });

  it('calculates unit price as product.price + size.additionalPrice', async () => {
    customerRepo.findById.mockResolvedValue(mockCustomer);
    productRepo.findById.mockResolvedValue(mockProduct);
    orderRepo.create.mockResolvedValue(mockOrder);

    await useCase.execute({
      customerId: 'cust-1',
      items: [{ productId: 'prod-1', sizeId: 'size-1', quantity: 1 }],
    });

    expect(orderRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        totalPrice: 43, // 35 + 8
        items: [expect.objectContaining({ unitPrice: 43, subtotal: 43, quantity: 1 })],
      }),
    );
  });

  it('multiplies subtotal by quantity', async () => {
    customerRepo.findById.mockResolvedValue(mockCustomer);
    productRepo.findById.mockResolvedValue(mockProduct);
    orderRepo.create.mockResolvedValue(mockOrder);

    await useCase.execute({
      customerId: 'cust-1',
      items: [{ productId: 'prod-1', sizeId: 'size-1', quantity: 3 }],
    });

    expect(orderRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        totalPrice: 129, // 43 * 3
        items: [expect.objectContaining({ subtotal: 129 })],
      }),
    );
  });

  it('throws NotFoundError when customer not found', async () => {
    customerRepo.findById.mockResolvedValue(null);
    await expect(
      useCase.execute({
        customerId: 'bad',
        items: [{ productId: 'p1', sizeId: 's1', quantity: 1 }],
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws ValidationError when items list is empty', async () => {
    customerRepo.findById.mockResolvedValue(mockCustomer);
    await expect(useCase.execute({ customerId: 'cust-1', items: [] })).rejects.toThrow(
      ValidationError,
    );
  });

  it('throws NotFoundError when product not found', async () => {
    customerRepo.findById.mockResolvedValue(mockCustomer);
    productRepo.findById.mockResolvedValue(null);
    await expect(
      useCase.execute({
        customerId: 'cust-1',
        items: [{ productId: 'bad', sizeId: 's1', quantity: 1 }],
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws NotFoundError when size not found for product', async () => {
    customerRepo.findById.mockResolvedValue(mockCustomer);
    productRepo.findById.mockResolvedValue(mockProduct);
    await expect(
      useCase.execute({
        customerId: 'cust-1',
        items: [{ productId: 'prod-1', sizeId: 'bad-size', quantity: 1 }],
      }),
    ).rejects.toThrow(NotFoundError);
  });
});
