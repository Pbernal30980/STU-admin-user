import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GtuMapper } from '../mapper/gtu.mapper';
import { UsersResponse } from '../interfaces/reponses.interface';
import { User } from '../interfaces/models.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GtuUsersService {

  private http = inject(HttpClient);
  private router = inject(Router);
  users = signal<User[]>([]);
  userSelected = signal<User | null>(null);
  userDriver = signal<User[]>([]);

  constructor() {
    this.loadUsers();
  }

  mapRecordFormToUser(formValues: Record<string, string>): User {
    return {
      name: formValues['name'] + ' ' + formValues['lastname'],
      email: formValues['name'].toLowerCase() + '.' + formValues['lastname'].toLowerCase() + '@gtu.com',
      password: 'Passw0rd',
      role: formValues['role'],
      status: 'ACTIVE',
    };
  }

  loadUsers() {
    this.http.get<UsersResponse>(environment.backEndGTU_Users + '/users', {
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
        const mapper = GtuMapper.mapDataUsersToUserArray(res.data);
        this.users.update((items) =>
          [...items, ...mapper]);
      },
      error: (error) => {
        if (error.status === 401 && !environment.authBypass) {
          alert('No tienes permisos para acceder a los usuarios. Por favor, vuelve a iniciar sesión.');
          localStorage.clear();
          this.router.navigate(['/login']);
        }
        alert('Error al cargar los usuarios: ' + error.error.message);
      }
    })

    this.http.get<UsersResponse>(environment.backEndGTU_Users + '/users', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
      },
      params: {
        role: 'DRIVER',
      },
      observe: 'response',
    }).subscribe({
      next: (response) => {
        const res = response.body!;
        const mapper = GtuMapper.mapDataUsersToUserArray(res.data);
        this.users.update((items) => [...items, ...mapper]);
        this.userDriver.set(mapper);
      },
      error: (error) => {
        if (error.status === 401 && !environment.authBypass) {
          alert('No tienes permisos para acceder a los usuarios. Por favor, vuelve a iniciar sesión.');
          localStorage.clear();
          this.router.navigate(['/login']);
        }
        alert('Error al cargar los usuarios: ' + error.error.message);
      }
    })
  }


  addUser(user: User) {
    this.userSelected.set(user);
  }
  createUser(form: Record<string, string>) {
    const user = this.mapRecordFormToUser(form);
    this.http.post<UsersResponse>(environment.backEndGTU_Users + '/users', {
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      status: user.status,
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
            const mapper = GtuMapper.mapDataUsersToUser(res.data);
            this.users.update((prev) => [...prev, mapper]);
          }
        },
        error: (error) => {
          if (error.status === 401 && !environment.authBypass) {
            alert('No tienes permisos para acceder a los usuarios. Por favor, vuelve a iniciar sesión.');
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          alert('Error al crear el usuario: ' + error.error.message);
        }
      });
  }

  deleteUser(id: number) {
    this.http.delete(environment.backEndGTU_Users + '/users/' + id,
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
          this.users.update((prev) => prev.filter((item) => item.id !== id));
        },
        error: (error) => {
          if (error.status === 401 && !environment.authBypass) {
            alert('No tienes permisos para acceder a los usuarios. Por favor, vuelve a iniciar sesión.');
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          alert('Error al eliminar el usuario: ' + error.error.message);
        }
      });
  }
  clearUserSelected() {
    this.userSelected.set(null);
  }
}








