import 'reflect-metadata';
import { config } from '@infrastructure/config/env';
import { connectDatabase } from '@infrastructure/database/connection';
import { createApp } from './app';

async function bootstrap(): Promise<void> {
  await connectDatabase();
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`Servidor iniciado na porta ${config.port} em modo ${config.nodeEnv}`);
    console.log(`Documentação disponível em http://localhost:${config.port}/api/v1/docs`);
  });
}

bootstrap().catch((err: unknown) => {
  console.error('Erro fatal na inicialização:', err);
  process.exit(1);
});
