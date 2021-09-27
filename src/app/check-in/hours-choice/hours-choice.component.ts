import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { SystemService } from 'src/app/services/system.service';
import { UserService } from 'src/app/services/user.service';
import { Option } from 'src/app/interfaces/option';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-hours-choice',
  templateUrl: './hours-choice.component.html',
  styleUrls: ['./hours-choice.component.scss']
})
export class HoursChoiceComponent implements OnInit, OnDestroy {
  option: number;
  prices: Option[];
  vehicleId: string;
  onContentReady?: Subscription;
  subscription?: Subscription;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private toastr: ToastrService,
    private sys: SystemService,
    private userService: UserService
  ) {
    this.option = 0;
    this.prices = [
      { value: 0, time: '30 minutos', amount: 250, disabled: false },
      { value: 1, time: '1 horas', amount: 500, disabled: false },
      { value: 2, time: '2 horas', amount: 750, disabled: false },
      { value: 3, time: '4 horas', amount: 1000, disabled: false },
      { value: 4, time: '10 horas', amount: 1500, disabled: false },
    ];
    this.vehicleId = '';
  }

  ngOnInit(): void {
    const storage = this.sys.getDataToLocalStorage();
    this.option = storage?.checkIn?.hourOption?.value || 0;
    this.vehicleId = storage?.checkIn?.vehicleId;

    this.onContentReady = this.userService.contentReady.subscribe(() => {
      this.subscription = this.userService.getUser()?.subscribe((user: User) => {
        if (user.balance) {
          this.prices.forEach(price => {
            if (price.amount > user.balance!) {
              price.disabled = true;
            }
          });
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.onContentReady?.unsubscribe();
    this.subscription?.unsubscribe();
  }

  onChooseOption(): void {
    const data = this.prices.find(price => price.value === this.option);

    if (_.isEmpty(data)) {
      this.toastr.error('Escolha uma opção para continuar.');
      return;
    }

    this.sys.insertDataOnLocalStorage({
      checkIn: {
        hourOption: data,
        vehicleId: this.vehicleId
      }
    });

    this.ngZone.run(() => {
      this.router.navigate(['/check-in/payment-choice']);
    });
  }
}
