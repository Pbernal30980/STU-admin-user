// TODO: Migrar a Firebase. Las llamadas HTTP al backend legacy han sido desactivadas.
import { Injectable, signal } from '@angular/core';
import { AssignDriver } from '../interfaces/models.interface';

@Injectable({ providedIn: 'root' })
export class GtuAssignDriverService {

  assignDrivers = signal<AssignDriver[]>([]);

  constructor() {
    // Firebase integration pending — no HTTP calls made
  }

  loadData() {
    // TODO: Firebase — leer colección /assignments
    console.info('[GtuAssignDriverService] loadData: pendiente integración Firebase');
  }

  createDriverAssignment(routeId: string, driverId: string) {
    // TODO: Firebase — crear documento en /assignments
    const tempId = Date.now().toString();
    this.assignDrivers.update((prev) => [...prev, { id: tempId, routeId, driverId }]);
    console.info('[GtuAssignDriverService] createDriverAssignment: pendiente Firebase', { routeId, driverId });
  }

  deleteDriverAssignment(id: string) {
    // TODO: Firebase — eliminar documento /assignments/{id}
    this.assignDrivers.update((prev) => prev.filter((a) => a.id !== id));
    console.info('[GtuAssignDriverService] deleteDriverAssignment: pendiente Firebase', id);
  }
}
