import { UpdateCustomerUseCase } from '@application/use-cases/customer/UpdateCustomerUseCase';
import { ICustomerRepository } from '@domain/repositories/ICustomerRepository';
import { Customer } from '@domain/entities/Customer';
import { NotFoundError, ConflictError } from '@shared/errors';

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

describe('UpdateCustomerUseCase', () => {
  let repo: jest.Mocked<ICustomerRepository>;
  let useCase: UpdateCustomerUseCase;

  beforeEach(() => {
    repo = makeRepo();
    useCase = new UpdateCustomerUseCase(repo);
  });

  it('throws NotFoundError when customer does not exist', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(useCase.execute('bad-id', { name: 'Nova' })).rejects.toThrow(NotFoundError);
  });

  it('throws ConflictError when new email already taken', async () => {
    repo.findById.mockResolvedValue(mockCustomer);
    repo.findByEmail.mockResolvedValue({ ...mockCustomer, id: '2' });
    await expect(useCase.execute('1', { email: 'outro@test.com' })).rejects.toThrow(ConflictError);
  });

  it('updates without email check when email unchanged', async () => {
    const updated = { ...mockCustomer, name: 'Ana Updated' };
    repo.findById.mockResolvedValue(mockCustomer);
    repo.update.mockResolvedValue(updated);

    const result = await useCase.execute('1', { name: 'Ana Updated' });
    expect(repo.findByEmail).not.toHaveBeenCalled();
    expect(result.name).toBe('Ana Updated');
  });
});
