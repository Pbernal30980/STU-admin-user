import { Component, inject, input, signal, viewChild, viewChildren } from '@angular/core';
import {GoogleMap, MapAdvancedMarker, MapInfoWindow} from '@angular/google-maps';
import { apiKey } from '../../../../environments/apikey';
import { locationsInfo } from './locations-info';
import { Location, Neighborhood } from '../../interfaces/models.interface';
import { GtuNeighborhoodsService } from '../../services/gtu-neighborhoods.service';

@Component({
  selector: 'app-locations',
  imports: [GoogleMap, MapAdvancedMarker, MapInfoWindow],
  templateUrl: './locations.component.html',
})
export class LocationsComponent {
  infoWindowRef = viewChild.required(MapInfoWindow);
  neighborhoodItem = inject(GtuNeighborhoodsService);
  markersRef = viewChildren(MapAdvancedMarker);
  center = signal<google.maps.LatLngLiteral>({ lat: 4.0847, lng: -76.1954 });
  zoom = signal(14);
  env = apiKey.mapId;
  isEditing = input.required<boolean>();

  locations = signal<Location[]>(locationsInfo);

  openInfoWindow(location: Location,marker: MapAdvancedMarker) {
    const content = `<h2 class="font-bold text-xl">${location.name}</h1>`;
    this.infoWindowRef().open(marker,false,content);
  }

  goToLocation(location: Location, position : number) {
    const markers = this.markersRef();
    const markerRef = markers[position];
    this.openInfoWindow(location, markerRef);
  }

 }
