// import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';

// import { routes } from './app.routes';
// import { jwtInterceptor } from './interceptors/jwt-interceptor';
// import { provideReactiveForms } from '@angular/forms';
// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideBrowserGlobalErrorListeners(),
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideReactiveForms(),
//     provideRouter(routes),
//     provideHttpClient(
//       withInterceptors([jwtInterceptor])
//     )
//   ]
// };

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { provideForms } from '@angular/forms';

import { routes } from './app.routes';
import { jwtInterceptor } from './interceptors/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // provideForms(),
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    )
  ]
};
