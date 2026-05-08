import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AssignDriverResponse } from '../interfaces/reponses.interface';
import { environment } from '../../../environments/environment';
import { GtuMapper } from '../mapper/gtu.mapper';
import { AssignDriver } from '../interfaces/models.interface';

@Injectable({
  providedIn: 'root'
})
export class GtuAssignDriverService {

  private http = inject(HttpClient);
  private router = inject(Router);
  assignDrivers = signal<AssignDriver[]>([]);

  constructor() {
    this.loadData();
  }


  loadData() {
    this.http.get<AssignDriverResponse>(environment.backEndGTU_AssignDriver + '/assignments', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
      },
      observe: 'response',
      params: {
        role: 'ADMIN',
      }
    }).subscribe({
      next: (response) => {
        const res = response.body!;
        const mapper = GtuMapper.mapDataAssignDriverToAssignDriverArray(res.data);
        this.assignDrivers.update((items) =>
          [...items, ...mapper]);
      },
      error: (error) => {
        if (error.status === 401 && !environment.authBypass) {
          alert('No tienes permisos para acceder a la asignacion de conductores. Por favor, vuelve a iniciar sesión.');
          localStorage.clear();
          this.router.navigate(['/login']);
        }
        alert('Error al cargar la asignacion de los conductores: ' + error.error.message);
      }
    })

  }
  createDriverAssignment(routeId : number, driverId: number) {
    this.http.post<AssignDriverResponse>(environment.backEndGTU_AssignDriver + '/assignments', {
      routeId: routeId,
      driverId: driverId,
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
            const mapper = GtuMapper.mapDataAssignDriverToAssignDriver(res.data);
            this.assignDrivers.update((prev) => [...prev, mapper]);
          }
        },
        error: (error) => {
          if (error.status === 401 && !environment.authBypass) {
            alert('No tienes permisos para acceder a la asignacion de los conductores. Por favor, vuelve a iniciar sesión.');
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          alert('Error al crear la asignacion de los conductores: ' + error.error.message);
        }
      });
  }

  deleteDriverAssignment(id: number) {
    this.http.delete(environment.backEndGTU_AssignDriver + '/assignments/' + id,
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
          this.assignDrivers.update((prev) => prev.filter((item) => item.id !== id));
        },
        error: (error) => {
          if (error.status === 401 && !environment.authBypass) {
            alert('No tienes permisos para acceder a la asignacion de los conductores. Por favor, vuelve a iniciar sesión.');
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          alert('Error al eliminar la asignacion de conductores: ' + error.error.message);
        }
      });
  }

}
