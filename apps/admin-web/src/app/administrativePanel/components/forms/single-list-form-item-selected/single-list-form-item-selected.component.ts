import { Component, ElementRef, inject, viewChild, AfterViewInit, ViewChild } from '@angular/core';
import { GtuNeighborhoodsService } from '../../../services/gtu-neighborhoods.service';

@Component({
  selector: 'app-single-list-form',
  imports: [],
  templateUrl: './single-list-form-item-selected.component.html',
})
export class SingleListFormComponent{

  neighborhoodService = inject(GtuNeighborhoodsService);
  isDropdownOpen = true;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  ngOnDestroy() {
    this.neighborhoodService.clearNeighborhoodsSelected();

  }
}
