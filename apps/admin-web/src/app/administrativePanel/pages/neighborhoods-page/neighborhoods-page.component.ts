import { Component, computed, inject, signal } from '@angular/core';
import type { Form } from '../../interfaces/models.interface';
import { HeaderComponent } from "../../components/header/header.component";
import { ShowFormComponent } from "../../../shared/showForm/showForm.component";
import { GtuNeighborhoodsService } from '../../services/gtu-neighborhoods.service';
import type { Neighborhood } from '../../interfaces/models.interface';

@Component({
  selector: 'app-neighborhoods-page',
  imports: [HeaderComponent, ShowFormComponent],
  templateUrl: './neighborhoods-page.component.html',
})
export default class NeighborhoodsPageComponent {

  service = inject(GtuNeighborhoodsService);
  valueEditItem = computed(() => this.service.neighborhoodSelected());
  isEditing = computed(()=>{return this.valueEditItem() ? true : false });

  neighborhoodsForm = computed<Form[]>(() => {
    const neighborhood = this.valueEditItem();

    return [
      {
        title: 'Nombre del barrio',
        type: 'text',
        id: 'name',
        value: signal(neighborhood ? neighborhood.name : ''),
        error: signal(null),
        validation: (val: string) => val.trim() === '' ? 'El nombre del barrio es obligatorio' : null
      }
    ];
  });

  // Manejar eventos del componente show-form
  onDeleteItem(id: string | number) {
    this.service.deleteNeighborhood(id.toString());
  }

  onEditItem(neighborhood: Neighborhood) {
    this.service.addNeighborhood(neighborhood);
  }

  onCreateItem(formData: Record<string, string>) {
    // Convertir Record<string, string> a Neighborhood
    const neighborhood: Omit<Neighborhood, 'id'> = {
      name: formData['name'] || ''
    };
    this.service.createNeighborhood(neighborhood);
  }

  // Manejar el evento itemToEdit que envía un Record<string, string>
  onItemToEdit(record: Record<string, string>) {
    const neighborhood: Neighborhood = {
      id: record['id'] || '',
      name: record['name'] || ''
    };
    this.service.addNeighborhood(neighborhood);
  }

  // Manejar el evento editIem que envía un Record<string,string>
  onEditIem(record: Record<string, string>) {
    const neighborhood: Neighborhood = {
      id: this.service.neighborhoodSelected()?.id || '',
      name: record['name'] || ''
    };
    this.service.updateNeighborhood(neighborhood);
  }

}