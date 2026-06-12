import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { Category } from '@domain/entities/Category';
import { PaginationOptions } from '@shared/utils/pagination';
import { CategoryModel } from '@infrastructure/database/models/CategoryModel';

export class SequelizeCategoryRepository implements ICategoryRepository {
  async findAll(_options?: PaginationOptions): Promise<Category[]> {
    const models = await CategoryModel.findAll({ order: [['name', 'ASC']] });
    return models.map(this.toDomain);
  }

  async findById(id: string): Promise<Category | null> {
    const model = await CategoryModel.findByPk(id);
    return model ? this.toDomain(model) : null;
  }

  private toDomain(model: CategoryModel): Category {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
