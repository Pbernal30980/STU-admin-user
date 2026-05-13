// TODO: Migrar a Firebase. Las llamadas HTTP al backend legacy han sido desactivadas.
import { Injectable, signal, inject } from '@angular/core';
import { Stops } from '../interfaces/models.interface';
import { GtuNeighborhoodsService } from './gtu-neighborhoods.service';

@Injectable({ providedIn: 'root' })
export class GtuStopsService {

  neighborhoodService = inject(GtuNeighborhoodsService);
  stopToEdit = signal<Stops | null>(null);
  stopsSelected = signal<Stops[]>([]);
  stops = signal<Stops[]>([]);

  constructor() {
    // Firebase integration pending — no HTTP calls made
  }

  mapRecordFormToStop(formValues: Record<string, string>): Stops {
    return {
      id: this.stopToEdit()?.id || 0,
      name: formValues['name'],
      description: formValues['description'],
      neighborhoodId: this.neighborhoodService.neighborhoodSelected()!.id,
      latitude: this.neighborhoodService.neighborhoodLatitudeSelected()!,
      longitude: this.neighborhoodService.neighborhoodLongitudeSelected()!,
    };
  }

  loadStops() {
    // TODO: Firebase — leer colección /stops
    console.info('[GtuStopsService] loadStops: pendiente integración Firebase');
  }

  addStops(stop: Stops) {
    if (this.stopsSelected().some((s) => s.id === stop.id)) return;
    this.stopsSelected.update((prev) => [...prev, stop]);
  }

  removeStops(stop: Stops) {
    this.stopsSelected.update((prev) => prev.filter((s) => s.id !== stop.id));
  }

  clearStopsSelected() {
    this.stopsSelected.set([]);
  }

  createStop(form: Record<string, string>) {
    // TODO: Firebase — crear documento en /stops
    const stop = this.mapRecordFormToStop(form);
    const tempId = Date.now();
    this.stops.update((prev) => [...prev, { ...stop, id: tempId }]);
    console.info('[GtuStopsService] createStop: pendiente integración Firebase', stop);
  }

  deleteStop(id: string | number) {
    // TODO: Firebase — eliminar documento /stops/{id}
    this.stops.update((prev) => prev.filter((s) => s.id !== id));
    console.info('[GtuStopsService] deleteStop: pendiente integración Firebase', id);
  }

  stopSelectedToEdit(stop: Stops) {
    this.stopToEdit.set(stop);
    this.neighborhoodService.addNeighborhood(
      this.neighborhoodService.neighborhoods().find((n) => n.id === stop.neighborhoodId)!
    );
  }

  editStop(form: Record<string, string>) {
    // TODO: Firebase — actualizar documento /stops/{id}
    const stop = this.mapRecordFormToStop(form);
    this.stops.update((prev) =>
      prev.map((s) => (s.id === stop.id ? { ...s, ...stop } : s))
    );
    console.info('[GtuStopsService] editStop: pendiente integración Firebase', stop);
  }
}
