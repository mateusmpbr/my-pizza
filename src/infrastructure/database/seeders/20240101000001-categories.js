'use strict';

const categories = [
  {
    id: 'cat-tradicional-0000-0000-000000000001',
    name: 'Tradicionais',
    description: 'Pizzas clássicas com ingredientes tradicionais',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'cat-especiais-00000-0000-000000000002',
    name: 'Especiais',
    description: 'Pizzas com ingredientes premium e combinações especiais',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'cat-doces-000000-0000-000000000003',
    name: 'Doces',
    description: 'Pizzas doces para sobremesa',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'cat-bebidas-00000-0000-000000000004',
    name: 'Bebidas',
    description: 'Refrigerantes, sucos e outras bebidas',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('categories', categories);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', {
      id: categories.map((c) => c.id),
    });
  },
};
