import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const orderItemSchema = {
  type: 'object',
  required: ['productId', 'sizeId', 'quantity'],
  properties: {
    productId: { type: 'string', minLength: 1 },
    sizeId: { type: 'string', minLength: 1 },
    quantity: {
      type: 'integer',
      minimum: 1,
      errorMessage: {
        minimum: 'Quantidade deve ser ao menos 1',
        type: 'Quantidade deve ser um número inteiro',
      },
    },
  },
  additionalProperties: false,
  errorMessage: {
    required: {
      productId: 'ID do produto é obrigatório',
      sizeId: 'ID do tamanho é obrigatório',
      quantity: 'Quantidade é obrigatória',
    },
  },
};

const createOrderSchema = {
  type: 'object',
  required: ['customerId', 'items'],
  properties: {
    customerId: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'ID do cliente é obrigatório' },
    },
    notes: { type: 'string', maxLength: 500 },
    items: {
      type: 'array',
      minItems: 1,
      items: orderItemSchema,
      errorMessage: {
        minItems: 'O pedido deve ter ao menos um item',
        type: 'Itens deve ser uma lista',
      },
    },
  },
  additionalProperties: false,
  errorMessage: {
    required: {
      customerId: 'ID do cliente é obrigatório',
      items: 'Itens do pedido são obrigatórios',
    },
  },
};

const updateOrderStatusSchema = {
  type: 'object',
  required: ['status'],
  properties: {
    status: {
      type: 'string',
      enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      errorMessage: {
        enum: 'Status inválido. Valores aceitos: pending, confirmed, preparing, out_for_delivery, delivered, cancelled',
      },
    },
  },
  additionalProperties: false,
  errorMessage: {
    required: { status: 'Status é obrigatório' },
  },
};

export const validateCreateOrder = ajv.compile(createOrderSchema);
export const validateUpdateOrderStatus = ajv.compile(updateOrderStatusSchema);
