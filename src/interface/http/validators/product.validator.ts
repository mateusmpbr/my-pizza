import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const createProductSchema = {
  type: 'object',
  required: ['categoryId', 'name', 'price'],
  properties: {
    categoryId: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'ID da categoria é obrigatório' },
    },
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 150,
      errorMessage: {
        minLength: 'Nome deve ter pelo menos 2 caracteres',
        maxLength: 'Nome deve ter no máximo 150 caracteres',
      },
    },
    description: { type: 'string', maxLength: 1000 },
    price: {
      type: 'number',
      minimum: 0.01,
      errorMessage: { minimum: 'Preço deve ser maior que zero', type: 'Preço deve ser um número' },
    },
    imageUrl: { type: 'string', maxLength: 500 },
    isAvailable: { type: 'boolean' },
  },
  additionalProperties: false,
  errorMessage: {
    required: {
      categoryId: 'ID da categoria é obrigatório',
      name: 'Nome é obrigatório',
      price: 'Preço é obrigatório',
    },
  },
};

const updateProductSchema = {
  type: 'object',
  minProperties: 1,
  properties: {
    categoryId: { type: 'string', minLength: 1 },
    name: { type: 'string', minLength: 2, maxLength: 150 },
    description: { type: 'string', maxLength: 1000 },
    price: { type: 'number', minimum: 0.01 },
    imageUrl: { type: 'string', maxLength: 500 },
    isAvailable: { type: 'boolean' },
  },
  additionalProperties: false,
  errorMessage: { minProperties: 'Ao menos um campo deve ser informado' },
};

export const validateCreateProduct = ajv.compile(createProductSchema);
export const validateUpdateProduct = ajv.compile(updateProductSchema);
