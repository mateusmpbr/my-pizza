import { CreateCustomerUseCase } from '@application/use-cases/customer/CreateCustomerUseCase';
import { ICustomerRepository } from '@domain/repositories/ICustomerRepository';
import { Customer } from '@domain/entities/Customer';
import { ConflictError } from '@shared/errors';

const makeRepo = (): jest.Mocked<ICustomerRepository> => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});

const mockCustomer: Customer = {
  id: '1',
  name: 'Ana',
  email: 'ana@test.com',
  phone: null,
  address: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CreateCustomerUseCase', () => {
  let repo: jest.Mocked<ICustomerRepository>;
  let useCase: CreateCustomerUseCase;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new CreateCustomerUseCase(repo);
  });

  it('creates a customer when email is unique', async () => {
    repo.findByEmail.mockResolvedValue(null);
    repo.create.mockResolvedValue(mockCustomer);

    const result = await useCase.execute({ name: 'Ana', email: 'ana@test.com' });

    expect(repo.findByEmail).toHaveBeenCalledWith('ana@test.com');
    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockCustomer);
  });

  it('throws ConflictError when email already exists', async () => {
    repo.findByEmail.mockResolvedValue(mockCustomer);

    await expect(useCase.execute({ name: 'Ana', email: 'ana@test.com' })).rejects.toThrow(
      ConflictError,
    );
    expect(repo.create).not.toHaveBeenCalled();
  });
});
