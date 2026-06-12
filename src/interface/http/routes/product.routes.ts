import { Router } from 'express';
import { ProductController } from '@interface/http/controllers/ProductController';
import { validate } from '@interface/http/middlewares/validate.middleware';
import {
  validateCreateProduct,
  validateUpdateProduct,
} from '@interface/http/validators/product.validator';
import { SequelizeProductRepository } from '@infrastructure/repositories/SequelizeProductRepository';
import { SequelizeCategoryRepository } from '@infrastructure/repositories/SequelizeCategoryRepository';
import { ListProductsUseCase } from '@application/use-cases/product/ListProductsUseCase';
import { GetProductByIdUseCase } from '@application/use-cases/product/GetProductByIdUseCase';
import { CreateProductUseCase } from '@application/use-cases/product/CreateProductUseCase';
import { UpdateProductUseCase } from '@application/use-cases/product/UpdateProductUseCase';
import { DeleteProductUseCase } from '@application/use-cases/product/DeleteProductUseCase';

const productRepo = new SequelizeProductRepository();
const categoryRepo = new SequelizeCategoryRepository();

const controller = new ProductController(
  new ListProductsUseCase(productRepo),
  new GetProductByIdUseCase(productRepo),
  new CreateProductUseCase(productRepo, categoryRepo),
  new UpdateProductUseCase(productRepo, categoryRepo),
  new DeleteProductUseCase(productRepo),
);

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gerenciamento de produtos (pizzas e adicionais)
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filtrar por categoria
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Filtrar por disponibilidade
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 */
router.get('/', controller.list);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Detalha um produto
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProduct'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       404:
 *         description: Categoria não encontrada
 *       422:
 *         description: Dados inválidos
 */
router.post('/', validate(validateCreateProduct), controller.create);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProduct'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.put('/:id', validate(validateUpdateProduct), controller.update);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove um produto
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/:id', controller.delete);

export default router;
