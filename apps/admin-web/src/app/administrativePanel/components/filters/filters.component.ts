import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filters.component.html'
})
export class FiltersComponent {
  selectedFilters = input<string[]>([]);
  filterChange = output<string[]>();

  availableFilters = input<string[]>([]);

  isSelected(filter: string): boolean {
    return this.selectedFilters().includes(filter);
  }

  toggleFilter(filter: string): void {
    const index = this.selectedFilters().indexOf(filter);
    if (index >= 0) {
      this.selectedFilters().splice(index, 1);
    } else {
      this.selectedFilters().push(filter);
    }
    this.filterChange.emit([...this.selectedFilters()]);
  }
}
