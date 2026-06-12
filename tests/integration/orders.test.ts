import request from 'supertest';
import { connectTestDb, runMigrations, truncateTables, closeTestDb } from './helpers/db.helper';
import { getTestApp } from './helpers/app.helper';
import { CustomerModel } from '../../src/infrastructure/database/models/CustomerModel';
import { CategoryModel } from '../../src/infrastructure/database/models/CategoryModel';
import { ProductModel } from '../../src/infrastructure/database/models/ProductModel';
import { ProductSizeModel } from '../../src/infrastructure/database/models/ProductSizeModel';

const app = getTestApp();
let customerId: string;
let productId: string;
let sizeId: string;

beforeAll(async () => {
  await connectTestDb();
  await runMigrations();

  const customer = await CustomerModel.create({
    name: 'Test Customer',
    email: 'test@orders.com',
    phone: null,
    address: null,
  } as Partial<CustomerModel>);
  customerId = customer.id;

  const category = await CategoryModel.create({
    name: 'Tradicionais',
    description: null,
  } as Partial<CategoryModel>);

  const product = await ProductModel.create({
    categoryId: category.id,
    name: 'Margherita',
    description: null,
    price: 35,
    imageUrl: null,
    isAvailable: true,
  } as Partial<ProductModel>);
  productId = product.id;

  const size = await ProductSizeModel.create({
    productId: product.id,
    size: 'M',
    additionalPrice: 8,
  } as Partial<ProductSizeModel>);
  sizeId = size.id;
});

afterAll(async () => {
  await closeTestDb();
});

afterEach(async () => {
  await truncateTables(['order_items', 'orders']);
});

describe('POST /api/v1/orders', () => {
  it('creates an order and returns 201', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        customerId,
        items: [{ productId, sizeId, quantity: 2 }],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('pending');
    expect(res.body.data.totalPrice).toBe(86); // (35 + 8) * 2
  });

  it('returns 404 when customer does not exist', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        customerId: 'bad-customer-id',
        items: [{ productId, sizeId, quantity: 1 }],
      });

    expect(res.status).toBe(404);
  });

  it('returns 422 when items list is empty', async () => {
    const res = await request(app).post('/api/v1/orders').send({
      customerId,
      items: [],
    });

    expect(res.status).toBe(422);
  });
});

describe('PATCH /api/v1/orders/:id/status', () => {
  it('updates status from pending to confirmed', async () => {
    const create = await request(app)
      .post('/api/v1/orders')
      .send({
        customerId,
        items: [{ productId, sizeId, quantity: 1 }],
      });

    const res = await request(app)
      .patch(`/api/v1/orders/${create.body.data.id}/status`)
      .send({ status: 'confirmed' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('confirmed');
  });

  it('returns 422 for illegal status transition', async () => {
    const create = await request(app)
      .post('/api/v1/orders')
      .send({
        customerId,
        items: [{ productId, sizeId, quantity: 1 }],
      });

    const res = await request(app)
      .patch(`/api/v1/orders/${create.body.data.id}/status`)
      .send({ status: 'delivered' });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/v1/orders', () => {
  it('returns paginated orders', async () => {
    await request(app)
      .post('/api/v1/orders')
      .send({ customerId, items: [{ productId, sizeId, quantity: 1 }] });

    const res = await request(app).get('/api/v1/orders');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe('DELETE /api/v1/orders/:id', () => {
  it('deletes a pending order', async () => {
    const create = await request(app)
      .post('/api/v1/orders')
      .send({
        customerId,
        items: [{ productId, sizeId, quantity: 1 }],
      });

    const res = await request(app).delete(`/api/v1/orders/${create.body.data.id}`);
    expect(res.status).toBe(200);
  });

  it('returns 422 when trying to delete a confirmed order', async () => {
    const create = await request(app)
      .post('/api/v1/orders')
      .send({
        customerId,
        items: [{ productId, sizeId, quantity: 1 }],
      });

    await request(app)
      .patch(`/api/v1/orders/${create.body.data.id}/status`)
      .send({ status: 'confirmed' });

    const res = await request(app).delete(`/api/v1/orders/${create.body.data.id}`);
    expect(res.status).toBe(422);
  });
});
