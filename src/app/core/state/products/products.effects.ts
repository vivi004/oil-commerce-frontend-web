import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import * as ProductActions from './products.actions';

@Injectable()
export class ProductEffects {
  private readonly actions$ = inject(Actions);
  private readonly productService = inject(ProductService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(({ filter }) =>
        this.productService.getProducts(filter).pipe(
          map((response) => ProductActions.loadProductsSuccess({ response })),
          catchError((err) =>
            of(ProductActions.loadProductsFailure({ error: err?.message ?? 'Failed to load products' }))
          )
        )
      )
    )
  );

  loadProductDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProductDetails),
      switchMap(({ id }) =>
        this.productService.getProductById(id).pipe(
          map((product) => ProductActions.loadProductDetailsSuccess({ product })),
          catchError((err) =>
            of(ProductActions.loadProductDetailsFailure({ error: err?.message ?? 'Failed to load product details' }))
          )
        )
      )
    )
  );
}
