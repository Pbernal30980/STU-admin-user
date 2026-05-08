import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginResponse } from '../interfaces/reponses.interface';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GtuAuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  responseStatus = signal(200);
  responseMessage = signal('');

  login(email: string, password: string) {
    if (environment.authBypass) {
      localStorage.setItem('userName', email || 'Dev User');
      localStorage.setItem('accessToken', 'dev-bypass-token');
      localStorage.setItem('userRole', 'ADMIN');
      this.responseStatus.set(200);
      this.responseMessage.set('');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.http.post<LoginResponse>(environment.backEndGTU_Login, {
      email: email,
      password: password
    },
      { observe: 'response' }).subscribe({
        next: (response) => {
          const res = response.body!;
          if (res.data.role == 'DRIVER') {
            this.responseStatus.set(403);
            this.responseMessage.set('No tienes permisos para acceder a esta aplicación.');
            return;

          }
          localStorage.setItem('userName', res.data.name);
          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('userRole', res.data.role);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.responseStatus.set(error.status);
          this.responseMessage.set(error.error.message);
        }
      })
  }

  resetPassword(email: string) {
    this.http.post<LoginResponse>(environment.backEndGTU_ResetPasswordRequest, {
      email: email,
    },
      {
        observe: 'response',
      }).subscribe({
        next: (response) => {
          const res = response.body!;
          this.responseStatus.set(res.status);
        },
        error: (error) => {
          this.responseStatus.set(error.status);
          this.responseMessage.set(error.error.message);
        }
      })
  }

  changePassword(newPassword: string, token: string) {
    this.http.post<LoginResponse>(environment.backEndGTU_ChangePassword, {
      token: token,
      newPassword: newPassword,
    },
      {
        observe: 'response',

      }).subscribe({
        next: (response) => {
          const res = response.body!;
          this.responseStatus.set(res.status);
        },
        error: (error) => {
          this.responseStatus.set(error.status);
          this.responseMessage.set(error.error.message);
        }
      })
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
