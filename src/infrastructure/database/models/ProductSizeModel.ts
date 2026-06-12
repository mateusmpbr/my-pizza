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
import { ProductModel } from './ProductModel';
import { OrderItemModel } from './OrderItemModel';

@Table({ tableName: 'product_sizes', underscored: true })
export class ProductSizeModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.CHAR(36))
  declare id: string;

  @ForeignKey(() => ProductModel)
  @Column({ type: DataType.CHAR(36), allowNull: false })
  declare productId: string;

  @Column({ type: DataType.ENUM('P', 'M', 'G', 'GG'), allowNull: false })
  declare size: 'P' | 'M' | 'G' | 'GG';

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, defaultValue: 0 })
  declare additionalPrice: number;

  get additionalPriceNum(): number {
    return parseFloat(String(this.getDataValue('additionalPrice')));
  }

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @BelongsTo(() => ProductModel)
  declare product: ProductModel;

  @HasMany(() => OrderItemModel)
  declare orderItems: OrderItemModel[];
}
