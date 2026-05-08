import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchPanelComponent } from './search-panel/search-panel.component';
import { SearchType } from '../../../interfaces/models.interface';
import { GtuRoutesService } from '../../../services/gtu-routes.service';
import { GtuStopsService } from '../../../services/gtu-stops.service';
import { InfoModalComponent } from "../../infoModal/infoModal.component";

@Component({
  selector: 'app-search-header',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchPanelComponent, InfoModalComponent],
  templateUrl: './search-header.component.html',
})
export class SearchHeaderComponent {
  searchTerm = signal<string>('');
  showInfo = signal(false);
  itemSelected = signal<any>(null);
  showPanel = signal(false);
  isExpanded = signal(false);
  serviceRoute = inject(GtuRoutesService);
  serviceStop = inject(GtuStopsService);

  constructor(private eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isExpanded.set(false);
      this.showPanel.set(false);
    }
  }

  expandSearchBar() {
    this.isExpanded.set(true);
    setTimeout(() => {
      this.showPanel.set(true);
    }, 300);
  }

  onResultSelected(result: SearchType) {
    this.serviceRoute.routes().forEach(route => {
      if (route.name === result.name) {
        this.itemSelected.set(route);
      }
    });
    this.serviceStop.stops().forEach(stop => {
      if (stop.name === result.name) {
        this.itemSelected.set(stop);
      }
    });
    this.showInfo.set(true);
    this.showPanel.set(false);
    this.isExpanded.set(false);
  }
  closeInfoModal() {
    this.showInfo.set(false);
    this.itemSelected.set(null);
  }


}
