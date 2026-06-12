import request from 'supertest';
import { connectTestDb, runMigrations, truncateTables, closeTestDb } from './helpers/db.helper';
import { getTestApp } from './helpers/app.helper';
import { CategoryModel } from '../../src/infrastructure/database/models/CategoryModel';

const app = getTestApp();
let categoryId: string;

beforeAll(async () => {
  await connectTestDb();
  await runMigrations();
  const cat = await CategoryModel.create({
    name: 'Tradicionais',
    description: null,
  } as Partial<CategoryModel>);
  categoryId = cat.id;
});

afterAll(async () => {
  await closeTestDb();
});

afterEach(async () => {
  await truncateTables(['products']);
});

describe('POST /api/v1/products', () => {
  it('creates a product and returns 201', async () => {
    const res = await request(app).post('/api/v1/products').send({
      categoryId,
      name: 'Margherita',
      price: 35,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Margherita');
  });

  it('returns 404 when category does not exist', async () => {
    const res = await request(app).post('/api/v1/products').send({
      categoryId: 'nonexistent-category-id',
      name: 'Test',
      price: 10,
    });

    expect(res.status).toBe(404);
  });

  it('returns 422 when price is missing', async () => {
    const res = await request(app).post('/api/v1/products').send({
      categoryId,
      name: 'Test',
    });

    expect(res.status).toBe(422);
  });
});

describe('GET /api/v1/products', () => {
  it('returns empty list when no products', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('filters by categoryId', async () => {
    await request(app).post('/api/v1/products').send({ categoryId, name: 'Pizza 1', price: 30 });
    const res = await request(app).get(`/api/v1/products?categoryId=${categoryId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe('GET /api/v1/products/:id', () => {
  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/v1/products/unknown');
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/v1/products/:id', () => {
  it('deletes existing product', async () => {
    const create = await request(app)
      .post('/api/v1/products')
      .send({ categoryId, name: 'To Delete', price: 20 });

    const res = await request(app).delete(`/api/v1/products/${create.body.data.id}`);
    expect(res.status).toBe(200);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).delete('/api/v1/products/bad-id');
    expect(res.status).toBe(404);
  });
});
