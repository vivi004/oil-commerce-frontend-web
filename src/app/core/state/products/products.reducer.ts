import { createReducer, on } from '@ngrx/store';
import { Product, ProductFilter } from '../../models/product.model';
import * as ProductActions from './products.actions';

export interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filter: ProductFilter;
  isLoading: boolean;
  error: string | null;
}

export const initialProductsState: ProductsState = {
  items: [],
  selectedProduct: null,
  totalItems: 0,
  page: 1,
  pageSize: 12,
  totalPages: 1,
  filter: {},
  isLoading: false,
  error: null,
};

export const productsReducer = createReducer(
  initialProductsState,

  on(ProductActions.loadProducts, (state, { filter }) => ({
    ...state,
    isLoading: true,
    error: null,
    filter: filter ?? state.filter,
  })),

  on(ProductActions.loadProductsSuccess, (state, { response }) => ({
    ...state,
    items: response.items,
    totalItems: response.totalItems ?? response.total,
    page: response.page,
    pageSize: response.pageSize,
    totalPages: response.totalPages,
    isLoading: false,
    error: null,
  })),

  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(ProductActions.loadProductDetails, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(ProductActions.loadProductDetailsSuccess, (state, { product }) => ({
    ...state,
    selectedProduct: product,
    isLoading: false,
    error: null,
  })),

  on(ProductActions.loadProductDetailsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(ProductActions.setProductFilter, (state, { filter }) => ({
    ...state,
    filter: { ...state.filter, ...filter },
  })),

  on(ProductActions.clearProductFilter, (state) => ({
    ...state,
    filter: {},
  }))
);
