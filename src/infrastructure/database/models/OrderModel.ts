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
import { CustomerModel } from './CustomerModel';
import { OrderItemModel } from './OrderItemModel';

@Table({ tableName: 'orders', underscored: true })
export class OrderModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.CHAR(36))
  declare id: string;

  @ForeignKey(() => CustomerModel)
  @Column({ type: DataType.CHAR(36), allowNull: false })
  declare customerId: string;

  @Column({
    type: DataType.ENUM(
      'pending',
      'confirmed',
      'preparing',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ),
    allowNull: false,
    defaultValue: 'pending',
  })
  declare status: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare totalPrice: number;

  get totalPriceNum(): number {
    return parseFloat(String(this.getDataValue('totalPrice')));
  }

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes: string | null;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @BelongsTo(() => CustomerModel)
  declare customer: CustomerModel;

  @HasMany(() => OrderItemModel)
  declare items: OrderItemModel[];
}
