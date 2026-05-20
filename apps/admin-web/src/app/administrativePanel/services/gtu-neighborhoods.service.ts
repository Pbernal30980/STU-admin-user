import { Injectable, signal, inject } from '@angular/core';
import { Neighborhood } from '../interfaces/models.interface';
import { locationsInfo } from '../components/locations/locations-info';
import { GtuNotificationService } from './gtu-notification.service';
// Importaciones de Firebase
import { Firestore, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class GtuNeighborhoodsService {
  private firestore = inject(Firestore);
  private notificationService = inject(GtuNotificationService);
  
  // Referencia a la colección 'Barrios' en Firestore
  private neighborhoodsCollection = collection(this.firestore, 'Barrios');

  neighborhoodsSelected = signal<Neighborhood[]>([]);
  neighborhoodSelected = signal<Neighborhood | null>(null);
  neighborhoods = signal<Neighborhood[]>([]);
  neighborhoodLatitudeSelected = signal<number | null>(null);
  neighborhoodLongitudeSelected = signal<number | null>(null);

  constructor() {
    // Escucha en tiempo real
    this.loadNeighboorhoods();
  }

  loadNeighboorhoods() {
    onSnapshot(this.neighborhoodsCollection, (snapshot) => {
      const mappedNeighborhoods: Neighborhood[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data['Nombre'] || 'Barrio sin nombre'
        };
      });

      this.neighborhoods.set(mappedNeighborhoods);
    }, (error) => {
      console.error('[GtuNeighborhoodsService] Error al leer barrios:', error);
    });
  }

  // CRUD operations for barrios
  async createNeighborhood(neighborhood: Omit<Neighborhood, 'id'>): Promise<void> {
    try {
      await addDoc(this.neighborhoodsCollection, {
        Nombre: neighborhood.name
      });
      console.info('[GtuNeighborhoodsService] Barrio creado exitosamente');
      this.notificationService.logChange('CREATE', `Se creó el barrio "${neighborhood.name}"`);
    } catch (error) {
      console.error('[GtuNeighborhoodsService] Error al crear barrio:', error);
      throw error;
    }
  }

  async updateNeighborhood(neighborhood: Neighborhood): Promise<void> {
    if (!neighborhood.id) {
      throw new Error('ID del barrio es requerido para actualizar');
    }
    try {
      const neighborhoodDocRef = doc(this.firestore, `Barrios/${neighborhood.id}`);
      await updateDoc(neighborhoodDocRef, {
        Nombre: neighborhood.name
      });
      console.info('[GtuNeighborhoodsService] Barrio actualizado exitosamente');
      this.notificationService.logChange('EDIT', `Se actualizó el barrio "${neighborhood.name}"`);
    } catch (error) {
      console.error('[GtuNeighborhoodsService] Error al actualizar barrio:', error);
      throw error;
    }
  }

  async deleteNeighborhood(id: string): Promise<void> {
    const neighborhoodObj = this.neighborhoods().find(n => n.id === id);
    const neighborhoodName = neighborhoodObj ? neighborhoodObj.name : `con ID ${id}`;

    try {
      const neighborhoodDocRef = doc(this.firestore, `Barrios/${id}`);
      await deleteDoc(neighborhoodDocRef);
      console.info('[GtuNeighborhoodsService] Barrio eliminado exitosamente');
      this.notificationService.logChange('DELETE', `Se eliminó el barrio "${neighborhoodName}"`);
    } catch (error) {
      console.error('[GtuNeighborhoodsService] Error al eliminar barrio:', error);
      throw error;
    }
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