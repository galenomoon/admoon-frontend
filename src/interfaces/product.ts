import { ICategory } from "./category";
import { IImage } from "./image";

export interface IProduct {
  id?: number;
  name: string;
  price: number | string;
  slug?: string;
  description: string;
  categoryId?: number;
  category?: ICategory;
  images: IImage[];
}

export interface IProductPaginated {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  results: IProduct[];
}
