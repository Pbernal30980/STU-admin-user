import { Component, inject, signal } from '@angular/core';
import {Router } from '@angular/router';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { GtuAuthService } from '../../services/gtu-auth.service';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [ConfirmModalComponent],
  templateUrl: './logout-button.component.html',
})
export class LogoutButtonComponent {
  showLogoutModal = signal(false);
  userName = localStorage.getItem('userName');
  router = inject(Router);
  authService = inject(GtuAuthService);


  openModal() {
    this.showLogoutModal.set(true);
  }

  confirmLogout() {
    this.showLogoutModal.set(false);
    this.authService.logout();

  }
}
