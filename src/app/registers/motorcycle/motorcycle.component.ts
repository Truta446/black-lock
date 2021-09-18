import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { VehicleService } from '../vehicle.service';
import { Vehicle } from '../../interfaces/vehicle';

@Component({
  selector: 'app-motorcycle',
  templateUrl: './motorcycle.component.html',
  styleUrls: ['./motorcycle.component.scss']
})
export class MotorcycleComponent implements OnInit, OnDestroy {
  @ViewChild('descriptionModel') descriptionModel!: NgModel;
  @ViewChild('plateModel') plateModel!: NgModel;
  @ViewChild('typeModel') typeModel!: NgModel;
  @ViewChild('yearModel') yearModel!: NgModel;
  description: string;
  plate: string;
  type: string;
  year: number;
  loading: boolean;
  onContentReady?: Subscription;
  subscription?: Subscription;

  constructor(
    private toastr: ToastrService,
    private vehicleService: VehicleService
  ) {
    this.description = '';
    this.plate = '';
    this.type = '';
    this.year = 0;
    this.loading = false;
  }

  ngOnInit(): void {
    this.getMotorcycle();
  }

  ngOnDestroy(): void {
    this.onContentReady?.unsubscribe();
    this.subscription?.unsubscribe();
  }

  getMotorcycle(): void {
    this.onContentReady = this.vehicleService.contentReady.subscribe(() => {
      this.subscription = this.vehicleService.getVehicle('')?.subscribe((vehicle: Vehicle) => {
        if (vehicle && Object.keys(vehicle).length > 0) {
          this.description = vehicle.description;
          this.plate = vehicle.plate;
          this.type = vehicle.type;
          this.year = vehicle.year;
        }
      });
    });
  }

  saveMotorcycle(): void {
    if (!this.onValidateUser()) {
      return;
    }

    const motorcycle = {
      description: this.description,
      plate: this.plate,
      type: this.type,
      year: this.year
    };

    this.vehicleService.createVehicle(motorcycle);

    this.toastr.success('Dados atualizados com sucesso.');
  }

  onValidateUser(): boolean {
    let count = 0;

    if (!this.description) {
      this.descriptionModel.control.markAsTouched();
      count += 1;
    }

    if (!this.plate) {
      this.plateModel.control.markAsTouched();
      count += 1;
    }

    if (!this.type) {
      this.typeModel.control.markAsTouched();
      count += 1;
    }

    if (!this.year) {
      this.yearModel.control.markAsTouched();
      count += 1;
    }

    if (count === 0) {
      return true;
    }

    return false;
  }
}
