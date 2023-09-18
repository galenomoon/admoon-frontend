import { IProduct } from "./product";

export interface IImage {
  id?: number;
  url: string;
  productId: number;
  product?: IProduct;
  filename?: string;
}
