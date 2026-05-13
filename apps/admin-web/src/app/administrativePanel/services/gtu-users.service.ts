// TODO: Migrar a Firebase. Las llamadas HTTP al backend legacy han sido desactivadas.
import { Injectable, signal, inject } from '@angular/core';
import { User } from '../interfaces/models.interface';

@Injectable({ providedIn: 'root' })
export class GtuUsersService {

  users = signal<User[]>([]);
  userSelected = signal<User | null>(null);
  userDriver = signal<User[]>([]);

  constructor() {
    // Firebase integration pending — no HTTP calls made
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
    // TODO: Firebase — leer colección /users
    console.info('[GtuUsersService] loadUsers: pendiente integración Firebase');
  }

  addUser(user: User) {
    this.userSelected.set(user);
  }

  createUser(form: Record<string, string>) {
    // TODO: Firebase — crear documento en /users
    const user = this.mapRecordFormToUser(form);
    this.users.update((prev) => [...prev, user]);
    console.info('[GtuUsersService] createUser: pendiente integración Firebase', user);
  }

  deleteUser(id: number) {
    // TODO: Firebase — eliminar documento /users/{id}
    this.users.update((prev) => prev.filter((u) => u.id !== id));
    console.info('[GtuUsersService] deleteUser: pendiente integración Firebase', id);
  }

  clearUserSelected() {
    this.userSelected.set(null);
  }
}
