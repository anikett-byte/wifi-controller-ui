import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './intercepters/auth.interceptor';
import {ToastrModule} from 'ngx-toastr';
import {provideToastr} from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthRedirectInterceptor } from './intercepters/session-varifier.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()),provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi() // 👈 This is required to use HTTP_INTERCEPTORS from DI
    ),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthRedirectInterceptor,
      multi: true
    },
    provideToastr(),
    importProvidersFrom(
      ToastrModule.forRoot(),
    )
  ]
};


