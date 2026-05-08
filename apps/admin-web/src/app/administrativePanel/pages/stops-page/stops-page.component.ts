import { Component, computed, inject, signal } from '@angular/core';
import type { Form } from '../../interfaces/models.interface';
import { HeaderComponent } from "../../components/header/header.component";
import { ShowFormComponent } from "../../../shared/showForm/showForm.component";
import { GtuStopsService } from '../../services/gtu-stops.service';

@Component({
  selector: 'app-stops-page',
  imports: [HeaderComponent, ShowFormComponent],
  templateUrl: './stops-page.component.html',
})
export default class StopsPageComponent {

  service = inject(GtuStopsService);
  valueEditItem = computed(() => this.service.stopToEdit());
  isEditing = computed(()=>{return this.valueEditItem() ? true : false });

  stopsForm = computed<Form[]>(() => {
    const stop = this.valueEditItem();

    return [
      {
        title: 'Nombre de la parada',
        type: 'text',
        id: 'name',
        value: signal(stop ? stop.name : ''),
        error: signal(null),
        validation: (val: string) => val.trim() === '' ? 'El nombre de la parada es obligatorio' : null

      },
      {
        title: 'Descripción',
        type: 'text',
        id: 'description',
        value: signal(stop ? stop.description : ''),
        error: signal(null),
        validation: (val: string) => val.trim() === '' ? 'La descripción es obligatoria' : null
      }
    ];
  });


}
