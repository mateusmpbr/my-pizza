import { Router, Request, Response } from 'express';
import customerRouter from './customer.routes';
import productRouter from './product.routes';
import orderRouter from './order.routes';
import { sequelize } from '@infrastructure/database/connection';
import { successResponse, errorResponse } from '@shared/utils/response';

const router = Router();

router.get('/health', async (_req: Request, res: Response) => {
  try {
    await sequelize.authenticate();
    res.json(successResponse({ status: 'ok', db: 'connected' }, 'OK'));
  } catch {
    res.status(503).json(errorResponse('Serviço indisponível', { db: 'disconnected' }));
  }
});

router.use('/customers', customerRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);

export { router as apiRouter };
