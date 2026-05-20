import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GtuNotificationService } from '../../../services/gtu-notification.service';

@Component({
  selector: 'app-notification-header',
  imports: [CommonModule],
  templateUrl: './notification-header.component.html',
})
export class NotificationHeaderComponent {
  notificationService = inject(GtuNotificationService);
  isOpen = signal(false);

  // Guarda la última vez que el usuario abrió el desplegable
  lastViewed = signal<number>(Number(localStorage.getItem('gtu_notifications_last_viewed') || '0'));

  // Cuenta las notificaciones que son más recientes que la última visualización
  unreadCount = computed(() => {
    const last = this.lastViewed();
    return this.notificationService.notifications().filter(n => {
      const t = n.timestamp instanceof Date ? n.timestamp.getTime() : new Date(n.timestamp).getTime();
      return t > last;
    }).length;
  });

  toggleDropdown() {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      // Al abrir, actualizamos el tiempo de visualización para marcar todas como leídas
      const now = Date.now();
      this.lastViewed.set(now);
      localStorage.setItem('gtu_notifications_last_viewed', now.toString());
    }
  }

  closeDropdown() {
    this.isOpen.set(false);
  }

  formatTime(date: any): string {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    const diffMs = Date.now() - d.getTime();
    
    // Si la diferencia es menor a 0 (ej. discrepancia leve de reloj del cliente), mostramos "Ahora"
    if (diffMs < 0) return 'Ahora';
    
    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) return 'Ahora';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    
    const days = Math.floor(hours / 24);
    return `Hace ${days}d`;
  }
}
