import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import { config } from '@infrastructure/config/env';
import {
  CustomerModel,
  CategoryModel,
  ProductModel,
  ProductSizeModel,
  OrderModel,
  OrderItemModel,
} from './models';

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  username: config.db.user,
  password: config.db.password,
  models: [
    CustomerModel,
    CategoryModel,
    ProductModel,
    ProductSizeModel,
    OrderModel,
    OrderItemModel,
  ],
  logging: config.nodeEnv === 'development' ? console.log : false,
  pool: {
    max: config.db.poolMax,
    min: config.db.poolMin,
    acquire: 30000,
    idle: 10000,
  },
  timezone: '+00:00',
  define: { underscored: true, timestamps: true },
});

export async function connectDatabase(): Promise<void> {
  await sequelize.authenticate();
  console.log('Banco de dados conectado com sucesso.');
}
