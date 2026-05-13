// TODO: Migrar a Firebase. Las llamadas HTTP al backend legacy han sido desactivadas.
// Todos los métodos mantienen su firma original para facilitar la integración con Firebase.
import { Injectable, signal } from '@angular/core';
import { Routes } from '../interfaces/models.interface';
import { GtuNeighborhoodsService } from './gtu-neighborhoods.service';
import { GtuStopsService } from './gtu-stops.service';
import { inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GtuRoutesService {

  neighborhoodsService = inject(GtuNeighborhoodsService);
  stopsService = inject(GtuStopsService);
  routes = signal<Routes[]>([]);
  routeToEdit = signal<Routes | null>(null);
  routeSelected = signal<Routes | null>(null);

  constructor() {
    // Firebase integration pending — no HTTP calls made
  }

  mapRecordFormToRoute(formValues: Record<string, string>): Routes {
    return {
      id: this.routeToEdit()?.id || undefined,
      name: formValues['name'],
      description: formValues['description'],
      neighborhoods: this.neighborhoodsService.neighborhoodsSelected().map((n) => n.id),
      stops: this.stopsService.stopsSelected().map((s) => s.id!),
      startTime: formValues['startTime'],
      endTime: formValues['endTime'],
    };
  }

  loadRoutes() {
    // TODO: Firebase — leer colección /routes
    console.info('[GtuRoutesService] loadRoutes: pendiente integración Firebase');
  }

  addRoute(route: Routes) {
    this.routeSelected.set(route);
  }

  createRoute(form: Record<string, string>) {
    // TODO: Firebase — crear documento en /routes
    const route = this.mapRecordFormToRoute(form);
    const tempId = Date.now();
    this.routes.update((prev) => [...prev, { ...route, id: tempId }]);
    console.info('[GtuRoutesService] createRoute: pendiente integración Firebase', route);
  }

  deleteRoute(id: string | number) {
    // TODO: Firebase — eliminar documento /routes/{id}
    this.routes.update((prev) => prev.filter((r) => r.id !== id));
    console.info('[GtuRoutesService] deleteRoute: pendiente integración Firebase', id);
  }

  routeSelectedToEdit(route: Routes) {
    this.routeToEdit.set(route);
    this.neighborhoodsService.neighborhoodsSelected.set(
      this.neighborhoodsService.neighborhoods().filter((n) =>
        route.neighborhoods.some((item) => item === n.id)
      )
    );
    this.stopsService.stopsSelected.set(
      this.stopsService.stops().filter((s) =>
        route.stops.some((item) => item === s.id)
      )
    );
  }

  editRoute(form: Record<string, string>) {
    // TODO: Firebase — actualizar documento /routes/{id}
    const route = this.mapRecordFormToRoute(form);
    this.routes.update((prev) =>
      prev.map((r) => (r.id === route.id ? { ...r, ...route } : r))
    );
    console.info('[GtuRoutesService] editRoute: pendiente integración Firebase', route);
  }

  clearRouteSelected() {
    this.routeSelected.set(null);
  }
}
