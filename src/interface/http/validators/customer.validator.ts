import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const createCustomerSchema = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 150,
      errorMessage: {
        minLength: 'Nome deve ter pelo menos 2 caracteres',
        maxLength: 'Nome deve ter no máximo 150 caracteres',
      },
    },
    email: {
      type: 'string',
      format: 'email',
      maxLength: 255,
      errorMessage: {
        format: 'E-mail inválido',
        maxLength: 'E-mail deve ter no máximo 255 caracteres',
      },
    },
    phone: {
      type: 'string',
      minLength: 8,
      maxLength: 20,
      errorMessage: {
        minLength: 'Telefone deve ter pelo menos 8 caracteres',
        maxLength: 'Telefone deve ter no máximo 20 caracteres',
      },
    },
    address: {
      type: 'string',
      maxLength: 500,
      errorMessage: { maxLength: 'Endereço deve ter no máximo 500 caracteres' },
    },
  },
  additionalProperties: false,
  errorMessage: {
    required: {
      name: 'Nome é obrigatório',
      email: 'E-mail é obrigatório',
    },
  },
};

const updateCustomerSchema = {
  type: 'object',
  minProperties: 1,
  properties: {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 150,
      errorMessage: {
        minLength: 'Nome deve ter pelo menos 2 caracteres',
        maxLength: 'Nome deve ter no máximo 150 caracteres',
      },
    },
    email: {
      type: 'string',
      format: 'email',
      maxLength: 255,
      errorMessage: { format: 'E-mail inválido' },
    },
    phone: { type: 'string', minLength: 8, maxLength: 20 },
    address: { type: 'string', maxLength: 500 },
  },
  additionalProperties: false,
  errorMessage: { minProperties: 'Ao menos um campo deve ser informado' },
};

export const validateCreateCustomer = ajv.compile(createCustomerSchema);
export const validateUpdateCustomer = ajv.compile(updateCustomerSchema);
