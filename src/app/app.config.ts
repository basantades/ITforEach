import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => config.src, // Permite URLs absolutas
    },
    provideAnimations(),
    provideToastr(),
    importProvidersFrom(
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right', // 👈 Cambia la posición
        timeOut: 3000,
        progressBar: true,
        closeButton: true,
      })
    ),
  ]
};
