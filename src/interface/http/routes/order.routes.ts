import { Router } from 'express';
import { OrderController } from '@interface/http/controllers/OrderController';
import { validate } from '@interface/http/middlewares/validate.middleware';
import {
  validateCreateOrder,
  validateUpdateOrderStatus,
} from '@interface/http/validators/order.validator';
import { SequelizeOrderRepository } from '@infrastructure/repositories/SequelizeOrderRepository';
import { SequelizeCustomerRepository } from '@infrastructure/repositories/SequelizeCustomerRepository';
import { SequelizeProductRepository } from '@infrastructure/repositories/SequelizeProductRepository';
import { ListOrdersUseCase } from '@application/use-cases/order/ListOrdersUseCase';
import { GetOrderByIdUseCase } from '@application/use-cases/order/GetOrderByIdUseCase';
import { CreateOrderUseCase } from '@application/use-cases/order/CreateOrderUseCase';
import { UpdateOrderStatusUseCase } from '@application/use-cases/order/UpdateOrderStatusUseCase';
import { DeleteOrderUseCase } from '@application/use-cases/order/DeleteOrderUseCase';

const orderRepo = new SequelizeOrderRepository();
const customerRepo = new SequelizeCustomerRepository();
const productRepo = new SequelizeProductRepository();

const controller = new OrderController(
  new ListOrdersUseCase(orderRepo),
  new GetOrderByIdUseCase(orderRepo),
  new CreateOrderUseCase(orderRepo, customerRepo, productRepo),
  new UpdateOrderStatusUseCase(orderRepo),
  new DeleteOrderUseCase(orderRepo),
);

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gerenciamento de pedidos
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Orders]
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, preparing, out_for_delivery, delivered, cancelled]
 *         description: Filtrar por status
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         description: Filtrar por cliente
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 */
router.get('/', controller.list);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Detalha um pedido
 *     tags: [Orders]
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrder'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       404:
 *         description: Cliente, produto ou tamanho não encontrado
 *       422:
 *         description: Dados inválidos
 */
router.post('/', validate(validateCreateOrder), controller.create);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um pedido
 *     tags: [Orders]
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatus'
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       422:
 *         description: Transição de status inválida
 */
router.patch('/:id/status', validate(validateUpdateOrderStatus), controller.updateStatus);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Cancela/remove um pedido
 *     tags: [Orders]
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     responses:
 *       200:
 *         description: Pedido removido com sucesso
 *       404:
 *         description: Pedido não encontrado
 *       422:
 *         description: Pedido não pode ser removido no status atual
 */
router.delete('/:id', controller.delete);

export default router;
