// TODO: Migrar a Firebase Authentication.
// Las llamadas HTTP al backend legacy han sido desactivadas.
import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GtuAuthService {
  private router = inject(Router);
  responseStatus = signal(200);
  responseMessage = signal('');

  login(email: string, password: string) {
    // Bypass de autenticación activo mientras se integra Firebase Auth
    if (environment.authBypass) {
      localStorage.setItem('userName', email || 'Dev User');
      localStorage.setItem('accessToken', 'dev-bypass-token');
      localStorage.setItem('userRole', 'ADMIN');
      this.responseStatus.set(200);
      this.responseMessage.set('');
      this.router.navigate(['/dashboard']);
      return;
    }

    // TODO: Firebase Auth — signInWithEmailAndPassword
    console.info('[GtuAuthService] login: pendiente integración Firebase Auth');
    this.responseStatus.set(503);
    this.responseMessage.set('Backend en mantenimiento. Integración Firebase pendiente.');
  }

  resetPassword(email: string) {
    // TODO: Firebase Auth — sendPasswordResetEmail
    console.info('[GtuAuthService] resetPassword: pendiente integración Firebase Auth');
    this.responseStatus.set(200);
    this.responseMessage.set('');
  }

  changePassword(newPassword: string, token: string) {
    // TODO: Firebase Auth — confirmPasswordReset
    console.info('[GtuAuthService] changePassword: pendiente integración Firebase Auth');
    this.responseStatus.set(200);
    this.responseMessage.set('');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
