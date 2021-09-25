import { Component, OnInit, OnDestroy } from '@angular/core';
import { tileLayer, latLng, marker, icon } from 'leaflet';
import { Subscription } from 'rxjs';

import { SystemService } from '../../system.service';
import { LotService } from '../../services/lot.service';
import { Lot } from '../../interfaces/lot';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  loadingMap: boolean;
  lat: number;
  lng: number;
  accessPoints: Lot[];
  options: any;
  onContentSubscriptionReady?: Subscription;

  constructor(
    private sys: SystemService,
    private lotService: LotService
  ) {
    this.loadingMap = true;
    this.lat = 0;
    this.lng = 0;
    this.accessPoints = [];
    this.getGeolocation();
  }

  ngOnInit(): void {
    this.onContentSubscriptionReady = this.lotService.getLots()?.subscribe(accessPoints => {
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
    const geolocation = this.sys.getDataToLocalStorage();

    this.lat = parseFloat(geolocation?.location?.latitude);
    this.lng = parseFloat(geolocation?.location?.longitude);
  }
}
