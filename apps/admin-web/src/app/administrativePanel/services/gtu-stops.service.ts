import { Injectable, signal, inject } from '@angular/core';
import { Stops } from '../interfaces/models.interface';
import { GtuNeighborhoodsService } from './gtu-neighborhoods.service';
import { GtuNotificationService } from './gtu-notification.service';
// Importaciones de Firebase
import { Firestore, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class GtuStopsService {
  neighborhoodService = inject(GtuNeighborhoodsService);
  private firestore = inject(Firestore);
  private notificationService = inject(GtuNotificationService);
  
  // Referencia a la colección 'Paradas' en Firestore
  private stopsCollection = collection(this.firestore, 'Paradas');

  stopToEdit = signal<Stops | null>(null);
  stopsSelected = signal<Stops[]>([]);
  stops = signal<Stops[]>([]);

  constructor() {
    this.loadStops();
  }

  mapRecordFormToStop(formValues: Record<string, string>): Stops {
    // Priorizar coordenadas del formulario si están disponibles y son válidas
    const formLat = parseFloat(formValues['latitude'] || '0');
    const formLng = parseFloat(formValues['longitude'] || '0');
    const hasValidCoords = !isNaN(formLat) && !isNaN(formLng) && 
                         formLat !== 0 && formLng !== 0;

    return {
      id: this.stopToEdit()?.id || '',
      name: formValues['name'],
      description: formValues['description'],
      // Extraemos los datos del barrio seleccionado en el otro servicio
      neighborhoodId: this.neighborhoodService.neighborhoodSelected()!.id as string,
      latitude: hasValidCoords ? formLat : this.neighborhoodService.neighborhoodLatitudeSelected()!,
      longitude: hasValidCoords ? formLng : this.neighborhoodService.neighborhoodLongitudeSelected()!,
    };
  }

  loadStops() {
    onSnapshot(this.stopsCollection, (snapshot) => {
      const mappedStops: Stops[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data['Nombre'] || 'Sin nombre',
          description: data['Descripcion'] || '',
          neighborhoodId: data['BarrioId'] || '',
          latitude: data['Latitud'] || 0,
          longitude: data['Longitud'] || 0
        };
      });

      this.stops.set(mappedStops);
    }, (error) => {
      console.error('[GtuStopsService] Error al leer paradas:', error);
    });
  }

  async createStop(form: Record<string, string>) {
    const stop = this.mapRecordFormToStop(form);
    
    const newStop = {
      Nombre: stop.name,
      Descripcion: stop.description,
      BarrioId: stop.neighborhoodId,
      Latitud: stop.latitude,
      Longitud: stop.longitude
    };

    try {
      await addDoc(this.stopsCollection, newStop);
      console.info('[GtuStopsService] Parada creada exitosamente');
      this.notificationService.logChange('CREATE', `Se creó la parada "${stop.name}"`);
      
      // Limpiamos la selección del barrio
      this.neighborhoodService.clearNeighborhoodsSelected();
    } catch (error) {
      console.error('[GtuStopsService] Error al crear parada:', error);
    }
  }

  async deleteStop(id: string | number) {
    const stopObj = this.stops().find(s => s.id?.toString() === id.toString());
    const stopName = stopObj ? stopObj.name : `con ID ${id}`;

    try {
      const stopDocRef = doc(this.firestore, `Paradas/${id.toString()}`);
      await deleteDoc(stopDocRef);
      console.info('[GtuStopsService] Parada eliminada exitosamente');
      this.notificationService.logChange('DELETE', `Se eliminó la parada "${stopName}"`);
    } catch (error) {
      console.error('[GtuStopsService] Error al eliminar parada:', error);
    }
  }

  async editStop(form: Record<string, string>) {
    const stop = this.mapRecordFormToStop(form);
    if (!stop.id) return;

    const stopData = {
      Nombre: stop.name,
      Descripcion: stop.description,
      BarrioId: stop.neighborhoodId,
      Latitud: stop.latitude,
      Longitud: stop.longitude
    };

    try {
      const stopDocRef = doc(this.firestore, `Paradas/${stop.id}`);
      await updateDoc(stopDocRef, stopData);
      console.info('[GtuStopsService] Parada actualizada exitosamente');
      this.notificationService.logChange('EDIT', `Se actualizó la parada "${stop.name}"`);
      
      this.stopToEdit.set(null);
      this.neighborhoodService.clearNeighborhoodsSelected();
    } catch (error) {
      console.error('[GtuStopsService] Error al actualizar parada:', error);
    }
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

  stopSelectedToEdit(stop: Stops) {
    this.stopToEdit.set(stop);
    this.neighborhoodService.addNeighborhood(
      this.neighborhoodService.neighborhoods().find((n) => n.id === stop.neighborhoodId)!
    );
  }
}