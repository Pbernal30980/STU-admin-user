import { Injectable, signal, inject } from '@angular/core';
import { AssignDriver } from '../interfaces/models.interface';
import { GtuNotificationService } from './gtu-notification.service';
import { GtuRoutesService } from './gtu-routes.service';
import { GtuUsersService } from './gtu-users.service';
import { Firestore, collection, addDoc, deleteDoc, doc, onSnapshot } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class GtuAssignDriverService {
  private firestore = inject(Firestore);
  private notificationService = inject(GtuNotificationService);
  private routesService = inject(GtuRoutesService);
  private usersService = inject(GtuUsersService);
  private assignmentsCollection = collection(this.firestore, 'Asignaciones');

  assignDrivers = signal<AssignDriver[]>([]);

  constructor() {
    this.loadData();
  }

  loadData() {
    onSnapshot(this.assignmentsCollection, (snapshot) => {
      const mapped: AssignDriver[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          driverId: data['idConductor'] || '',
          routeId: data['idRuta'] || ''
        };
      });
      this.assignDrivers.set(mapped);
    }, (error) => {
      console.error('[GtuAssignDriverService] Error al leer asignaciones de Firestore:', error);
    });
  }

  async createDriverAssignment(routeId: string, driverId: string) {
    if (!routeId || !driverId) {
      console.warn('[GtuAssignDriverService] Faltan datos para crear asignación:', { routeId, driverId });
      return;
    }

    // Evitar asignaciones duplicadas de la misma ruta con el mismo conductor
    const exists = this.assignDrivers().some(a => a.routeId === routeId && a.driverId === driverId);
    if (exists) {
      console.warn('[GtuAssignDriverService] La asignación ya existe');
      return;
    }

    try {
      await addDoc(this.assignmentsCollection, {
        idConductor: driverId,
        idRuta: routeId
      });
      console.info('[GtuAssignDriverService] Asignación creada exitosamente en Firebase');
      
      const route = this.routesService.routes().find(r => r.id === routeId);
      const driver = this.usersService.users().find(u => u.id === driverId);
      const routeName = route ? route.name : `Ruta ${routeId}`;
      const driverName = driver ? driver.name : `Conductor ${driverId}`;
      this.notificationService.logChange('ASSIGN', `Se asignó al conductor "${driverName}" a la ruta "${routeName}"`);
    } catch (error) {
      console.error('[GtuAssignDriverService] Error al crear asignación:', error);
    }
  }

  async deleteDriverAssignment(id: string) {
    const assignmentObj = this.assignDrivers().find(a => a.id === id);
    let logMessage = 'Se eliminó una asignación de conductor';
    if (assignmentObj) {
      const route = this.routesService.routes().find(r => r.id === assignmentObj.routeId);
      const driver = this.usersService.users().find(u => u.id === assignmentObj.driverId);
      const routeName = route ? route.name : `Ruta ${assignmentObj.routeId}`;
      const driverName = driver ? driver.name : `Conductor ${assignmentObj.driverId}`;
      logMessage = `Se desasignó al conductor "${driverName}" de la ruta "${routeName}"`;
    }

    try {
      const docRef = doc(this.firestore, `Asignaciones/${id}`);
      await deleteDoc(docRef);
      console.info('[GtuAssignDriverService] Asignación eliminada exitosamente de Firebase');
      this.notificationService.logChange('DELETE', logMessage);
    } catch (error) {
      console.error('[GtuAssignDriverService] Error al eliminar asignación:', error);
    }
  }
}
