import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NeighborhoodResponse } from '../interfaces/reponses.interface';
import { Neighborhood } from '../interfaces/models.interface';
import { GtuMapper } from '../mapper/gtu.mapper';
import { locationsInfo } from '../components/locations/locations-info';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root'})
export class GtuNeighborhoodsService {

  private http = inject(HttpClient);
  private router = inject(Router);
  neighborhoodsSelected = signal<Neighborhood[]>([]);
  neighborhoodSelected = signal<Neighborhood | null>(null);
  neighborhoods = signal<Neighborhood[]>([]);
  neighborhoodLatitudeSelected = signal<number | null>(null);
  neighborhoodLongitudeSelected = signal<number | null>(null);

  constructor() {
    this.loadNeighboorhoods();

  }

  loadNeighboorhoods() {
    this.http.get<NeighborhoodResponse>(environment.backEndGTU_RouteStop + '/neighborhoods',{
      headers:{
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
      },
      observe: 'response'
    }).subscribe({
      next: (response) => {
      const res = response.body!;
      const mapper = GtuMapper.mapDataNeighborhoodToNeighborhoodArray(res.data);
      this.neighborhoods.set(mapper);
    },
      error: (error) => {
        if(error.status === 401 && !environment.authBypass) {
            alert('No tienes permisos para acceder a los barrios. Por favor, vuelve a iniciar sesión.');
            localStorage.clear();
            this.router.navigate(['/login']);
          }
        alert('Error al cargar los barrios: ' + error.error.message);
      }
    })

  }
  addNeighborhood(neighborhood: Neighborhood) {
      this.neighborhoodSelected.set(neighborhood);
      for(const location of locationsInfo) {
        if(location.name === neighborhood.name){
          this.neighborhoodLatitudeSelected.set(location.latitude);
          this.neighborhoodLongitudeSelected.set(location.longitude);
        }
      }
    }

  addNeighborhoods(neighborhood: Neighborhood) {
    if (this.neighborhoodsSelected().some((item) => item.id === neighborhood.id)) return;

    this.neighborhoodsSelected.update((prev) =>    [...prev, neighborhood]);
  }

  removeNeighborhood(neighborhood: Neighborhood) {
    this.neighborhoodsSelected.update((prev) => prev.filter((item) => item.id !== neighborhood.id));
  }

  clearNeighborhoodsSelected() {
    this.neighborhoodsSelected.set([]);
    this.neighborhoodSelected.set(null);
  }
}
