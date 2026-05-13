import { Injectable, signal, inject } from '@angular/core';
import { User } from '../interfaces/models.interface';
// Importamos onSnapshot en lugar de collectionData
import { Firestore, collection, addDoc, deleteDoc, doc, onSnapshot } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class GtuUsersService {
  private firestore = inject(Firestore);
  
  // Referencia directa a tu colección en la base de datos
  private usersCollection = collection(this.firestore, 'Usuarios');

  users = signal<User[]>([]);
  userSelected = signal<User | null>(null);
  userDriver = signal<User[]>([]);

  constructor() {
    // Iniciamos la escucha en tiempo real apenas arranca el servicio
    this.loadUsers();
  }

  loadUsers() {
    // onSnapshot es la función nativa de Firebase. Lee y reacciona a cambios en tiempo real
    // sin sufrir los bugs de tipado de las librerías intermedias de Angular.
    onSnapshot(this.usersCollection, (snapshot) => {
      
      const mappedUsers: User[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          // Añadimos un fallback (||) por si algún campo llega vacío y no rompa la vista
          name: data['Nombre'] || 'Sin nombre',
          email: data['Correo'] || 'Sin correo',
          // Estandarizamos el rol a mayúsculas y manejamos variaciones comunes
          role: (data['Rol'] || 'DRIVER').toString().toUpperCase().includes('ADMIN') ? 'ADMIN' : 
                (data['Rol'] || 'DRIVER').toString().toUpperCase().includes('CONDUCTOR') ? 'DRIVER' :
                (data['Rol'] || 'DRIVER').toString().toUpperCase(),
          password: 'Passw0rd',
          status: 'ACTIVE'
        };
      });

      // Actualizamos las señales. ¡La tabla en el HTML reaccionará sola!
      this.users.set(mappedUsers);
      
      // Estandarizamos a mayúsculas para evitar problemas de case sensitivity
      this.userDriver.set(mappedUsers.filter(u => 
        u.role.toUpperCase() === 'DRIVER' || u.role.toUpperCase() === 'ADMIN'
      ));
      
    }, (error) => {
      console.error('[GtuUsersService] Error al leer usuarios en tiempo real:', error);
    });
  }

  async createUser(form: Record<string, string>) {
    const newUser = {
      Nombre: `${form['name']} ${form['lastname']}`,
      Correo: `${form['name'].toLowerCase()}.${form['lastname'].toLowerCase()}@gtu.com`,
      Rol: form['role'].toUpperCase()
    };

    try {
      await addDoc(this.usersCollection, newUser);
      console.info('[GtuUsersService] Usuario creado exitosamente en Firebase');
    } catch (error) {
      console.error('[GtuUsersService] Error al crear usuario:', error);
    }
  }

  async deleteUser(id: string | number) {
    try {
      const userDocRef = doc(this.firestore, `Usuarios/${id.toString()}`);
      await deleteDoc(userDocRef);
      console.info('[GtuUsersService] Usuario eliminado de Firebase');
    } catch (error) {
      console.error('[GtuUsersService] Error al eliminar usuario:', error);
    }
  }

  addUser(user: User) {
    this.userSelected.set(user);
  }

  clearUserSelected() {
    this.userSelected.set(null);
  }
}
