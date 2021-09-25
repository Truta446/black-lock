import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SystemService } from '../../system.service';
import { Option } from '../../interfaces/option'

@Component({
  selector: 'app-hours-choice',
  templateUrl: './hours-choice.component.html',
  styleUrls: ['./hours-choice.component.scss']
})
export class HoursChoiceComponent implements OnInit {
  option: Option;
  prices: Option[];

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private toastr: ToastrService,
    private sys: SystemService
  ) {
    this.option = {} as Option;
    this.prices = [
      { value: 0, time: '30 minutos', amount: 250 },
      { value: 1, time: '1 horas', amount: 500 },
      { value: 2, time: '2 horas', amount: 750 },
      { value: 3, time: '4 horas', amount: 1000 },
      { value: 4, time: '10 horas', amount: 1500 },
    ];
  }

  ngOnInit(): void {
  }

  onChooseOption(): void {
    if (_.isEmpty(this.option)) {
      this.toastr.error('Escolha uma opção para continuar.');
      return;
    }

    this.sys.insertDataOnLocalStorage({ checkIn: { hourOption: this.option } });

    this.ngZone.run(() => {
      this.router.navigate(['/check-in/payment-choice']);
    });
  }
}
