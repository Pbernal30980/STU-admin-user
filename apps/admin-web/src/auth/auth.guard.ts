import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

export const authGuard: CanActivateFn = () => {
  if (environment.authBypass) {
    if (!localStorage.getItem('accessToken')) {
      localStorage.setItem('accessToken', 'dev-bypass-token');
      localStorage.setItem('userName', 'Dev User');
      localStorage.setItem('userRole', 'ADMIN');
    }
    return true;
  }

  const router = inject(Router);
  const token = localStorage.getItem('accessToken');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
