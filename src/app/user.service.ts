import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from './interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private contentReadySource = new BehaviorSubject(0);
  contentReady = this.contentReadySource.asObservable();
  userId?: string;
  private usersCollection?: AngularFirestoreCollection<any>;

  constructor(
    private readonly fireStore: AngularFirestore,
    fbAuth: AngularFireAuth
  ) {
    fbAuth.idTokenResult.subscribe(token => {
      if (token) {
        this.userId = token.claims.user_id;
        this.usersCollection = this.fireStore.collection('users');
        this.contentReadySource.next(0);
      }
    });
  }

  getUser(): Observable<User> | undefined {
    return this.usersCollection?.doc(this.userId).valueChanges();
  }

  addBalance(newBalance: number): void {
    this.usersCollection?.doc(this.userId).update({
      balance: newBalance
    });
  }

  updateUser(user: User): void {
    this.usersCollection?.doc(this.userId).set(user, { merge: true });
  }
}
