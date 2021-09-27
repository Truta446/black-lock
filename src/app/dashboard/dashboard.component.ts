import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, timer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { AuthService } from '../services/auth.service';
import { SystemService } from 'src/app/services/system.service';
import { UserService } from 'src/app/services/user.service';
import { CheckInService } from '../services/check-in.service';
import { LotService } from '../services/lot.service';
import { ActivitiesService } from '../services/activities.service';
import { VehicleService } from '../services/vehicle.service';
import { User } from '../interfaces/user';
import { CheckIn } from '../interfaces/check-in';
import { Activity } from '../interfaces/activity';
import { Lot } from '../interfaces/lot';
import { Vehicle } from '../interfaces/vehicle';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  name: string;
  timeLeft: string;
  user: User;
  checkIn: CheckIn;
  lot: Lot;
  vehicles: Vehicle[];
  onContentReady?: Subscription;
  subscription?: Subscription;
  checkInSubscription?: Subscription;
  lotSubscription?: Subscription;
  vehicleSubscription?: Subscription;
  timer$: Observable<number>;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private toastr: ToastrService,
    private auth: AuthService,
    private sys: SystemService,
    private userService: UserService,
    private checkInService: CheckInService,
    private lotService: LotService,
    private activitiesService: ActivitiesService,
    private vehicleService: VehicleService
  ) {
    this.name = '';
    this.user = {} as User;
    this.checkIn = {} as CheckIn;
    this.lot = {} as Lot;
    this.vehicles = [];
    this.timeLeft = moment().format();
    this.timer$ = timer(0, 1000);
  }

  ngOnInit(): void {
    this.onContentReady = this.userService.contentReady.subscribe(() => {
      this.subscription = this.userService.getUser()?.subscribe((user: User) => {
        this.user = user;

        if (this.user?.name) {
          this.setName();
        }

        if (this.user.currentActiveCheckIn) {
          this.checkInSubscription = this.checkInService.getCheckIn(this.user.currentActiveCheckIn)?.subscribe(checkIn => {
            this.checkIn = checkIn;

            this.timeLeft = moment(this.checkIn.endHour).format('YYYY-MM-DDTHH:mm:ss.msz');

            this.lotSubscription = this.lotService.getLotDetails(this.checkIn.lotId)?.subscribe(lot => {
              this.lot = lot;
            });
          });
        }

        this.vehicleSubscription = this.vehicleService.getAllVehicles()?.subscribe(vehicles => {
          this.vehicles = vehicles;
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.onContentReady?.unsubscribe();
    this.subscription?.unsubscribe();
    this.checkInSubscription?.unsubscribe();
    this.lotSubscription?.unsubscribe();
    this.vehicleSubscription?.unsubscribe();
  }

  initCheckIn(): void {
    if (this.vehicles.length === 0) {
      this.toastr.error('Você não possui veículos cadastrados.');
      return;
    }

    if (Number(this.user?.balance) < 250) {
      this.toastr.error('Você não possui dinheiro suficiente para estacionar.');
      return;
    }

    if (this.user.currentActiveCheckIn) {
      this.toastr.error('Libere a vaga para utilizar uma nova.');
      return;
    }

    this.ngZone.run(() => {
      this.router.navigate(['/check-in']);
    });
  }

  async checkout(): Promise<void> {
    try {
      this.sys.openLoading('Check-in em criação...');

      await this.userService.updateUser({ currentActiveCheckIn: '' });

      const activity: Activity = {
        amount: 0,
        description: `Check-out na vaga ${this.lot.description}`,
        startHour: moment().format(),
        endHour: moment().format(),
        type: 'CHECKOUT',
        vehicleId: this.checkIn.vehicleId
      };

      await this.activitiesService.addActivity(activity);

      this.toastr.success('Check-out realizado com sucesso!');
    } catch (error) {
      console.error('error', error);
    } finally {
      this.sys.closeLoading();
    }
  }

  setName(): void {
    if (this.user.name.length >= 30) {
      const firstName = this.user.name.split(' ').slice(0, 1).join(' ');
      const lastName = this.user.name.split(' ').slice(-1).join(' ');
      this.name = `${firstName} ${lastName}`;
      return;
    }

    this.name = this.user.name;
  }

  logout(): void {
    this.auth.signOut();
  }
}
