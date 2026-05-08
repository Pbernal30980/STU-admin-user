import { Component,input, output, signal } from "@angular/core";
import { Routes, Stops, User } from "../../interfaces/models.interface";
import { ConfirmModalComponent } from "../confirm-modal/confirm-modal.component";
import { CommonModule } from "@angular/common";
import { FiltersComponent } from "../filters/filters.component";
import { InfoModalComponent } from "../infoModal/infoModal.component";


@Component({
  selector: 'app-toList',
  templateUrl: './list-component.html',
  imports: [ConfirmModalComponent, CommonModule, FiltersComponent, InfoModalComponent],
})
export class ToLisComponent {
  reportsOpen = false;
  openForm = output<void>();
  itemToEdit = output<Stops | Routes | User>();
  deleteItem = output<number>();
  currentRole = localStorage.getItem('userRole');
  buttonName = input.required<string>();
  titlePage = input.required<string>();
  list = input.required<any>();
  showInfoModal = signal(false);

  isEdit = signal(false);
  showModal = signal(false);
  itemChosen = signal<null | Stops | Routes | User>(null);

  filter = input<boolean>(false);
  selectedFilters = signal<string[]>([]);

  filteredList() {
    if (this.selectedFilters().length === 0) return this.list();

    return this.list().filter((item: any) =>
      this.selectedFilters().includes(item.role)
    );
  }

  onFilterChange(filters: string[]) {
    this.selectedFilters.set(filters);
  }

  goToForm() {
    this.openForm.emit();
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  openModal(item: Stops | Routes | User) {
    this.itemChosen.set(item);
    this.showModal.set(true);
  }
  openInfoModal(item: Stops | Routes | User) {
    this.itemChosen.set(item);
    this.showInfoModal.set(true);
  }
  closeModal() {
    this.showModal.set(false);
    this.showInfoModal.set(false);
    this.itemChosen.set(null);
  }

  deleteItemList() {
    const id = this.itemChosen()?.id;
    id != null && typeof id === 'number' && this.deleteItem.emit(id);

  }

  editItemList() {
    this.goToForm();
    this.itemToEdit.emit(this.itemChosen()!);

  }

  confirmModal() {
      this.isEdit() ? this.editItemList()
      :     this.deleteItemList();
    this.showModal.set(false);
    this.itemChosen.set(null);

  }
}
