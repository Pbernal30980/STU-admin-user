import { Injectable, signal, inject } from '@angular/core';
import { Routes, Neighborhood, Stops } from '../interfaces/models.interface';
import { GtuNeighborhoodsService } from './gtu-neighborhoods.service';
import { GtuStopsService } from './gtu-stops.service';
import { GtuNotificationService } from './gtu-notification.service';
// Importaciones de Firebase
import { Firestore, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from '@angular/fire/firestore';
@Injectable({ providedIn: 'root' })
export class GtuRoutesService {
  neighborhoodsService = inject(GtuNeighborhoodsService);
  stopsService = inject(GtuStopsService);
  private firestore = inject(Firestore);
  private notificationService = inject(GtuNotificationService);
  // Referencia a la colección 'Rutas' en Firestore
  private routesCollection = collection(this.firestore, 'Rutas');
  routes = signal<Routes[]>([]);
  routeToEdit = signal<Routes | null>(null);
  routeSelected = signal<Routes | null>(null);
  constructor() {
    // Escucha en tiempo real de la colección Rutas
    this.loadRoutes();
  }
  mapRecordFormToRoute(formValues: Record<string, string>): Routes {
    return {
      id: this.routeToEdit()?.id || undefined,
      name: formValues['name'],
      description: formValues['description'],
      // Guardamos los IDs de los barrios y paradas seleccionados
      neighborhoods: this.neighborhoodsService.neighborhoodsSelected()
        .filter((n): n is Neighborhood => !!n && typeof n.id === 'string')
        .map((n) => n.id) as string[],
      stops: this.stopsService.stopsSelected()
        .filter((s): s is Stops => !!s && typeof s.id === 'string')
        .map((s) => s.id) as string[],
      startTime: formValues['startTime'],
      endTime: formValues['endTime'],
    };
  }
  loadRoutes() {
    onSnapshot(this.routesCollection, (snapshot) => {
      const mappedRoutes: Routes[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data['Nombre'] || 'Ruta sin nombre',
          description: data['Descripcion'] || '',
          neighborhoods: data['Barrios'] || [],
          stops: data['Paradas'] || [],
          startTime: data['HoraInicio'] || '',
          endTime: data['HoraFin'] || ''
        };
      });
      // Actualiza la tabla automáticamente
      this.routes.set(mappedRoutes);
    }, (error) => {
      console.error('[GtuRoutesService] Error al leer rutas:', error);
    });
  }
  addRoute(route: Routes) {
    this.routeSelected.set(route);
  }
  async createRoute(form: Record<string, string>) {
    const route = this.mapRecordFormToRoute(form);
    // Mapeo a español para Firebase
    const newRoute = {
      Nombre: route.name,
      Descripcion: route.description,
      Barrios: route.neighborhoods,
      Paradas: route.stops,
      HoraInicio: route.startTime,
      HoraFin: route.endTime
    };
    try {
      await addDoc(this.routesCollection, newRoute);
      console.info('[GtuRoutesService] Ruta creada exitosamente');
      this.notificationService.logChange('CREATE', `Se creó la ruta "${route.name}"`);
      
      // Limpiamos las selecciones temporales del formulario
      this.neighborhoodsService.neighborhoodsSelected.set([]);
      this.stopsService.stopsSelected.set([]);
    } catch (error) {
      console.error('[GtuRoutesService] Error al crear ruta:', error);
    }
  }
  async deleteRoute(id: string | number) {
    const routeObj = this.routes().find(r => r.id?.toString() === id.toString());
    const routeName = routeObj ? routeObj.name : `con ID ${id}`;

    try {
      const routeDocRef = doc(this.firestore, `Rutas/${id.toString()}`);
      await deleteDoc(routeDocRef);
      console.info('[GtuRoutesService] Ruta eliminada exitosamente');
      this.notificationService.logChange('DELETE', `Se eliminó la ruta "${routeName}"`);
    } catch (error) {
      console.error('[GtuRoutesService] Error al eliminar ruta:', error);
    }
  }
  routeSelectedToEdit(route: Routes) {
    this.routeToEdit.set(route);
    
    // Rellenamos las señales de selecciones previas para que el UI muestre qué barrios/paradas tenía
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
  async editRoute(form: Record<string, string>) {
    const route = this.mapRecordFormToRoute(form);
    
    if (!route.id) return;
    const routeData = {
      Nombre: route.name,
      Descripcion: route.description,
      Barrios: route.neighborhoods,
      Paradas: route.stops,
      HoraInicio: route.startTime,
      HoraFin: route.endTime
    };
    try {
      const routeDocRef = doc(this.firestore, `Rutas/${route.id}`);
      await updateDoc(routeDocRef, routeData);
      console.info('[GtuRoutesService] Ruta actualizada exitosamente');
      this.notificationService.logChange('EDIT', `Se actualizó la ruta "${route.name}"`);
      
      // Cerramos el modo edición y limpiamos
      this.routeToEdit.set(null);
      this.neighborhoodsService.neighborhoodsSelected.set([]);
      this.stopsService.stopsSelected.set([]);
    } catch (error) {
      console.error('[GtuRoutesService] Error al actualizar ruta:', error);
    }
  }
  clearRouteSelected() {
    this.routeSelected.set(null);
  }
}
