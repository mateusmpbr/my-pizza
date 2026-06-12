import 'dotenv/config';

process.env['NODE_ENV'] = 'test';
process.env['PORT'] = process.env['PORT'] ?? '3001';
process.env['DB_HOST'] = process.env['DB_HOST'] ?? '127.0.0.1';
process.env['DB_PORT'] = process.env['DB_PORT'] ?? '3306';
process.env['DB_NAME'] = process.env['DB_NAME'] ?? 'mypizza_dev';
process.env['DB_USER'] = process.env['DB_USER'] ?? 'root';
process.env['DB_PASSWORD'] = process.env['DB_PASSWORD'] ?? 'secret';
process.env['TEST_DB_NAME'] = process.env['TEST_DB_NAME'] ?? 'mypizza_dev';
