import { inject, Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private _cookieService = inject(CookieService);
  private router = inject(Router);
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.getTokenFromCookies();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // return next.handle(request).pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     if (error.status === 401 && this.router.url !== '/signin') {
    //       // Clear token if needed
    //       this._cookieService.delete('token');
    //       // Redirect to login
    //       this.router.navigate(['/signin']);
    //     }

    //     return throwError(() => error);
    //   })
    // );

     return next.handle(request);
  }

  private getTokenFromCookies(): string | null {
    const matches = this._cookieService.get('token');

    return matches || null;
  }
}
