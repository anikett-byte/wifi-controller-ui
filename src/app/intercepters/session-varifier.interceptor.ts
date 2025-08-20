// auth-redirect.interceptor.ts
import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthRedirectInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private cookieService = inject(CookieService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Redirect on 401 Unauthorized
        if (error.status === 401 && this.router.url !== '/signin') {
          this.cookieService.delete('token');
          this.router.navigate(['/signin']);
        }

        return throwError(() => error);
      })
    );
  }
}
