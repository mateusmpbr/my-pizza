import { Customer, CreateCustomerDTO, UpdateCustomerDTO } from '@domain/entities/Customer';
import { PaginationOptions } from '@shared/utils/pagination';

export interface ICustomerRepository {
  findAll(options: PaginationOptions): Promise<{ rows: Customer[]; count: number }>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  create(dto: CreateCustomerDTO): Promise<Customer>;
  update(id: string, dto: UpdateCustomerDTO): Promise<Customer>;
}
