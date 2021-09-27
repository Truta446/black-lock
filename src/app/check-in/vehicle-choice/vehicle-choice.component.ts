import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { SystemService } from 'src/app/services/system.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Vehicle } from 'src/app/interfaces/vehicle';
import { Option } from 'src/app/interfaces/option';

@Component({
  selector: 'app-vehicle-choice',
  templateUrl: './vehicle-choice.component.html',
  styleUrls: ['./vehicle-choice.component.scss']
})
export class VehicleChoiceComponent implements OnInit, OnDestroy {
  loading: boolean;
  vehicleId: string;
  vehicles: Vehicle[];
  hourOption: Option;
  onContentReady?: Subscription;
  subscription?: Subscription;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private toastr: ToastrService,
    private sys: SystemService,
    private vehicleService: VehicleService
  ) {
    this.vehicleId = '';
    this.vehicles = [];
    this.loading = true;
    this.hourOption = {} as Option;
  }

  ngOnInit(): void {
    const storage = this.sys.getDataToLocalStorage();
    this.hourOption = storage?.checkIn?.hourOption || {} as Option;
    this.vehicleId = storage?.checkIn?.vehicleId || '';

    this.onContentReady = this.vehicleService.contentReady.subscribe(() => {
      this.subscription = this.vehicleService.getAllVehicles()?.subscribe(vehicles => {
        this.vehicles = vehicles;

        this.loading = false;
      });
    });
  }

  ngOnDestroy(): void {
    this.onContentReady?.unsubscribe();
    this.subscription?.unsubscribe();
  }

  onChooseOption(): void {
    if (!this.vehicleId) {
      this.toastr.error('Escolha uma opção para continuar.');
      return;
    }

    this.sys.insertDataOnLocalStorage({
      checkIn: {
        vehicleId: this.vehicleId,
        hourOption: this.hourOption
      }
    });

    this.ngZone.run(() => {
      this.router.navigate(['/check-in/hours-choice']);
    });
  }
}
