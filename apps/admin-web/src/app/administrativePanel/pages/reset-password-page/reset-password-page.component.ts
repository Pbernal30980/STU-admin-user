import {Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoModalComponent } from "../../components/infoModal/infoModal.component";
import { LoadingModalComponent } from "../../components/loadingModal/loadingModal.component";
import { ResponseBackendModalComponent } from "../../../shared/response-backend-modal/response-backend-modal.component";
import { LoginForm } from '../../interfaces/models.interface';
import { GtuAuthService } from '../../services/gtu-auth.service';

@Component({
  selector: 'app-reset-password-page',
  imports: [InfoModalComponent, LoadingModalComponent, ResponseBackendModalComponent],
  templateUrl: './reset-password-page.component.html',
})
export default class ResetPasswordPageComponent implements OnInit{
  password = signal('');
  errorResponse = signal(false);
  showInfoModal = signal(false);
  errorResponseMessage = signal('');
  errors = signal<LoginForm>({});
  token = signal<string | null>(null);
  isLoading = signal(false);
  submitted = signal(false);
  private auth = inject(GtuAuthService);


  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token.set(params.get('token'));
    });

  }

  validateResetPassword() {
      const errorObj: LoginForm = {};
      const passwordVal = this.password().trim();

      if (!passwordVal) {
      errorObj.password = 'La contraseña es obligatoria.';
    }

      this.errors.set(errorObj);
      return Object.keys(errorObj).length === 0;

    }

    onSubmitResetPassword(event: Event){
      event.preventDefault();
      this.submitted.set(true);
      if(this.validateResetPassword()) {
        this.isLoading.set(true);
        this.auth.changePassword(this.password(), this.token()!);

      }
      setTimeout(() => {
        if (this.auth.responseStatus() !== 200) {
          this.isLoading.set(false);
          this.submitted.set(false);
          this.errorResponse.set(true);
          this.password.set('');
          this.errorResponseMessage.set(this.auth.responseMessage());
          return;
        };


        this.isLoading.set(false);
        this.showInfoModal.set(true);
        this.submitted.set(false);
        this.password.set('');
      }, 2000);


    }
}
