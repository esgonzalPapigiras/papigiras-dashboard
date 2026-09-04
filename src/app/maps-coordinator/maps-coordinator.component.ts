import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { CoordinatorPosition } from 'app/models/coordinatorPosition';
import { CoordinatorService } from 'app/services/coordinator.service';
import { EMPTY, Subject, timer } from 'rxjs';
import { catchError, finalize, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-maps-coordinator',
  templateUrl: './maps-coordinator.component.html',
  styleUrls: ['./maps-coordinator.component.scss']
})
export class MapsCoordinatorComponent implements OnInit, OnDestroy {
  private readonly refreshIntervalMs = 30000;
  private readonly staleAfterMs = 5 * 60 * 1000;
  private readonly destroyed$ = new Subject<void>();

  center: google.maps.LatLngLiteral = { lat: -36.8383, lng: -73.1015 };
  zoom = 13;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true
  };

  markers: Array<{
    position: google.maps.LatLngLiteral;
    options: google.maps.MarkerOptions;
    coord: CoordinatorPosition;
  }> = [];

  selectedCoord: CoordinatorPosition | null = null;
  lastRefresh: Date | null = null;
  loadError: string | null = null;
  isRefreshing = false;

  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  constructor(private coordinatorServices: CoordinatorService) { }

  ngOnInit(): void {
    timer(0, this.refreshIntervalMs).pipe(
      takeUntil(this.destroyed$),
      switchMap(() => {
        this.isRefreshing = true;
        return this.coordinatorServices.getcoordinatorPosition().pipe(
          catchError(error => {
            console.error('Error refreshing coordinator positions', error);
            this.loadError = 'No se pudieron actualizar las ubicaciones.';
            return EMPTY;
          }),
          finalize(() => this.isRefreshing = false)
        );
      })
    ).subscribe(list => {
      this.loadError = null;
      this.lastRefresh = new Date();
      this.markers = list.map(coord => ({
        position: {
          lat: coord.positionCoordinatorLatitud,
          lng: coord.positionCoordinatorLongitud
        },
        options: {
          title: `${coord.coordinatorName} · ${this.getPositionStatus(coord)}`,
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 12,
            fillColor: this.isStale(coord) ? '#9E9E9E' : '#1B8F3A',
            fillOpacity: 0.95,
            strokeColor: '#FFFFFF',
            strokeWeight: 2
          }
        },
        coord
      }));
      setTimeout(() => this.fitMarkers(), 0);
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  openInfo(markerData: any, markerElem: MapMarker): void {
    this.selectedCoord = markerData.coord;
    this.infoWindow.open(markerElem);
  }

  isStale(coord: CoordinatorPosition | null): boolean {
    if (!coord?.createdAt) return true;
    const recordedAt = new Date(coord.createdAt).getTime();
    return Number.isNaN(recordedAt) ||
      Date.now() - recordedAt > this.staleAfterMs;
  }

  getPositionStatus(coord: CoordinatorPosition | null): string {
    return this.isStale(coord)
      ? 'Última ubicación conocida (sin actualización reciente)'
      : 'Ubicación actualizada recientemente';
  }

  private fitMarkers(): void {
    if (!this.map?.googleMap || this.markers.length === 0) return;
    if (this.markers.length === 1) {
      this.map.googleMap.setCenter(this.markers[0].position);
      this.map.googleMap.setZoom(15);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    this.markers.forEach(marker => bounds.extend(marker.position));
    this.map.googleMap.fitBounds(bounds, 60);
  }
}
