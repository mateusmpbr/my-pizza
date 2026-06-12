import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { OrderModel } from './OrderModel';
import { ProductModel } from './ProductModel';
import { ProductSizeModel } from './ProductSizeModel';

@Table({ tableName: 'order_items', underscored: true })
export class OrderItemModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.CHAR(36))
  declare id: string;

  @ForeignKey(() => OrderModel)
  @Column({ type: DataType.CHAR(36), allowNull: false })
  declare orderId: string;

  @ForeignKey(() => ProductModel)
  @Column({ type: DataType.CHAR(36), allowNull: false })
  declare productId: string;

  @ForeignKey(() => ProductSizeModel)
  @Column({ type: DataType.CHAR(36), allowNull: false })
  declare sizeId: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare quantity: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare unitPrice: number;

  get unitPriceNum(): number {
    return parseFloat(String(this.getDataValue('unitPrice')));
  }

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare subtotal: number;

  get subtotalNum(): number {
    return parseFloat(String(this.getDataValue('subtotal')));
  }

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @BelongsTo(() => OrderModel)
  declare order: OrderModel;

  @BelongsTo(() => ProductModel)
  declare product: ProductModel;

  @BelongsTo(() => ProductSizeModel)
  declare size: ProductSizeModel;
}
