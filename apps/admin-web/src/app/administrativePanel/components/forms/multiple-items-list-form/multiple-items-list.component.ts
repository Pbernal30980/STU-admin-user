import { Component, inject, input } from '@angular/core';
import { GtuNeighborhoodsService } from '../../../services/gtu-neighborhoods.service';
import { MutipleItemsSelectedListComponent } from '../multiple-items-selected/multiple-items-selected.component';
import { GtuStopsService } from '../../../services/gtu-stops.service';

@Component({
  selector: 'app-multiple-items-list',
  imports: [MutipleItemsSelectedListComponent],
  templateUrl: './multiple-items-list.component.html',
})
export class MutipleItemsListComponent {
  bandera = input.required<boolean>();
  neighborhoodService = inject(GtuNeighborhoodsService);
  stopService = inject(GtuStopsService);
  isDropdownOpen = true;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  itemsToAdd = (item: any) => {
    this.bandera() ? this.neighborhoodService.addNeighborhoods(item)
    : this.stopService.addStops(item);
  }
}
