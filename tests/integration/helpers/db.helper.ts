import 'reflect-metadata';
import { sequelize } from '../../../src/infrastructure/database/connection';

export async function connectTestDb(): Promise<void> {
  await sequelize.authenticate();
}

export async function runMigrations(): Promise<void> {
  await sequelize.sync({ force: true });
}

export async function truncateTables(tables: string[]): Promise<void> {
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  for (const table of tables) {
    await sequelize.query(`TRUNCATE TABLE \`${table}\``);
  }
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
}

export async function closeTestDb(): Promise<void> {
  await sequelize.close();
}
