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
  selected = input<String>();
  isDropdownOpen = true;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  ngOnDestroy() {
    this.clear.emit();

  }
}
