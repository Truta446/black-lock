import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SystemService } from '../system.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  confirmationResult: any;
  shouldUpdatePhone;

  constructor(
    private sys: SystemService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private afFunc: AngularFireFunctions
  ) { }

  sendSignInLinkToEmail(email, actionCodeSettings = {}) {
    this.sys.openLoading();
    const codeSettigns = Object.assign({
      url: `${environment.appDomain}/cadastro/email`,
      handleCodeInApp: true
    }, actionCodeSettings);
    return this.afAuth.sendSignInLinkToEmail(email, codeSettigns).then(() => {
      this.sys.closeLoading();
      return true;
    })
    .catch((reason) => {
      this.sys.closeLoading();
      console.log(reason);
      this.sys.openDialog('Enviar link', 'Não foi possível enviar o link');
      throw reason;
    });
  }

  async signInWithEmailLink(email, emailLink) {
    this.sys.openLoading('Validando email...');
    if (await this.afAuth.isSignInWithEmailLink(emailLink)) {
      return this.afAuth.signInWithEmailLink(email, emailLink).finally(() => {
        this.sys.closeLoading();
      });
    } else {
      return null;
    }
  }

  async signInWithGoogle(redirectTo = '/dashboard') {
    this.sys.openLoading();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');

    return this.afAuth.signInWithPopup(provider).then(async (result) => {
      this.router.navigate([redirectTo]);
      return result;
    })
    .finally(() => {
      this.sys.closeLoading();
    });
  }


  signOut(redirectTo = '/cadastro/home') {
    this.sys.openLoading();
    this.afAuth.signOut()
    .then(() => {
      this.router.navigate([redirectTo]);
    })
    .finally(() => {
      this.sys.closeLoading();
    });
  }

  signInWithPhoneNumber(phone, recaptchaVerifier) {
    this.sys.openLoading('Enviando código de confirmação...');
    return this.afAuth.signInWithPhoneNumber(phone, recaptchaVerifier)
      .then((confirmationResult) => {
        this.confirmationResult = confirmationResult;
      })
      .finally(() => {
        this.sys.closeLoading();
      });
  }

  async linkWithPhoneNumber(phone, recaptchaVerifier) {
    this.sys.openLoading('Enviando código de confirmação...');
    const user = await this.afAuth.currentUser;
    return user.linkWithPhoneNumber(phone, recaptchaVerifier)
      .then((confirmationResult) => {
        this.shouldUpdatePhone = phone;
        this.confirmationResult = confirmationResult;
      })
      .finally(() => {
        this.sys.closeLoading();
      });
  }

  confirmCode(code) {
    this.sys.openLoading('Confirmando...');
    return this.confirmationResult.confirm(code)
    .then((userCredential) => {
      const user = userCredential.user;
      if (user) {
        user.getIdTokenResult(true).then((tokenResult => {
          if (tokenResult.claims?.customerId && this.shouldUpdatePhone) {
            this.afFunc.httpsCallable('updateCustomer')({phone: this.shouldUpdatePhone})
              .pipe(take(1))
              .toPromise();
          }
        }));
      }
      return userCredential;
    })
    .finally(() => {
      this.sys.closeLoading();
    });
  }
}
