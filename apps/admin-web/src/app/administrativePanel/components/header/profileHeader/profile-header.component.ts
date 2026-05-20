import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GtuAuthService } from '../../../services/gtu-auth.service';
import { ConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-profile-header',
  imports: [CommonModule, ConfirmModalComponent],
  templateUrl: './profile-header.component.html',
})
export class ProfileHeaderComponent {
  authService = inject(GtuAuthService);
  userName = localStorage.getItem('userName') || 'Administrador';
  isOpen = signal(false);
  showLogoutModal = signal(false);

  toggleDropdown() {
    this.isOpen.update(v => !v);
  }

  closeDropdown() {
    this.isOpen.set(false);
  }

  openLogoutModal() {
    this.closeDropdown();
    this.showLogoutModal.set(true);
  }

  confirmLogout() {
    this.authService.logout();
    this.showLogoutModal.set(false);
  }
}
