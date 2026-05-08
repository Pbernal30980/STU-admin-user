import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { ShowFormComponent } from "../../../shared/showForm/showForm.component";
import { GtuUsersService } from '../../services/gtu-users.service';
import { Form } from '../../interfaces/models.interface';
import { FiltersComponent } from '../../components/filters/filters.component';

@Component({
  selector: 'app-users-page',
  imports: [HeaderComponent, ShowFormComponent],
  templateUrl: './users-page.component.html',
})
export default class UsersPageComponent {
  service = inject(GtuUsersService);

  //filters = ['ADMIN', 'DRIVER', 'MODERATOR'];


  usersForm = computed<Form[]>(() => {

    return [
      {
        title: 'Nombre del usuario',
        type: 'text',
        id: 'name',
        value: signal(''),
        error: signal(null),
        validation: (val: string) => val.trim() === '' ? 'El nombre del usuario es obligatorio' : null
      },
      {
        title: 'Apellido del usuario',
        type: 'text',
        id: 'lastname',
        value: signal(''),
        error: signal(null),
        validation: (val: string) => val.trim() === '' ? 'El apellido del usuario es obligatorio' : null
      },

      {
        title: 'Rol del usuario (DRIVER, ADMIN)',
        type: 'text',
        id: 'role',
        value: signal(''),
        error: signal(null),
        validation: (val: string) => val.trim() === '' ? 'El rol del usuario es obligatorio' :
        val !== 'DRIVER' && val !== 'ADMIN' ? 'El rol del usuario debe ser DRIVER o ADMIN' : null
      }
    ];
  });

 }
