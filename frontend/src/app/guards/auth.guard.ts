import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AdminComponent } from '../pages/admin/admin.component';
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

const token = localStorage.getItem('access-token');
  const user = localStorage.getItem('user');

  if (token && user) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
