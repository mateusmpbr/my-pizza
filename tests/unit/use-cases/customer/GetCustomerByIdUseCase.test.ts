import { GetCustomerByIdUseCase } from '@application/use-cases/customer/GetCustomerByIdUseCase';
import { ICustomerRepository } from '@domain/repositories/ICustomerRepository';
import { Customer } from '@domain/entities/Customer';
import { NotFoundError } from '@shared/errors';

const makeRepo = (): jest.Mocked<ICustomerRepository> => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});

describe('GetCustomerByIdUseCase', () => {
  let repo: jest.Mocked<ICustomerRepository>;
  let useCase: GetCustomerByIdUseCase;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new GetCustomerByIdUseCase(repo);
  });

  it('returns customer when found', async () => {
    const customer: Customer = {
      id: '1',
      name: 'Ana',
      email: 'ana@test.com',
      phone: null,
      address: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    repo.findById.mockResolvedValue(customer);

    const result = await useCase.execute('1');
    expect(result).toEqual(customer);
  });

  it('throws NotFoundError when customer not found', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(useCase.execute('unknown-id')).rejects.toThrow(NotFoundError);
  });
});
