import { ICustomerRepository } from '@domain/repositories/ICustomerRepository';
import { Customer } from '@domain/entities/Customer';
import { PaginationOptions } from '@shared/utils/pagination';

export class ListCustomersUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(options: PaginationOptions): Promise<{ rows: Customer[]; count: number }> {
    return this.customerRepository.findAll(options);
  }
}
