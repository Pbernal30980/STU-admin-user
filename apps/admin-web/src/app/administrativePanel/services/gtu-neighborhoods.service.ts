// TODO: Migrar a Firebase. Las llamadas HTTP al backend legacy han sido desactivadas.
import { Injectable, signal } from '@angular/core';
import { Neighborhood } from '../interfaces/models.interface';
import { locationsInfo } from '../components/locations/locations-info';

@Injectable({ providedIn: 'root' })
export class GtuNeighborhoodsService {

  neighborhoodsSelected = signal<Neighborhood[]>([]);
  neighborhoodSelected = signal<Neighborhood | null>(null);
  neighborhoods = signal<Neighborhood[]>([]);
  neighborhoodLatitudeSelected = signal<number | null>(null);
  neighborhoodLongitudeSelected = signal<number | null>(null);

  constructor() {
    // Firebase integration pending — no HTTP calls made
  }

  loadNeighboorhoods() {
    // TODO: Firebase — leer colección /neighborhoods
    console.info('[GtuNeighborhoodsService] loadNeighboorhoods: pendiente integración Firebase');
  }

  addNeighborhood(neighborhood: Neighborhood) {
    this.neighborhoodSelected.set(neighborhood);
    for (const location of locationsInfo) {
      if (location.name === neighborhood.name) {
        this.neighborhoodLatitudeSelected.set(location.latitude);
        this.neighborhoodLongitudeSelected.set(location.longitude);
      }
    }
  }

  addNeighborhoods(neighborhood: Neighborhood) {
    if (this.neighborhoodsSelected().some((n) => n.id === neighborhood.id)) return;
    this.neighborhoodsSelected.update((prev) => [...prev, neighborhood]);
  }

  removeNeighborhood(neighborhood: Neighborhood) {
    this.neighborhoodsSelected.update((prev) => prev.filter((n) => n.id !== neighborhood.id));
  }

  clearNeighborhoodsSelected() {
    this.neighborhoodsSelected.set([]);
    this.neighborhoodSelected.set(null);
  }
}
