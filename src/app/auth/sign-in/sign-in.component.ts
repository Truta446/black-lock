import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';

import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  @ViewChild('emailModel') emailModel!: NgModel;
  @ViewChild('passwordModel') passwordModel!: NgModel;
  email = '';
  password = '';
  hide = true;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  onSignin(): void {
    if (this.emailModel.invalid || this.passwordModel.invalid) {
      return;
    }

    this.auth.signin(this.email, this.password);
  }

  signInWithGoogle(): void {
    this.auth.signInWithGoogle();
  }
}
