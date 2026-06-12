import { ListCustomersUseCase } from '@application/use-cases/customer/ListCustomersUseCase';
import { ICustomerRepository } from '@domain/repositories/ICustomerRepository';

const makeRepo = (): jest.Mocked<ICustomerRepository> => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});

describe('ListCustomersUseCase', () => {
  it('delegates to repository with pagination options', async () => {
    const repo = makeRepo();
    repo.findAll.mockResolvedValue({ rows: [], count: 0 });

    const useCase = new ListCustomersUseCase(repo);
    const result = await useCase.execute({ offset: 0, limit: 10 });

    expect(repo.findAll).toHaveBeenCalledWith({ offset: 0, limit: 10 });
    expect(result).toEqual({ rows: [], count: 0 });
  });
});
