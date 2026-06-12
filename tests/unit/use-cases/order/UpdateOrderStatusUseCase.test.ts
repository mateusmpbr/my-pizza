import { UpdateOrderStatusUseCase } from '@application/use-cases/order/UpdateOrderStatusUseCase';
import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { Order } from '@domain/entities/Order';
import { NotFoundError, ValidationError } from '@shared/errors';

const makeRepo = (): jest.Mocked<IOrderRepository> => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateStatus: jest.fn(),
  delete: jest.fn(),
});

const makeOrder = (status: Order['status']): Order => ({
  id: 'order-1',
  customerId: 'cust-1',
  status,
  totalPrice: 43,
  notes: null,
  items: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('UpdateOrderStatusUseCase', () => {
  let repo: jest.Mocked<IOrderRepository>;
  let useCase: UpdateOrderStatusUseCase;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new UpdateOrderStatusUseCase(repo);
  });

  it('throws NotFoundError when order does not exist', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(useCase.execute('bad-id', 'confirmed')).rejects.toThrow(NotFoundError);
  });

  it.each([
    ['pending', 'confirmed'],
    ['pending', 'cancelled'],
    ['confirmed', 'preparing'],
    ['confirmed', 'cancelled'],
    ['preparing', 'out_for_delivery'],
    ['preparing', 'cancelled'],
    ['out_for_delivery', 'delivered'],
    ['out_for_delivery', 'cancelled'],
  ] as Array<[Order['status'], Order['status']]>)('allows transition %s → %s', async (from, to) => {
    repo.findById.mockResolvedValue(makeOrder(from));
    repo.updateStatus.mockResolvedValue(makeOrder(to));

    const result = await useCase.execute('order-1', to);
    expect(result.status).toBe(to);
  });

  it.each([
    ['pending', 'preparing'],
    ['pending', 'out_for_delivery'],
    ['pending', 'delivered'],
    ['delivered', 'confirmed'],
    ['cancelled', 'pending'],
  ] as Array<[Order['status'], Order['status']]>)(
    'throws ValidationError for illegal transition %s → %s',
    async (from, to) => {
      repo.findById.mockResolvedValue(makeOrder(from));
      await expect(useCase.execute('order-1', to)).rejects.toThrow(ValidationError);
    },
  );
});
