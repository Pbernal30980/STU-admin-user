import { Component, ElementRef, inject, input, OnDestroy, OnInit, effect, signal, viewChild } from '@angular/core';
import * as L from 'leaflet';
import { locationsInfo } from './locations-info';
import { Location } from '../../interfaces/models.interface';
import { GtuNeighborhoodsService } from '../../services/gtu-neighborhoods.service';

@Component({
  selector: 'app-locations',
  imports: [],
  templateUrl: './locations.component.html',
})
export class LocationsComponent implements OnInit, OnDestroy {
  mapContainer = viewChild.required<ElementRef>('mapContainer');
  neighborhoodItem = inject(GtuNeighborhoodsService);
  isEditing = input.required<boolean>();
  
  private map: L.Map | null = null;
  private markers: L.Marker[] = [];
  
  locations = signal<Location[]>(locationsInfo);
  center = signal<[number, number]>([4.0847, -76.1954]); // Tuluá

  constructor() {
    // Sincronizar el mapa cuando cambie el barrio seleccionado
    effect(() => {
      const selected = this.neighborhoodItem.neighborhoodSelected();
      const editing = this.isEditing();
      
      if (!editing && selected) {
        const location = this.locations().find(loc => loc.name === selected.name);
        if (location) {
          this.focusOnLocation(location);
        }
      } else if (editing && selected) {
        const location = this.locations().find(loc => loc.name === selected.name);
        if (location) {
          this.showSingleNeighborhoodMarker(location);
        }
      }
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.initMap();
    }, 50);
  }

  private initMap() {
    if (this.map) return;

    const el = this.mapContainer().nativeElement;
    this.map = L.map(el, {
      zoomControl: true,
      attributionControl: false
    }).setView(this.center(), 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    this.renderMarkers();
  }

  private renderMarkers() {
    if (!this.map) return;

    this.clearMarkers();

    const isEditMode = this.isEditing();
    const selected = this.neighborhoodItem.neighborhoodSelected();

    const customIcon = L.divIcon({
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 shadow-md">
          <div class="w-3.5 h-3.5 rounded-full bg-emerald-500"></div>
        </div>
      `,
      className: 'custom-map-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    if (isEditMode) {
      if (selected) {
        const location = this.locations().find(loc => loc.name === selected.name);
        if (location) {
          const marker = L.marker([location.latitude, location.longitude], { icon: customIcon })
            .addTo(this.map)
            .bindPopup(`<h2 class="font-bold text-sm text-stu-text">${location.name}</h2>`);
          this.markers.push(marker);
          this.map.setView([location.latitude, location.longitude], 15);
        }
      }
    } else {
      // Renderizar todos los marcadores en modo vista general
      this.locations().forEach((loc) => {
        const marker = L.marker([loc.latitude, loc.longitude], { icon: customIcon })
          .addTo(this.map!)
          .bindPopup(`<h2 class="font-bold text-sm text-stu-text">${loc.name}</h2>`);
        this.markers.push(marker);
      });
    }
  }

  private showSingleNeighborhoodMarker(location: Location) {
    if (!this.map) return;
    this.clearMarkers();

    const customIcon = L.divIcon({
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 shadow-md">
          <div class="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-bounce"></div>
        </div>
      `,
      className: 'custom-map-marker-bounce',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([location.latitude, location.longitude], { icon: customIcon })
      .addTo(this.map)
      .bindPopup(`<h2 class="font-bold text-sm text-stu-text">${location.name}</h2>`)
      .openPopup();
      
    this.markers.push(marker);
    this.map.setView([location.latitude, location.longitude], 15);
  }

  private focusOnLocation(location: Location) {
    if (!this.map) return;
    this.map.setView([location.latitude, location.longitude], 16);
    
    const marker = this.markers.find(m => {
      const latlng = m.getLatLng();
      return Math.abs(latlng.lat - location.latitude) < 0.0001 && 
             Math.abs(latlng.lng - location.longitude) < 0.0001;
    });
    
    if (marker) {
      marker.openPopup();
    }
  }

  goToLocation(location: Location, position: number): string {
    if (this.map) {
      const marker = this.markers[position];
      if (marker) {
        this.map.setView([location.latitude, location.longitude], 16);
        marker.openPopup();
      }
    }
    return '';
  }

  private clearMarkers() {
    this.markers.forEach(m => m.remove());
    this.markers = [];
  }

  ngOnDestroy() {
    this.clearMarkers();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
