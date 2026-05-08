import { Component, input, output, signal, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchLoadingComponent } from '../search-loading/search-loading.component';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { FiltersComponent } from '../../../filters/filters.component';
import { GtuStopsService } from '../../../../services/gtu-stops.service';
import { GtuRoutesService } from '../../../../services/gtu-routes.service';
import { SearchType } from '../../../../interfaces/models.interface';

@Component({
  selector: 'app-search-panel',
  standalone: true,
  imports: [CommonModule, SearchLoadingComponent, SearchResultsComponent, FiltersComponent],
  templateUrl: './search-panel.component.html',
})
export class SearchPanelComponent implements OnChanges {
  searchTerm = input<string>('');
  active = input<boolean>(false);
  resultSelected = output<SearchType>();
  filters = ['parada', 'ruta'];
  selectedFilters = signal<string[]>([]);
  loading = signal(false);
  rawResults = signal<SearchType[]>([]);

  private stopService = inject(GtuStopsService);
  private routeService = inject(GtuRoutesService);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['active']) this.active() ? this.loadData() : this.clearData();
  }

  loadData() {
    this.loading.set(true);
    setTimeout(() => {
      const stops = this.stopService.stops().map(s => ({ name: s.name, type: 'parada' as const }));
      const routes = this.routeService.routes().map(r => ({ name: r.name, type: 'ruta' as const }));
      const intercalados: SearchType[] = [];
      for (let i = 0; i < (Math.max(stops.length, routes.length)); i++) {
        if (routes[i]) intercalados.push(routes[i]);
        if (stops[i]) intercalados.push(stops[i]);
      }
      this.rawResults.set(intercalados);
      this.loading.set(false);
    }, 300);
  }

  clearData() { this.rawResults.set([]); }

  results() {
    const term = this.searchTerm().toLowerCase().trim();
    return this.rawResults().filter(item =>
      item.name.toLowerCase().includes(term) &&
      (this.selectedFilters().length === 0 || this.selectedFilters().includes(item.type))
    );
  }

  loadingState() { return this.loading(); }
  setFilters(filters: string[]) { this.selectedFilters.set(filters); }
}
