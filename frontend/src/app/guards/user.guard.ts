import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const userGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userRaw = localStorage.getItem('user');

  if (!userRaw) {
    router.navigate(['/login']);
    return false;
  }

  const user = JSON.parse(userRaw);

  if (user.role === 'USER') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
