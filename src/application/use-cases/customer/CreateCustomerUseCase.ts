import { ICustomerRepository } from '@domain/repositories/ICustomerRepository';
import { Customer, CreateCustomerDTO } from '@domain/entities/Customer';
import { ConflictError } from '@shared/errors';

export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(dto: CreateCustomerDTO): Promise<Customer> {
    const existing = await this.customerRepository.findByEmail(dto.email);
    if (existing) throw new ConflictError(`E-mail '${dto.email}' já está em uso`);
    return this.customerRepository.create(dto);
  }
}
