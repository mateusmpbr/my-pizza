'use strict';

const products = [
  // Tradicionais
  {
    id: 'prod-margherita-0000-0000-000000000001',
    category_id: 'cat-tradicional-0000-0000-000000000001',
    name: 'Margherita',
    description: 'Molho de tomate, mussarela e manjericão fresco',
    price: 35.00,
    image_url: null,
    is_available: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'prod-calabresa-00000-0000-000000000002',
    category_id: 'cat-tradicional-0000-0000-000000000001',
    name: 'Calabresa',
    description: 'Molho de tomate, mussarela e calabresa fatiada',
    price: 38.00,
    image_url: null,
    is_available: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // Especiais
  {
    id: 'prod-quatro-queijos-0000-000000000003',
    category_id: 'cat-especiais-00000-0000-000000000002',
    name: 'Quatro Queijos',
    description: 'Mussarela, parmesão, gorgonzola e catupiry',
    price: 52.00,
    image_url: null,
    is_available: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'prod-trufa-000000000-0000-000000000004',
    category_id: 'cat-especiais-00000-0000-000000000002',
    name: 'Trufada',
    description: 'Molho branco, mussarela, cogumelos e azeite de trufa',
    price: 65.00,
    image_url: null,
    is_available: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // Doces
  {
    id: 'prod-chocolate-00000-0000-000000000005',
    category_id: 'cat-doces-000000-0000-000000000003',
    name: 'Chocolate com Morango',
    description: 'Creme de chocolate, morangos frescos e leite condensado',
    price: 42.00,
    image_url: null,
    is_available: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'prod-banana-000000-0000-000000000006',
    category_id: 'cat-doces-000000-0000-000000000003',
    name: 'Banana com Canela',
    description: 'Banana caramelizada, canela e mel',
    price: 38.00,
    image_url: null,
    is_available: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  // Bebidas
  {
    id: 'prod-coca-cola-0000-0000-000000000007',
    category_id: 'cat-bebidas-00000-0000-000000000004',
    name: 'Coca-Cola',
    description: 'Refrigerante gelado',
    price: 8.00,
    image_url: null,
    is_available: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'prod-suco-laranja-0000-000000000008',
    category_id: 'cat-bebidas-00000-0000-000000000004',
    name: 'Suco de Laranja',
    description: 'Suco natural de laranja',
    price: 10.00,
    image_url: null,
    is_available: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('products', products);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', {
      id: products.map((p) => p.id),
    });
  },
};
