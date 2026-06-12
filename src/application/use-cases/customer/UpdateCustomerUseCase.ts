import { ICustomerRepository } from '@domain/repositories/ICustomerRepository';
import { Customer, UpdateCustomerDTO } from '@domain/entities/Customer';
import { NotFoundError, ConflictError } from '@shared/errors';

export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: string, dto: UpdateCustomerDTO): Promise<Customer> {
    const existing = await this.customerRepository.findById(id);
    if (!existing) throw new NotFoundError(`Cliente com id '${id}' não encontrado`);

    if (dto.email && dto.email !== existing.email) {
      const taken = await this.customerRepository.findByEmail(dto.email);
      if (taken) throw new ConflictError(`E-mail '${dto.email}' já está em uso`);
    }

    return this.customerRepository.update(id, dto);
  }
}
