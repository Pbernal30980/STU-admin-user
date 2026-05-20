import { Injectable, signal, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, limit, onSnapshot } from '@angular/fire/firestore';

export interface GtuNotification {
  id?: string;
  type: 'CREATE' | 'EDIT' | 'DELETE' | 'ASSIGN';
  message: string;
  timestamp: any;
  user: string;
}

@Injectable({ providedIn: 'root' })
export class GtuNotificationService {
  private firestore = inject(Firestore);
  private notificationsCollection = collection(this.firestore, 'Notificaciones');

  notifications = signal<GtuNotification[]>([]);

  constructor() {
    this.loadNotifications();
  }

  loadNotifications() {
    const q = query(this.notificationsCollection, orderBy('timestamp', 'desc'), limit(15));
    onSnapshot(q, (snapshot) => {
      const mapped = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          type: data['type'] || 'CREATE',
          message: data['message'] || '',
          timestamp: data['timestamp']?.toDate() || new Date(),
          user: data['user'] || 'Sistema'
        } as GtuNotification;
      });
      this.notifications.set(mapped);
    }, (error) => {
      console.error('[GtuNotificationService] Error al leer notificaciones de Firestore:', error);
    });
  }

  async logChange(type: 'CREATE' | 'EDIT' | 'DELETE' | 'ASSIGN', message: string) {
    const userName = localStorage.getItem('userName') || 'Admin';
    try {
      await addDoc(this.notificationsCollection, {
        type,
        message,
        timestamp: new Date(),
        user: userName
      });
      console.info(`[GtuNotificationService] Cambió registrado: [${type}] ${message}`);
    } catch (error) {
      console.error('[GtuNotificationService] Error al guardar notificación en Firestore:', error);
    }
  }
}
