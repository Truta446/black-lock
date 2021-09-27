import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

import { SystemService } from './system.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  confirmationResult: any;

  constructor(
    private ngZone: NgZone,
    private afAuth: AngularFireAuth,
    private router: Router,
    private sys: SystemService
  ) { }

  signin(email: string, password: string): void {
    this.sys.openLoading('Validando dados...');

    this.afAuth.signInWithEmailAndPassword(email, password)
    .then(_ => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.router.navigate(['/dashboard']);
        });
      }, 1000);
    })
    .finally(() => {
      this.sys.closeLoading();
    });
  }

  signInWithGoogle(): void {
    this.sys.openLoading();

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');

    this.afAuth.signInWithPopup(provider).then(async (result) => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.router.navigate(['/dashboard']);
        });
      }, 1000);
    })
    .finally(() => {
      this.sys.closeLoading();
    });
  }

  async signup(email: string, password: string): Promise<void> {
    await this.afAuth.createUserWithEmailAndPassword(email, password)
    .then(res => {
      res.user?.sendEmailVerification();
    })
    .finally(() => {
      this.sys.closeLoading();
    });
  }

  async resetPassword(email: string): Promise<void> {
    await this.afAuth.sendPasswordResetEmail(email).finally(() => {
      this.sys.closeLoading();
    });
  }

  async confirmPasswordReset(code: string, newPassword: string): Promise<void> {
    await this.afAuth.confirmPasswordReset(code, newPassword).finally(() => {
      this.sys.closeLoading();
    });
  }

  signOut(redirectTo = '/auth/home'): void {
    this.sys.openLoading('Saindo...');

    this.afAuth.signOut()
    .then(() => {
      this.router.navigate([redirectTo]);
    })
    .finally(() => {
      this.sys.closeLoading();
    });
  }
}
