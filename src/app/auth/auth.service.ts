import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  confirmationResult: any;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  sendSignInLinkToEmail(email: string, actionCodeSettings = {}): any {
    const codeSettigns = Object.assign({
      url: `${environment.appDomain}/auth/sign-in`,
      handleCodeInApp: true
    }, actionCodeSettings);
    return this.afAuth.sendSignInLinkToEmail(email, codeSettigns).then(() => {
      return true;
    })
    .catch((reason) => {
      console.log(reason);
      throw reason;
    });
  }

  async signInWithEmailLink(email: string, emailLink: string): Promise<any> {
    if (await this.afAuth.isSignInWithEmailLink(emailLink)) {
      return this.afAuth.signInWithEmailLink(email, emailLink);
    } else {
      return null;
    }
  }

  signOut(redirectTo = '/auth/home'): void {
    this.afAuth.signOut()
    .then(() => {
      this.router.navigate([redirectTo]);
    });
  }
}
