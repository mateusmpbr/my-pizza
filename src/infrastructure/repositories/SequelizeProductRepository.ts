import { IProductRepository, ProductFilterOptions } from '@domain/repositories/IProductRepository';
import { Product, CreateProductDTO, UpdateProductDTO } from '@domain/entities/Product';
import { ProductSize } from '@domain/entities/ProductSize';
import { ProductModel } from '@infrastructure/database/models/ProductModel';
import { ProductSizeModel } from '@infrastructure/database/models/ProductSizeModel';

export class SequelizeProductRepository implements IProductRepository {
  async findAll(options: ProductFilterOptions): Promise<{ rows: Product[]; count: number }> {
    const where: Record<string, unknown> = {};
    if (options.categoryId !== undefined) where['categoryId'] = options.categoryId;
    if (options.isAvailable !== undefined) where['isAvailable'] = options.isAvailable;

    const result = await ProductModel.findAndCountAll({
      where: Object.keys(where).length > 0 ? where : undefined,
      offset: options.offset,
      limit: options.limit,
      include: [{ model: ProductSizeModel, as: 'sizes' }],
      order: [['name', 'ASC']],
      distinct: true,
    });

    return { rows: result.rows.map(this.toDomain), count: result.count };
  }

  async findById(id: string): Promise<Product | null> {
    const model = await ProductModel.findByPk(id, {
      include: [{ model: ProductSizeModel, as: 'sizes' }],
    });
    return model ? this.toDomain(model) : null;
  }

  async create(dto: CreateProductDTO): Promise<Product> {
    const model = await ProductModel.create({
      categoryId: dto.categoryId,
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      imageUrl: dto.imageUrl ?? null,
      isAvailable: dto.isAvailable ?? true,
    } as Partial<ProductModel>);
    return this.toDomain(model);
  }

  async update(id: string, dto: UpdateProductDTO): Promise<Product> {
    const model = await ProductModel.findByPk(id, {
      include: [{ model: ProductSizeModel, as: 'sizes' }],
    });
    if (!model) throw new Error(`Product ${id} not found`);
    await model.update(dto);
    return this.toDomain(model);
  }

  async delete(id: string): Promise<void> {
    await ProductModel.destroy({ where: { id } });
  }

  private toDomain(model: ProductModel): Product {
    const sizes: ProductSize[] = model.sizes
      ? model.sizes.map((s: ProductSizeModel) => ({
          id: s.id,
          productId: s.productId,
          size: s.size,
          additionalPrice: parseFloat(String(s.getDataValue('additionalPrice'))),
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        }))
      : [];

    return {
      id: model.id,
      categoryId: model.categoryId,
      name: model.name,
      description: model.description,
      price: parseFloat(String(model.getDataValue('price'))),
      imageUrl: model.imageUrl,
      isAvailable: model.isAvailable,
      sizes,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
