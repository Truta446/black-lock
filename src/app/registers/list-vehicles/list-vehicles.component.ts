import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { VehicleService } from 'src/app/services/vehicle.service';
import { Vehicle } from 'src/app/interfaces/vehicle';

@Component({
  selector: 'app-list-vehicles',
  templateUrl: './list-vehicles.component.html',
  styleUrls: ['./list-vehicles.component.scss']
})
export class ListVehiclesComponent implements OnInit, OnDestroy {
  loading = true;
  vehicles: Vehicle[] = [];
  onContentReady?: Subscription;
  subscription?: Subscription;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private vehicleService: VehicleService
  ) { }

  ngOnInit(): void {
    this.onContentReady = this.vehicleService.contentReady.subscribe(async () => {
      this.subscription = this.vehicleService.getAllVehicles()?.subscribe(vehicles => {
        this.vehicles = vehicles;
      });

      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.onContentReady?.unsubscribe();
    this.subscription?.unsubscribe();
  }

  showVehicle(vehicle: Vehicle): void {
    this.ngZone.run(() => {
      this.router.navigate(['/registers/motorcycle'], { queryParams: { vehicleId: vehicle.id } });
    });
  }
}
