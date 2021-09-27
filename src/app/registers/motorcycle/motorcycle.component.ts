import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgModel } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { VehicleService } from 'src/app/services/vehicle.service';
import { Vehicle } from 'src/app/interfaces/vehicle';

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
  id?: string;
  description: string;
  plate: string;
  type: string;
  buttonName: string;
  year: number;
  loading: boolean;
  onContentReady?: Subscription;
  subscription?: Subscription;
  paramMapSubscription?: Subscription;

  constructor(
    private ngZone: NgZone,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private toastr: ToastrService,
    private vehicleService: VehicleService
  ) {
    this.description = '';
    this.plate = '';
    this.type = '';
    this.buttonName = '';
    this.year = 0;
    this.loading = false;
  }

  ngOnInit(): void {
    this.paramMapSubscription = this.route.queryParamMap.subscribe((queryParams) => {
      const id = queryParams.get('vehicleId') || '';

      if (id) {
        this.getMotorcycle(id);

        this.buttonName = 'Editar';
      } else {
        this.buttonName = 'Criar';
      }
    });
  }

  ngOnDestroy(): void {
    this.paramMapSubscription?.unsubscribe();
    this.onContentReady?.unsubscribe();
    this.subscription?.unsubscribe();
  }

  getMotorcycle(id: string): void {
    this.onContentReady = this.vehicleService.contentReady.subscribe(() => {
      this.subscription = this.vehicleService.getVehicle(id)?.subscribe((vehicle: Vehicle) => {
        if (!_.isEmpty(vehicle)) {
          this.id = vehicle.id;
          this.description = vehicle.description;
          this.plate = vehicle.plate;
          this.type = vehicle.type;
          this.year = vehicle.year;
        }
      });
    });
  }

  onChooseFunction(): void {
    if (!this.onValidateUser()) {
      this.toastr.error('Confira os dados inseridos e tente novamente.');
      return;
    }

    if (this.id) {
      this.saveMotorcycle();
    } else {
      this.createMotorcycle();
    }

    this.ngZone.run(() => {
      this.router.navigate(['/registers']);
    });
  }

  createMotorcycle(): void {
    const motorcycle = {
      description: this.description,
      plate: this.plate,
      type: this.type,
      year: this.year
    };

    this.vehicleService.createVehicle(motorcycle);

    this.toastr.success('Dados inseridos com sucesso.');
  }

  saveMotorcycle(): void {
    const motorcycle = {
      id: this.id,
      description: this.description,
      plate: this.plate,
      type: this.type,
      year: this.year
    };

    this.vehicleService.updateVehicle(motorcycle);

    this.toastr.success('Dados atualizados com sucesso.');
  }

  onValidateUser(): boolean {
    let count = 0;

    if (!this.description && this.description.length < 4) {
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

    if (this.year < 1950 || this.year > 2022) {
      this.yearModel.control.markAsTouched();
      this.yearModel.control.setErrors({ format: true });
      count += 1;
    }

    if (count === 0) {
      return true;
    }

    return false;
  }
}
