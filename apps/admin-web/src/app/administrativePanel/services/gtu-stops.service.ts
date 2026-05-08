import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { StopsResponse } from '../interfaces/reponses.interface';
import { environment } from '../../../environments/environment';
import { GtuMapper } from '../mapper/gtu.mapper';
import { Stops } from '../interfaces/models.interface';
import { GtuNeighborhoodsService } from './gtu-neighborhoods.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class GtuStopsService {

  private http = inject(HttpClient);
  private router = inject(Router);
  neighborhoodService = inject(GtuNeighborhoodsService);
  stopToEdit = signal<Stops | null>(null);
  stopsSelected = signal<Stops[]>([]);
  stops = signal<Stops[]>([]);



  constructor() {
    this.loadStops();
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
    this.http.get<StopsResponse>(environment.backEndGTU_RouteStop + '/stops',
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
        observe: 'response',
      }
    )
      .subscribe({
        next: (response) => {
          const res = response.body!;
          const mapper = GtuMapper.mapDataStopsToStopsArray(res.data);
          this.stops.set(mapper);
        },
        error: (error) => {
          if (error.status === 401 && !environment.authBypass) {
            alert('No tienes permisos para acceder a las paradas. Por favor, vuelve a iniciar sesión.');
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          alert('Error al cargar las paradas: ' + error.error.message);
        }
      })
  }

  addStops(stop: Stops) {
    if (this.stopsSelected().some((item) => item.id === stop.id)) return;
    this.stopsSelected.update((prev) => [...prev, stop]);
  }

  removeStops(stop: Stops) {
    this.stopsSelected.update((prev) => prev.filter((item) => item.id !== stop.id));
  }

  clearStopsSelected() {
    this.stopsSelected.set([]);
  }

  createStop(form: Record<string, string>) {
    const stop = this.mapRecordFormToStop(form);
    this.http.post<StopsResponse>(environment.backEndGTU_RouteStop + '/stops', {
      name: stop.name,
      description: stop.description,
      neighborhoodId: stop.neighborhoodId,
      latitude: stop.latitude,
      longitude: stop.longitude,
    }, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
      },
      observe: 'response',
    })
      .subscribe({
        next: (response) => {
          const res = response.body!;
          if (!Array.isArray(res.data)) {
            const mapper = GtuMapper.mapDataStopsToStops(res.data);
            this.stops.update((prev) => [...prev, mapper]);
          }
        },
        error: (error) => {
          if (error.status === 401 && !environment.authBypass) {
            alert('No tienes permisos para crear a las paradas. Por favor, vuelve a iniciar sesión.');
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          alert('Error al crear la parada: ' + error.error.message);
        }
      });

  }

  deleteStop(id: number) {
    this.http.delete(environment.backEndGTU_RouteStop + '/stops/' + id,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
        },
        observe: 'response',
      }
    ).subscribe({
      next: (response) => {
        const res = response.body!;
        this.stops.update((prev) => prev.filter((item) => item.id !== id));
      },
      error: (error) => {
        if (error.status === 401 && !environment.authBypass) {
          alert('No tienes permisos para acceder a las paradas. Por favor, vuelve a iniciar sesión.');
          localStorage.clear();
          this.router.navigate(['/login']);
        }
        alert('Error al eliminar la parada: ' + error.error.message);
      }

    });
  }

  stopSelectedToEdit(stop: Stops) {
    this.stopToEdit.set(stop);
    this.neighborhoodService.addNeighborhood(this.neighborhoodService.neighborhoods().
      find((neighborhood) => neighborhood.id === stop.neighborhoodId)!);
  }

  editStop(form: Record<string, string>) {
    const stop = this.mapRecordFormToStop(form);
    this.stopToEdit.set(stop);
    this.http.put<StopsResponse>(environment.backEndGTU_RouteStop + '/stops', {
      id: this.stopToEdit()!.id,
      name: this.stopToEdit()!.name,
      description: this.stopToEdit()!.description,
      neighborhoodId: this.stopToEdit()!.neighborhoodId,
      latitude: this.stopToEdit()!.latitude,
      longitude: this.stopToEdit()!.longitude,
    }, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
      },
      observe: 'response',
    })
      .subscribe({
        next: (response) => {
          const res = response.body!;
          if (!Array.isArray(res.data)) {
            const mapper = GtuMapper.mapDataStopsToStops(res.data);
            this.stops.update((prev) => prev.map((item) => item.id === mapper.id ? mapper : item));
          }
        },
        error: (error) => {
          if (error.status === 401 && !environment.authBypass) {
            alert('No tienes permisos para acceder a las paradas. Por favor, vuelve a iniciar sesión.');
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          alert('Error al editar la parada: ' + error.error.message);
        }
      });
  }
}
