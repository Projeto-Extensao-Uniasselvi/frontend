import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  if (authService.isLoggedIn() && authService.isAdmin()) return true;

  authService.logout();
  router.navigate(['/login'], { queryParams: { next: state.url }});
  return false;
};
