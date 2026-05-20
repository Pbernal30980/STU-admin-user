import { Component, inject, signal, computed } from '@angular/core';
import { GtuNeighborhoodsService } from '../../../services/gtu-neighborhoods.service';
import { FormsComponent } from '../forms.component';
import { Neighborhood } from '../../../interfaces/models.interface';

@Component({
  selector: 'app-single-list-form',
  imports: [],
  templateUrl: './single-list-form-item-selected.component.html',
})
export class SingleListFormComponent {
  neighborhoodService = inject(GtuNeighborhoodsService);
  parentForm = inject(FormsComponent, { optional: true });

  isDropdownOpen = false;
  searchText = signal('');

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
    this.isDropdownOpen = true;
  }

  onInputFocus() {
    this.isDropdownOpen = true;
  }

  filteredNeighborhoods = computed(() => {
    const list = this.neighborhoodService.neighborhoods();
    const query = this.searchText().toLowerCase().trim();
    if (!query) return list;
    return list.filter(item => item.name.toLowerCase().includes(query));
  });

  inputValue = computed(() => {
    const selected = this.neighborhoodService.neighborhoodSelected();
    if (this.isDropdownOpen) {
      return this.searchText();
    }
    return selected ? selected.name : '';
  });

  selectNeighborhood(item: Neighborhood) {
    this.neighborhoodService.addNeighborhood(item);
    this.isDropdownOpen = false;
    this.searchText.set('');

    if (this.parentForm) {
      const lat = this.neighborhoodService.neighborhoodLatitudeSelected();
      const lng = this.neighborhoodService.neighborhoodLongitudeSelected();
      if (lat !== null && lng !== null) {
        this.parentForm.onLatitudSeleccionada(lat);
        this.parentForm.onLongitudSeleccionada(lng);
      }
    }
  }

  ngOnDestroy() {
    this.neighborhoodService.clearNeighborhoodsSelected();
  }
}
