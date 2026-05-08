import { Component, inject, signal } from '@angular/core';
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

  private auth = inject(GtuAuthService)

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

  onSubmitResetPassword(){
    this.submitted.set(true);
    if(this.validateResetPassword()) {
      this.isLoading.set(true);
      this.auth.resetPassword(this.email());

    }
    setTimeout(() => {
      if (this.auth.responseStatus() !== 200) {
        this.isLoading.set(false);
        this.submitted.set(false);
        this.errorResponse.set(true);
        this.email.set('');
        this.errorResponseMessage.set(this.auth.responseMessage());
        return;
      };

      this.isLoading.set(false);
      this.showInfoModal.set(true);
      this.submitted.set(false);
      this.email.set('');
    }, 2000);

  }
  onSubmit() {
    this.submitted.set(true);
    if (this.validate()) {
      this.isLoading.set(true);
      this.auth.login(this.email(), this.password());

      setTimeout(() => {
        if (this.auth.responseStatus() !== 200) {
          this.isLoading.set(false);
          this.submitted.set(false);
          this.errorResponse.set(true);
          this.errorResponseMessage.set(this.auth.responseMessage());
        }
      }, 2000);
    }

  }
}
