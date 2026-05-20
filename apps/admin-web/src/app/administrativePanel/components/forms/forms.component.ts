import { Component, ElementRef, input, output, signal, viewChildren } from '@angular/core';
import type { Form } from '../../interfaces/models.interface';
import { ToastComponent } from "../toast/toast.component";
import { MutipleItemsListComponent } from "./multiple-items-list-form/multiple-items-list.component";
import { SingleListFormComponent } from "./single-list-form-item-selected/single-list-form-item-selected.component";
import { MapSelectorComponent } from "../map-selector/map-selector.component";

@Component({
  selector: 'app-forms',
  imports: [ToastComponent, SingleListFormComponent, MutipleItemsListComponent, MapSelectorComponent],
  templateUrl: './forms.component.html',
})
export class FormsComponent {

  editItem = output<Record<string, string>>();
  createItem = output<Record<string, string>>();
  isEditing = input.required<boolean>();
  editTitle = input.required<string>();
  banderaRouteOrStop = input<string>();
  showMapSelector = input<boolean>(false);
  selectedLat = input<number | null>(null);
  selectedLng = input<number | null>(null);
  form = input.required<Form[]>();
  title = input.required<string>();
  comeBackList = output<void>();
  toastColor = signal('');
  toastMessage = signal('');

  onInputChange(item: Form, newValue: string) {
    item.value.set(newValue);

    if (item.validation && item.error) {
      const validationMessage = item.validation(newValue);
      item.error.set(validationMessage);
    }
  }

  goComeBackList() {
    this.comeBackList.emit();
  }

  inputs = viewChildren<ElementRef<HTMLInputElement>>('inputRef');

  sendForm() {
    this.toastColor.set('');
    this.toastMessage.set('');
    const formValues: Record<string, string> = {};
    this.inputs().forEach((input, index) => {
      const inputElement = input.nativeElement;
      formValues[this.form()[index].id] = inputElement.value;
    });

    for (const [key, value] of Object.entries(formValues)) {
      const field = this.form().find(field => field.id === key);
      if (field) {
        const validator = field.validation;
        const errorSignal = field.error;

        if (validator && errorSignal) {
          const error = validator(value);
          errorSignal.set(error);
          if (error) {
            setTimeout(() => {
              this.toastColor.set('red');
              this.toastMessage.set('Error en el formulario, por favor verifique los campos');
            }, 0);
            return;
          }
        }
      }
    }

    setTimeout(() => {
      this.toastColor.set('green');
      this.toastMessage.set('Formulario enviado correctamente');
    }, 0);
    this.isEditing() ? this.editItem.emit(formValues) : this.createItem.emit(formValues);

    this.inputs().forEach((input) => {
      const inputElement = input.nativeElement;
      inputElement.value = '';
    });
  }

  onLatitudSeleccionada(lat: number) {
    const latField = this.form().find(item => item.id === 'latitude');
    if (latField) {
      latField.value.set(lat.toString());
      if (latField.validation && latField.error) {
        latField.error.set(latField.validation(lat.toString()));
      }
    }
  }

  onLongitudSeleccionada(lng: number) {
    const lngField = this.form().find(item => item.id === 'longitude');
    if (lngField) {
      lngField.value.set(lng.toString());
      if (lngField.validation && lngField.error) {
        lngField.error.set(lngField.validation(lng.toString()));
      }
    }
  }

  getFormLat(): number | null {
    const latField = this.form().find(item => item.id === 'latitude');
    if (latField) {
      const val = parseFloat(latField.value() || '0');
      return isNaN(val) ? null : val;
    }
    return this.selectedLat();
  }

  getFormLng(): number | null {
    const lngField = this.form().find(item => item.id === 'longitude');
    if (lngField) {
      const val = parseFloat(lngField.value() || '0');
      return isNaN(val) ? null : val;
    }
    return this.selectedLng();
  }
}
