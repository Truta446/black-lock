import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { UserService } from '../../user.service';
import { ActivitiesService } from '../../activities/activities.service';
import { User } from '../../interfaces/user';
import { Activity } from '../../interfaces/activity';

@Component({
  selector: 'app-method',
  templateUrl: './method.component.html',
  styleUrls: ['./method.component.scss']
})
export class MethodComponent implements OnInit, OnDestroy {
  form: FormGroup;
  onContentReady?: Subscription;
  subscription?: Subscription;
  user: User;

  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    private userService: UserService,
    private activitiesService: ActivitiesService,
    private router: Router
  ) {
    this.form = this.fb.group({
      method: [''],
      credit: [{}]
    });
    this.user = {} as User;
  }

  ngOnInit(): void {
    this.onContentReady = this.userService.contentReady.subscribe(() => {
      this.subscription = this.userService.getUser()?.subscribe((user: User) => {
        this.user = user;
      });
    });
  }

  ngOnDestroy(): void {
    this.onContentReady?.unsubscribe();
    this.subscription?.unsubscribe();
  }

  async addBalance(): Promise<void> {
    try {
      const addBalance = JSON.parse(localStorage.getItem('addBalance')!);
      const newBalance = Number(this.user?.balance) + parseFloat(addBalance.amountCents);

      await this.userService.addBalance(newBalance);

      const data: Activity = {
        amount: parseFloat(addBalance.amountCents),
        description: 'Recarga de saldo',
        startHour: moment().format('YYYY-MM-DD HH:mm:ss'),
        endHour: moment().format('YYYY-MM-DD HH:mm:ss'),
        type: 'ADD',
        vehicleId: ''
      };

      await this.activitiesService.addActivity(data);

      localStorage.removeItem('addBalance');

      this.ngZone.run(() => {
        this.router.navigate(['/dashboard']);
      });
    } catch (err) {
      console.log(err);
    }
  }
}
