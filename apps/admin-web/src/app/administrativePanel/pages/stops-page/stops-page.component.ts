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
  isEditing = computed(() => this.valueEditItem() ? true : false);

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
      },
      {
        title: 'Latitud',
        type: 'number',
        id: 'latitude',
        value: signal((stop ? stop.latitude : 0).toString()),
        error: signal(null),
        validation: (val: string) => {
          const num = parseFloat(val);
          if (isNaN(num)) return 'Latitud debe ser un número válido';
          if (num < -90 || num > 90) return 'Latitud debe estar entre -90 y 90';
          return null;
        }
      },
      {
        title: 'Longitud',
        type: 'number',
        id: 'longitude',
        value: signal((stop ? stop.longitude : 0).toString()),
        error: signal(null),
        validation: (val: string) => {
          const num = parseFloat(val);
          if (isNaN(num)) return 'Longitud debe ser un número válido';
          if (num < -180 || num > 180) return 'Longitud debe estar entre -180 y 180';
          return null;
        }
      }
    ];
  });

  onDeleteItem(id: string | number) {
    this.service.deleteStop(id.toString());
  }

  onEditItem(stop: any) {
    this.service.stopSelectedToEdit(stop);
  }

  onCreateItem(formData: Record<string, string>) {
    this.service.createStop(formData);
  }

  onLatitudSeleccionada(lat: number) {
    const formArray = this.stopsForm();
    const formIndex = formArray.findIndex(f => f.id === 'latitude');
    if (formIndex !== -1) {
      formArray[formIndex].value.set(lat.toString());
    }
  }

  onLongitudSeleccionada(lng: number) {
    const formArray = this.stopsForm();
    const formIndex = formArray.findIndex(f => f.id === 'longitude');
    if (formIndex !== -1) {
      formArray[formIndex].value.set(lng.toString());
    }
  }
}
