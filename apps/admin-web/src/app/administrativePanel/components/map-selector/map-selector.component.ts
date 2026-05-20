import { Component, ElementRef, OnDestroy, OnInit, effect, input, output, signal, viewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-selector',
  imports: [],
  templateUrl: './map-selector.component.html',
})
export class MapSelectorComponent implements OnInit, OnDestroy {
  mapContainer = viewChild.required<ElementRef>('mapContainer');
  
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  center = signal<[number, number]>([4.0847, -76.1954]); // Coordenadas por defecto (Tuluá)
  selectedPosition = signal<[number, number] | null>(null);

  selectedLat = input<number | null>(null);
  selectedLng = input<number | null>(null);
   
  latitudeChanged = output<number>();
  longitudeChanged = output<number>();
   
  constructor() {
    effect(() => {
      const lat = this.selectedLat();
      const lng = this.selectedLng();
      if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        this.updatePosition(lat, lng);
      }
    });
  }

  ngOnInit() {
    // Inicializar mapa con un ligero timeout para asegurar que el contenedor esté renderizado en el DOM
    setTimeout(() => {
      this.initMap();
    }, 50);
  }

  private initMap() {
    if (this.map) return;

    const el = this.mapContainer().nativeElement;
    // Priorizar la posición seleccionada o usar la de por defecto
    const initialCoords = this.selectedPosition() || this.center();

    this.map = L.map(el, {
      zoomControl: true,
      attributionControl: false
    }).setView(initialCoords, 15);

    // Cargar capa de azulejos de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    // Pin de mapa animado y premium con los colores del tema de STU (stu-accent/emerald)
    const customIcon = L.divIcon({
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 shadow-lg">
          <div class="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      `,
      className: 'custom-map-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Crear marcador arrastrable
    this.marker = L.marker(initialCoords, {
      draggable: true,
      icon: customIcon
    }).addTo(this.map);

    // Manejar clics en el mapa para mover el marcador
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.updateMarker(lat, lng);
      this.emitCoordinates(lat, lng);
    });

    // Manejar el arrastre del marcador para actualizar coordenadas
    this.marker.on('dragend', () => {
      if (this.marker) {
        const position = this.marker.getLatLng();
        this.selectedPosition.set([position.lat, position.lng]);
        this.emitCoordinates(position.lat, position.lng);
      }
    });
  }

  private updatePosition(lat: number, lng: number) {
    this.selectedPosition.set([lat, lng]);
    
    if (this.map) {
      this.map.setView([lat, lng], this.map.getZoom());
    }
    
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    }
  }

  private updateMarker(lat: number, lng: number) {
    this.selectedPosition.set([lat, lng]);
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    }
  }

  private emitCoordinates(lat: number, lng: number) {
    this.latitudeChanged.emit(lat);
    this.longitudeChanged.emit(lng);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}