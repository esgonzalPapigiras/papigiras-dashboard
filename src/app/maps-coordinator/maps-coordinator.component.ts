import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CoordinatorPosition } from 'app/models/coordinatorPosition';
import { CoordinatorService } from 'app/services/coordinator.service';
import { ToursServicesService } from 'app/services/tours-services.service';
import {
  GoogleMap,
  MapInfoWindow,
  MapMarker
} from '@angular/google-maps';

@Component({
  selector: 'app-maps-coordinator',
  templateUrl: './maps-coordinator.component.html',
  styleUrls: ['./maps-coordinator.component.scss']
})
export class MapsCoordinatorComponent implements OnInit {

  center: google.maps.LatLngLiteral = { lat: -36.8383, lng: -73.1015 };
  zoom = 13;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true
  };

  // Cada marcador guarda posición, opciones de estilo y el objeto coord original
  markers: Array<{
    position: google.maps.LatLngLiteral;
    options: google.maps.MarkerOptions;
    coord: CoordinatorPosition;
  }> = [];

  // Para el info-window
  selectedCoord: CoordinatorPosition | null = null;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  constructor(private coordinatorServices: CoordinatorService) {}

  ngOnInit(): void {
    this.coordinatorServices
      .getcoordinatorPosition()
      .subscribe(list => {
        this.markers = list.map(coord => ({
          position: {
            lat: coord.positionCoordinatorLatitud,
            lng: coord.positionCoordinatorLongitud
          },
          options: {
            // Vector: círculo de 12px de radio, color Google blue + borde blanco
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 12,
              fillColor: '#4285F4',
              fillOpacity: 0.9,
              strokeColor: '#FFFFFF',
              strokeWeight: 2
            }
          },
          label: {
      text: coord.coordinatorName.trim(), 
      color: '#333',
      fontSize: '12px',
      fontWeight: '600'
    },
          coord
        }));
      });
  }

  // Al hacer click, guardamos el coord y abrimos el InfoWindow
  openInfo(markerData: any, markerElem: MapMarker) {
    this.selectedCoord = markerData.coord;
    this.infoWindow.open(markerElem);
  }
}
