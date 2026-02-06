// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// export const adminGuard: CanActivateFn = () => {
//   const auth = inject(AuthService);
//   const router = inject(Router);

//   if (auth.isLoggedIn() && auth.isAdmin()) {
//     return true;
//   }

//   router.navigate(['/login']);
//   return false;
// };


import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (user?.role === 'ADMIN') return true;

  router.navigate(['/login']);
  return false;
};
