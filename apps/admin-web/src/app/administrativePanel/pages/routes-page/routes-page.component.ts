import {Component, computed, inject, signal } from '@angular/core';
import type { Form } from '../../interfaces/models.interface';
import { HeaderComponent } from "../../components/header/header.component";
import { ShowFormComponent } from "../../../shared/showForm/showForm.component";
import { GtuRoutesService } from '../../services/gtu-routes.service';

@Component({
  selector: 'app-routes-page',
  imports: [HeaderComponent, ShowFormComponent],
  templateUrl: './routes-page.component.html',
})
export default class RoutesPageComponent {

  service = inject(GtuRoutesService);
  valueEditItem = computed(() => this.service.routeToEdit());
  isEditing = computed(()=>{return this.valueEditItem() ? true : false });


  routeForm = computed<Form[]>(() => {
      const route = this.valueEditItem();
      return[

    {
     title: 'Nombre de la ruta',
     type: 'text',
     id: 'name',
     value: signal(route ? route.name : ''),
     error: signal(null),
      validation: (val: string) => val.trim() === '' ? 'El nombre de la ruta es obligatorio' : null
    },
    {
     title: 'Descripcion',
     type: 'text',
     id: 'description',
      value: signal(route ? route.description : ''),
      error: signal(null),
      validation: (val: string) => val.trim() === '' ? 'La descripción es obligatoria' : null
    },
    {
     title: 'Horario de inicio',
     type: 'time',
     id: 'startTime' ,
     value: signal(route ? route.startTime : ''),
      error: signal(null),
      validation: (val: string) => val.trim() === '' ? 'El horario de inicio es obligatorio' : null
    },
    {
      title: 'Horario de Finalización',
      type: 'time',
      id: 'endTime',
      value: signal(route ? route.endTime : ''),
      error: signal(null),
      validation: (val: string) => val.trim() === '' ? 'El horario de finalización es obligatorio' : null
     },

   ]});



}
