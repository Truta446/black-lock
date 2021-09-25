import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

import { UserService } from '../user.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  name;
  user: User;
  onContentReady?: Subscription;
  subscription?: Subscription;

  constructor(
    private auth: AuthService,
    private userService: UserService
  ) {
    this.name = '';
    this.user = {} as User;
  }

  ngOnInit(): void {
    this.onContentReady = this.userService.contentReady.subscribe(() => {
      this.subscription = this.userService.getUser()?.subscribe((user: User) => {
        this.user = user;

        if (this.user?.name) {
          this.setName();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.onContentReady?.unsubscribe();
    this.subscription?.unsubscribe();
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
