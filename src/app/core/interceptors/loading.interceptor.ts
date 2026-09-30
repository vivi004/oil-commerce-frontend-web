import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

let activeRequests = 0;
let safetyTimeout: any = null;

/**
 * Loading Interceptor — shows/hides ngx-spinner for HTTP requests.
 * Tracks multiple concurrent requests and only hides the spinner
 * when ALL requests have completed.
 */
export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const spinner = inject(NgxSpinnerService);

  // Skip background/silent requests tagged with 'X-Silent' or tracking/sync polling
  if (
    req.headers.has('X-Silent') ||
    req.url.includes('/tracking') ||
    req.url.includes('orders/sync')
  ) {
    return next(req);
  }

  activeRequests++;
  if (activeRequests === 1) {
    spinner.show();

    // Safety fallback: Never leave the screen permanently blocked if a request hangs
    if (safetyTimeout) clearTimeout(safetyTimeout);
    safetyTimeout = setTimeout(() => {
      if (activeRequests > 0) {
        activeRequests = 0;
        spinner.hide();
      }
    }, 6000);
  }

  return next(req).pipe(
    finalize(() => {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        if (safetyTimeout) clearTimeout(safetyTimeout);
        spinner.hide();
      }
    }),
  );
};
