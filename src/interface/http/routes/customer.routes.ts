import { Router } from 'express';
import { CustomerController } from '@interface/http/controllers/CustomerController';
import { validate } from '@interface/http/middlewares/validate.middleware';
import {
  validateCreateCustomer,
  validateUpdateCustomer,
} from '@interface/http/validators/customer.validator';
import { SequelizeCustomerRepository } from '@infrastructure/repositories/SequelizeCustomerRepository';
import { ListCustomersUseCase } from '@application/use-cases/customer/ListCustomersUseCase';
import { GetCustomerByIdUseCase } from '@application/use-cases/customer/GetCustomerByIdUseCase';
import { CreateCustomerUseCase } from '@application/use-cases/customer/CreateCustomerUseCase';
import { UpdateCustomerUseCase } from '@application/use-cases/customer/UpdateCustomerUseCase';

const repo = new SequelizeCustomerRepository();
const controller = new CustomerController(
  new ListCustomersUseCase(repo),
  new GetCustomerByIdUseCase(repo),
  new CreateCustomerUseCase(repo),
  new UpdateCustomerUseCase(repo),
);

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Gerenciamento de clientes
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Customers]
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
 */
router.get('/', controller.list);

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Detalha um cliente
 *     tags: [Customers]
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCustomer'
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *       409:
 *         description: E-mail já em uso
 *       422:
 *         description: Dados inválidos
 */
router.post('/', validate(validateCreateCustomer), controller.create);

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Atualiza um cliente
 *     tags: [Customers]
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCustomer'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.put('/:id', validate(validateUpdateCustomer), controller.update);

export default router;
