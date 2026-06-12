export type SizeEnum = 'P' | 'M' | 'G' | 'GG';

export interface ProductSize {
  id: string;
  productId: string;
  size: SizeEnum;
  additionalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductSizeDTO {
  size: SizeEnum;
  additionalPrice: number;
}
