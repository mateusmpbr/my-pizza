'use strict';

const pizzaProductIds = [
  'prod-margherita-0000-0000-000000000001',
  'prod-calabresa-00000-0000-000000000002',
  'prod-quatro-queijos-0000-000000000003',
  'prod-trufa-000000000-0000-000000000004',
  'prod-chocolate-00000-0000-000000000005',
  'prod-banana-000000-0000-000000000006',
];

const sizes = ['P', 'M', 'G', 'GG'];
const additionalPrices = { P: 0, M: 8, G: 15, GG: 22 };

const productSizes = [];
let counter = 1;

for (const productId of pizzaProductIds) {
  for (const size of sizes) {
    const paddedCounter = String(counter).padStart(3, '0');
    productSizes.push({
      id: `size-${size.toLowerCase()}-${paddedCounter}-0000-000000000000`,
      product_id: productId,
      size,
      additional_price: additionalPrices[size],
      created_at: new Date(),
      updated_at: new Date(),
    });
    counter++;
  }
}

// Bebidas não têm tamanho — registrar apenas um tamanho padrão
const beverageIds = [
  'prod-coca-cola-0000-0000-000000000007',
  'prod-suco-laranja-0000-000000000008',
];

for (const productId of beverageIds) {
  const paddedCounter = String(counter).padStart(3, '0');
  productSizes.push({
    id: `size-uni-${paddedCounter}-00000-000000000000`,
    product_id: productId,
    size: 'P',
    additional_price: 0,
    created_at: new Date(),
    updated_at: new Date(),
  });
  counter++;
}

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('product_sizes', productSizes);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('product_sizes', {
      id: productSizes.map((s) => s.id),
    });
  },
};
