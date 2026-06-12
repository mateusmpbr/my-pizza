import { ICustomerRepository } from '@domain/repositories/ICustomerRepository';
import { Customer, CreateCustomerDTO, UpdateCustomerDTO } from '@domain/entities/Customer';
import { PaginationOptions } from '@shared/utils/pagination';
import { CustomerModel } from '@infrastructure/database/models/CustomerModel';

export class SequelizeCustomerRepository implements ICustomerRepository {
  async findAll(options: PaginationOptions): Promise<{ rows: Customer[]; count: number }> {
    const result = await CustomerModel.findAndCountAll({
      offset: options.offset,
      limit: options.limit,
      order: [['created_at', 'DESC']],
    });
    return { rows: result.rows.map(this.toDomain), count: result.count };
  }

  async findById(id: string): Promise<Customer | null> {
    const model = await CustomerModel.findByPk(id);
    return model ? this.toDomain(model) : null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const model = await CustomerModel.findOne({ where: { email } });
    return model ? this.toDomain(model) : null;
  }

  async create(dto: CreateCustomerDTO): Promise<Customer> {
    const model = await CustomerModel.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone ?? null,
      address: dto.address ?? null,
    } as Partial<CustomerModel>);
    return this.toDomain(model);
  }

  async update(id: string, dto: UpdateCustomerDTO): Promise<Customer> {
    const model = await CustomerModel.findByPk(id);
    if (!model) throw new Error(`Customer ${id} not found`);
    await model.update(dto);
    return this.toDomain(model);
  }

  private toDomain(model: CustomerModel): Customer {
    return {
      id: model.id,
      name: model.name,
      email: model.email,
      phone: model.phone,
      address: model.address,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
