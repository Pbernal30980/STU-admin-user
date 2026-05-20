import { Component, inject, input, output } from '@angular/core';
import { GtuNeighborhoodsService } from '../../../services/gtu-neighborhoods.service';
import { Routes, User } from '../../../interfaces/models.interface';

@Component({
  selector: 'app-selected-item-route-or-driver',
  imports: [],
  templateUrl: './selected-item-route-or-driver.component.html',
})
export class SelectedItemRouteOrDriverComponent {
  clear = output<void>();
  list = input.required<Routes[] | User[]>();
  title = input.required<string>();
  add = output<any>();
  selected = input<string>();
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectItem(item: any) {
    this.add.emit(item);
    this.isDropdownOpen = false;
  }

  ngOnDestroy() {
    this.clear.emit();
  }
}
