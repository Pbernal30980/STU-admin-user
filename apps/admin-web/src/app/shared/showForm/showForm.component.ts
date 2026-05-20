import { Component, input, output } from '@angular/core';
import { ToLisComponent } from "../../administrativePanel/components/list/list-component";
import { FormsComponent } from "../../administrativePanel/components/forms/forms.component";
import type { Form, Routes, Stops, User, Neighborhood } from '../../administrativePanel/interfaces/models.interface';

@Component({
  selector: 'app-show-form',
  imports: [ToLisComponent, FormsComponent],
  templateUrl: './showForm.component.html',
})
export class ShowFormComponent {
  titleList = input.required<string>();
  titleForm = input.required<string>();
  createItem = output<Record<string, string>>();
  itemToEdit = output<any>();
  editIem = output<Record<string,string>>();
  editTitle = input.required<string>();
  isEditing = input.required<boolean>();
  deleteItem = output<string | number>();
  form = input.required<Form[]>();
  list = input.required<Stops[] | Routes[] | User[] | Neighborhood[]>();
  bandera = input<string>();
  showMapSelector = input<boolean>(false);
  selectedLat = input<number | null>(null);
  selectedLng = input<number | null>(null);
  clearItemToEdit = output<void>();

  showForm = false;
  showFilter = input<boolean>(false);

  toggleForm(){
    this.showForm = !this.showForm;
    this.clearItemToEdit.emit();
  }
}