import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { CategoryModel } from './CategoryModel';
import { ProductSizeModel } from './ProductSizeModel';
import { OrderItemModel } from './OrderItemModel';

@Table({ tableName: 'products', underscored: true })
export class ProductModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.CHAR(36))
  declare id: string;

  @ForeignKey(() => CategoryModel)
  @Column({ type: DataType.CHAR(36), allowNull: false })
  declare categoryId: string;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare price: number;

  get priceNum(): number {
    return parseFloat(String(this.getDataValue('price')));
  }

  @Column({ type: DataType.STRING(500), allowNull: true })
  declare imageUrl: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isAvailable: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @BelongsTo(() => CategoryModel)
  declare category: CategoryModel;

  @HasMany(() => ProductSizeModel)
  declare sizes: ProductSizeModel[];

  @HasMany(() => OrderItemModel)
  declare orderItems: OrderItemModel[];
}
