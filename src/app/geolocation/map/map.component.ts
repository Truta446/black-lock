import { Component, OnInit, OnDestroy } from '@angular/core';
import { tileLayer, latLng, marker, icon } from 'leaflet';
import { Subscription } from 'rxjs';

import { GeolocationService } from '../geolocation.service';
import { AccessPoint } from '../../interfaces/access-point';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  loadingMap: boolean;
  lat: number;
  lng: number;
  accessPoints: AccessPoint[];
  options: any;
  onContentSubscriptionReady?: Subscription;

  constructor(
    private geolocationService: GeolocationService
  ) {
    this.loadingMap = true;
    this.lat = 0;
    this.lng = 0;
    this.accessPoints = [];
    this.getGeolocation();
  }

  ngOnInit(): void {
    this.onContentSubscriptionReady = this.geolocationService.getAccessPoints()?.subscribe(accessPoints => {
      this.accessPoints = accessPoints;

      this.options = {
        layers: [
          tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              maxZoom: 18,
              attribution: '...'
            }
          ),
          marker([this.lat, this.lng], {
            icon: icon({
              iconSize: [ 25, 25 ],
              iconAnchor: [ 13, 13 ],
              iconUrl: 'assets/location.png',
              iconRetinaUrl: 'assets/location-2x.png',
            })
          }).bindTooltip('Minha localização', {
            permanent: false,
            opacity: 1,
            direction: 'top'
          })
        ],
        zoom: 12,
        center: latLng(this.lat, this.lng)
      };

      this.accessPoints.map(accessPoint => {
        if (accessPoint.location) {
          this.options.layers.push(
            marker(accessPoint.location, {
              icon: icon({
                iconSize: [ 25, 41 ],
                iconAnchor: [ 13, 41 ],
                iconUrl: 'assets/marker-icon.png',
                shadowUrl: 'assets/marker-shadow.png',
                iconRetinaUrl: 'assets/marker-icon-2x.png',
                tooltipAnchor: [ 0, -41 ]
              })
            }).bindTooltip(accessPoint.description, {
              permanent: false,
              opacity: 1,
              direction: 'top'
            })
          );
        }
      });

      this.loadingMap = false;
    });
  }

  ngOnDestroy(): void {
    this.onContentSubscriptionReady?.unsubscribe();
  }

  getGeolocation(): void {
    const geolocation = JSON.parse(localStorage.getItem('geolocation')!);

    this.lat = parseFloat(geolocation.latitude);
    this.lng = parseFloat(geolocation.longitude);
  }
}
