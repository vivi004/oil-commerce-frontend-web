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

  const isSilent =
    req.headers.has('X-Silent') ||
    req.url.includes('/tracking') ||
    req.url.includes('/orders') ||
    req.url.includes('orders/sync');

  // Strip client-only 'X-Silent' header so it is never sent over the wire (avoids CORS preflight rejections)
  const cleanReq = req.headers.has('X-Silent')
    ? req.clone({ headers: req.headers.delete('X-Silent') })
    : req;

  if (isSilent) {
    return next(cleanReq);
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
