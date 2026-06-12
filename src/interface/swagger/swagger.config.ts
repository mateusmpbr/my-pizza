import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Pizza API',
      version: '1.0.0',
      description: 'API RESTful para sistema de vendas de pizzaria',
    },
    servers: [{ url: '/api/v1', description: 'API v1' }],
    components: {
      parameters: {
        id: {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string' },
          description: 'ID do recurso',
        },
        page: {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', default: 1 },
          description: 'Número da página',
        },
        limit: {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', default: 20 },
          description: 'Itens por página (máx. 100)',
        },
      },
      schemas: {
        CreateCustomer: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string', example: 'Maria Silva' },
            email: { type: 'string', format: 'email', example: 'maria@exemplo.com' },
            phone: { type: 'string', example: '11999999999' },
            address: { type: 'string', example: 'Rua das Flores, 123' },
          },
        },
        UpdateCustomer: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            address: { type: 'string' },
          },
        },
        CreateProduct: {
          type: 'object',
          required: ['categoryId', 'name', 'price'],
          properties: {
            categoryId: { type: 'string', example: 'cat-tradicional-0000-0000-000000000001' },
            name: { type: 'string', example: 'Margherita' },
            description: { type: 'string', example: 'Molho de tomate, mussarela e manjericão' },
            price: { type: 'number', example: 35.0 },
            imageUrl: { type: 'string', example: 'https://exemplo.com/pizza.jpg' },
            isAvailable: { type: 'boolean', example: true },
          },
        },
        UpdateProduct: {
          type: 'object',
          properties: {
            categoryId: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            imageUrl: { type: 'string' },
            isAvailable: { type: 'boolean' },
          },
        },
        CreateOrder: {
          type: 'object',
          required: ['customerId', 'items'],
          properties: {
            customerId: { type: 'string', example: 'uuid-do-cliente' },
            notes: { type: 'string', example: 'Sem cebola' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['productId', 'sizeId', 'quantity'],
                properties: {
                  productId: { type: 'string' },
                  sizeId: { type: 'string' },
                  quantity: { type: 'integer', minimum: 1 },
                },
              },
            },
          },
        },
        UpdateOrderStatus: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: [
                'pending',
                'confirmed',
                'preparing',
                'out_for_delivery',
                'delivered',
                'cancelled',
              ],
            },
          },
        },
      },
    },
  },
  apis: ['./src/interface/http/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
