import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

import { SystemService } from 'src/app/services/system.service';
import { UserService } from 'src/app/services/user.service';
import { ActivitiesService } from '../../services/activities.service';
import { CheckInService } from '../../services/check-in.service';
import { Activity } from 'src/app/interfaces/activity';
import { CheckIn } from 'src/app/interfaces/check-in';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-payment-choice',
  templateUrl: './payment-choice.component.html',
  styleUrls: ['./payment-choice.component.scss']
})
export class PaymentChoiceComponent implements OnInit {
  option: string;
  methods: any[];
  user: User;
  onContentReady?: Subscription;
  subscription?: Subscription;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private toastr: ToastrService,
    private sys: SystemService,
    private userService: UserService,
    private checkInService: CheckInService,
    private activitiesService: ActivitiesService
  ) {
    this.option = '';
    this.methods = [
      { value: 'DEBIT', name: 'Debitar do meu saldo', disabled: false },
      { value: 'CREDIT_CARD', name: 'Cartão de crédito', disabled: true },
      { value: 'PIX', name: 'PIX', disabled: true },
    ];
    this.user = {} as User;
  }

  ngOnInit(): void {
    this.onContentReady = this.userService.contentReady.subscribe(() => {
      this.subscription = this.userService.getUser()?.subscribe((user: User) => {
        this.user = user;
      });
    });
  }

  async checkIn(): Promise<void> {
    try {
      this.sys.openLoading('Check-in em criação...');

      const data = this.sys.getDataToLocalStorage();
      const newBalance = Number(this.user?.balance) - Number(data.checkIn.hourOption.amount);
      const add = data.checkIn.hourOption.time.split(' ')[0];
      const unit = data.checkIn.hourOption.value ? 'hours' : 'minutes';
      const endHour = moment().add(add, unit).format();

      const checkIn: CheckIn = {
        amount: data.checkIn.hourOption.amount,
        endHour,
        vehicleId: data.checkIn.vehicleId,
        lotId: data.lot.id,
        method: this.option,
        insertedAt: moment().format(),
      };

      const id = await this.checkInService.createCheckIn(checkIn);

      await this.userService.updateUser({
        currentActiveCheckIn: id,
        balance: newBalance
      });

      const activity: Activity = {
        amount: data.checkIn.hourOption.amount,
        description: `Check-in na vaga ${data.lot.description}`,
        startHour: moment().format(),
        endHour,
        type: 'CHECKIN',
        vehicleId: data.checkIn.vehicleId
      };

      await this.activitiesService.addActivity(activity);

      this.sys.insertDataOnLocalStorage({ checkIn: {} });

      this.toastr.success('Check-in iniciado com sucesso!');

      this.ngZone.run(() => {
        this.router.navigate(['/']);
      });
    } catch (error) {
      console.error('error', error);
    } finally {
      this.sys.closeLoading();
    }
  }
}
