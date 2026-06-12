import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import 'dotenv/config';

const schema = {
  type: 'object',
  required: ['PORT', 'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'],
  properties: {
    PORT: { type: 'string', pattern: '^\\d+$' },
    DB_HOST: { type: 'string', minLength: 1 },
    DB_PORT: { type: 'string', pattern: '^\\d+$' },
    DB_NAME: { type: 'string', minLength: 1 },
    DB_USER: { type: 'string', minLength: 1 },
    DB_PASSWORD: { type: 'string' },
    TEST_DB_NAME: { type: 'string' },
    NODE_ENV: { type: 'string', enum: ['development', 'test', 'production'] },
    DB_POOL_MAX: { type: 'string', pattern: '^\\d+$' },
    DB_POOL_MIN: { type: 'string', pattern: '^\\d+$' },
  },
  additionalProperties: true,
};

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);

if (!validate(process.env)) {
  console.error('Variáveis de ambiente inválidas:', validate.errors);
  process.exit(1);
}

const isTest = process.env['NODE_ENV'] === 'test';

export const config = {
  port: parseInt(process.env['PORT']!, 10),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  db: {
    host: process.env['DB_HOST']!,
    port: parseInt(process.env['DB_PORT']!, 10),
    name:
      isTest && process.env['TEST_DB_NAME']
        ? process.env['TEST_DB_NAME']!
        : process.env['DB_NAME']!,
    user: process.env['DB_USER']!,
    password: process.env['DB_PASSWORD']!,
    poolMax: parseInt(process.env['DB_POOL_MAX'] ?? '10', 10),
    poolMin: parseInt(process.env['DB_POOL_MIN'] ?? '2', 10),
  },
};
