import { ICustomerRepository } from '@domain/repositories/ICustomerRepository';
import { Customer } from '@domain/entities/Customer';
import { NotFoundError } from '@shared/errors';

export class GetCustomerByIdUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) throw new NotFoundError(`Cliente com id '${id}' não encontrado`);
    return customer;
  }
}
