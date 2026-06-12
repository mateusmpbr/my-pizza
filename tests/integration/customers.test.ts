import request from 'supertest';
import { connectTestDb, runMigrations, truncateTables, closeTestDb } from './helpers/db.helper';
import { getTestApp } from './helpers/app.helper';

const app = getTestApp();

beforeAll(async () => {
  await connectTestDb();
  await runMigrations();
});

afterAll(async () => {
  await closeTestDb();
});

afterEach(async () => {
  await truncateTables(['customers']);
});

describe('POST /api/v1/customers', () => {
  it('creates a customer and returns 201', async () => {
    const res = await request(app)
      .post('/api/v1/customers')
      .send({ name: 'João Silva', email: 'joao@test.com' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('joao@test.com');
    expect(res.body.data.id).toBeDefined();
  });

  it('returns 409 when email already exists', async () => {
    await request(app).post('/api/v1/customers').send({ name: 'João', email: 'joao@test.com' });

    const res = await request(app)
      .post('/api/v1/customers')
      .send({ name: 'Outro', email: 'joao@test.com' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('returns 422 when name is missing', async () => {
    const res = await request(app).post('/api/v1/customers').send({ email: 'valid@test.com' });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('returns 422 when email format is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/customers')
      .send({ name: 'Ana', email: 'not-an-email' });

    expect(res.status).toBe(422);
  });
});

describe('GET /api/v1/customers', () => {
  it('returns empty list when no customers', async () => {
    const res = await request(app).get('/api/v1/customers');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
    expect(res.body.meta.total).toBe(0);
  });

  it('returns paginated customers', async () => {
    await request(app).post('/api/v1/customers').send({ name: 'Alice', email: 'a@test.com' });
    await request(app).post('/api/v1/customers').send({ name: 'Bob', email: 'b@test.com' });

    const res = await request(app).get('/api/v1/customers?page=1&limit=1');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta.total).toBe(2);
    expect(res.body.meta.totalPages).toBe(2);
  });
});

describe('GET /api/v1/customers/:id', () => {
  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/v1/customers/unknown-id');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns customer when found', async () => {
    const create = await request(app)
      .post('/api/v1/customers')
      .send({ name: 'Maria', email: 'maria@test.com' });

    const res = await request(app).get(`/api/v1/customers/${create.body.data.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Maria');
  });
});

describe('PUT /api/v1/customers/:id', () => {
  it('updates customer successfully', async () => {
    const create = await request(app)
      .post('/api/v1/customers')
      .send({ name: 'Original', email: 'orig@test.com' });

    const res = await request(app)
      .put(`/api/v1/customers/${create.body.data.id}`)
      .send({ name: 'Atualizado' });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Atualizado');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).put('/api/v1/customers/bad-id').send({ name: 'Test' });
    expect(res.status).toBe(404);
  });
});
