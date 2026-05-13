import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

// Importaciones oficiales de Firebase Auth
import { 
  Auth, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  confirmPasswordReset, 
  signOut 
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class GtuAuthService {
  private router = inject(Router);
  private auth = inject(Auth); // Inyectamos el motor de Firebase Auth

  // Mantenemos estas señales por si otros componentes viejos las están leyendo, 
  // aunque nuestro nuevo login ya captura los errores de forma nativa.
  responseStatus = signal(200);
  responseMessage = signal('');

  async login(email: string, password: string): Promise<void> {
    // Si tienes el bypass activo en development, entramos directo
    if (environment.authBypass) {
      localStorage.setItem('userName', email || 'Dev User');
      localStorage.setItem('userRole', 'ADMIN');
      this.router.navigate(['/dashboard']);
      return;
    }

    // Autenticación Real con Firebase
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    
    // Guardamos el email localmente solo para mostrarlo en la interfaz gráfica (tu menú lateral)
    // Ya no guardamos tokens (Firebase maneja la seguridad encriptada internamente).
    localStorage.setItem('userName', userCredential.user.email || 'Admin');
    localStorage.setItem('userRole', 'ADMIN');
  }

  async resetPassword(email: string): Promise<void> {
    // Firebase enviará automáticamente un correo con tu plantilla predeterminada
    await sendPasswordResetEmail(this.auth, email);
  }

  async changePassword(newPassword: string, token: string): Promise<void> {
    // Verifica el token enviado al correo y actualiza la contraseña
    await confirmPasswordReset(this.auth, token, newPassword);
  }

  async logout(): Promise<void> {
    await signOut(this.auth); // Destruye la sesión segura en la nube
    localStorage.clear();     // Limpia el nombre de la interfaz
    this.router.navigate(['/login']);
  }
}
