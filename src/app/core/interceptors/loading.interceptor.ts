import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

let activeRequests = 0;

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

  // Skip background/silent requests tagged with 'X-Silent'
  if (req.headers.has('X-Silent')) {
    return next(req);
  }

  activeRequests++;
  if (activeRequests === 1) {
    spinner.show();
  }

  return next(req).pipe(
    finalize(() => {
      activeRequests--;
      if (activeRequests === 0) {
        spinner.hide();
      }
    }),
  );
};
