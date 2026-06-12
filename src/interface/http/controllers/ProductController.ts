import { Request, Response, NextFunction } from 'express';
import { ListProductsUseCase } from '@application/use-cases/product/ListProductsUseCase';
import { GetProductByIdUseCase } from '@application/use-cases/product/GetProductByIdUseCase';
import { CreateProductUseCase } from '@application/use-cases/product/CreateProductUseCase';
import { UpdateProductUseCase } from '@application/use-cases/product/UpdateProductUseCase';
import { DeleteProductUseCase } from '@application/use-cases/product/DeleteProductUseCase';
import { CreateProductDTO, UpdateProductDTO } from '@domain/entities/Product';
import { successResponse } from '@shared/utils/response';
import { parsePagination, buildMeta } from '@shared/utils/pagination';

export class ProductController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, offset } = parsePagination(req.query);
      const categoryId = req.query['categoryId'] as string | undefined;
      const isAvailableRaw = req.query['isAvailable'];
      const isAvailable =
        isAvailableRaw === 'true' ? true : isAvailableRaw === 'false' ? false : undefined;

      const { rows, count } = await this.listProductsUseCase.execute({
        offset,
        limit,
        categoryId,
        isAvailable,
      });
      res.json(
        successResponse(rows, 'Produtos listados com sucesso', buildMeta(count, page, limit)),
      );
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.getProductByIdUseCase.execute(req.params['id']!);
      res.json(successResponse(product, 'Produto encontrado'));
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.createProductUseCase.execute(req.body as CreateProductDTO);
      res.status(201).json(successResponse(product, 'Produto criado com sucesso'));
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.updateProductUseCase.execute(
        req.params['id']!,
        req.body as UpdateProductDTO,
      );
      res.json(successResponse(product, 'Produto atualizado com sucesso'));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteProductUseCase.execute(req.params['id']!);
      res.json(successResponse(null, 'Produto removido com sucesso'));
    } catch (err) {
      next(err);
    }
  };
}
