import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router'; // <-- Importamos el Router
import { GtuAuthService } from '../../services/gtu-auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginForm } from '../../interfaces/models.interface';
import { LoadingModalComponent } from "../../components/loadingModal/loadingModal.component";
import { ResponseBackendModalComponent } from "../../../shared/response-backend-modal/response-backend-modal.component";
import { InfoModalComponent } from "../../components/infoModal/infoModal.component";

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.component.html',
  imports: [CommonModule, FormsModule, LoadingModalComponent, ResponseBackendModalComponent, InfoModalComponent],
})
export default class LoginPageComponent {
  email = signal('');
  showLogin = signal(true);
  password = signal('');
  showInfoModal = signal(false);
  isLoading = signal(false);
  showPassword = signal(false);
  submitted = signal(false);
  errorResponse = signal(false);
  errorResponseMessage = signal('');
  errors = signal<LoginForm>({});

  private auth = inject(GtuAuthService);
  private router = inject(Router); // <-- Lo inyectamos para redirigir

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  validate() {
    const errorObj: LoginForm = {};
    const emailVal = this.email().trim();
    const passwordVal = this.password().trim();

    if (!emailVal) {
      errorObj.email = 'El correo es obligatorio.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailVal)) {
      errorObj.email = 'Formato de correo inválido.';
    }

    if (!passwordVal) {
      errorObj.password = 'La contraseña es obligatoria.';
    }

    this.errors.set(errorObj);
    return Object.keys(errorObj).length === 0;
  }

  validateResetPassword() {
    const errorObj: LoginForm = {};
    const emailVal = this.email().trim();

    if (!emailVal) {
      errorObj.email = 'El correo es obligatorio.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailVal)) {
      errorObj.email = 'Formato de correo inválido.';
    }

    this.errors.set(errorObj);
    return Object.keys(errorObj).length === 0;
  }

  // Convertimos a async para manejar las respuestas de Firebase
  async onSubmitResetPassword() {
    this.submitted.set(true);
    if (this.validateResetPassword()) {
      this.isLoading.set(true);
      try {
        await this.auth.resetPassword(this.email());
        this.showInfoModal.set(true);
        this.email.set('');
      } catch (error: any) {
        this.errorResponse.set(true);
        this.errorResponseMessage.set(this.getFirebaseErrorMessage(error.code));
      } finally {
        // El finally se ejecuta siempre, ya sea éxito o error
        this.isLoading.set(false);
        this.submitted.set(false);
      }
    }
  }

  // Convertimos a async para esperar la validación real
  async onSubmit() {
    this.submitted.set(true);
    if (this.validate()) {
      this.isLoading.set(true);
      try {
        // Intentamos iniciar sesión con Firebase
        await this.auth.login(this.email(), this.password());
        
        // Si no hay errores, redirigimos al instante
        this.router.navigate(['/dashboard/home']);
      } catch (error: any) {
        // Si Firebase rechaza la contraseña o correo, mostramos tu modal de error
        this.errorResponse.set(true);
        this.errorResponseMessage.set(this.getFirebaseErrorMessage(error.code));
      } finally {
        this.isLoading.set(false);
        this.submitted.set(false);
      }
    }
  }

  // Diccionario para traducir los errores en inglés de Firebase a los mensajes de tu UI
  private getFirebaseErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Correo o contraseña incorrectos.';
      case 'auth/invalid-email':
        return 'El formato del correo es inválido.';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada por el administrador.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intenta de nuevo más tarde.';
      default:
        return 'Ocurrió un error al conectarse con el servidor.';
    }
  }
}
