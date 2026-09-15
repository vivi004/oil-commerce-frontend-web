import { createAction, props } from '@ngrx/store';
import { Product, ProductFilter } from '../../models/product.model';
import { PaginatedResponse } from '../../models/api-response.model';

export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ filter?: ProductFilter }>()
);

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ response: PaginatedResponse<Product> }>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);

export const loadProductDetails = createAction(
  '[Products] Load Product Details',
  props<{ id: string }>()
);

export const loadProductDetailsSuccess = createAction(
  '[Products] Load Product Details Success',
  props<{ product: Product }>()
);

export const loadProductDetailsFailure = createAction(
  '[Products] Load Product Details Failure',
  props<{ error: string }>()
);

export const setProductFilter = createAction(
  '[Products] Set Filter',
  props<{ filter: ProductFilter }>()
);

export const clearProductFilter = createAction(
  '[Products] Clear Filter'
);
