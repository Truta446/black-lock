import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { CheckIn } from '../interfaces/check-in';

@Injectable({
  providedIn: 'root'
})
export class CheckInService {
  private contentReadySource = new BehaviorSubject(1);
  contentReady = this.contentReadySource.asObservable();
  userId?: string;
  private checkInCollection?: AngularFirestoreCollection<any>;

  constructor(
    private readonly fireStore: AngularFirestore,
    fbAuth: AngularFireAuth
  ) {
    fbAuth.idTokenResult.subscribe(token => {
      if (token) {
        this.userId = token.claims.user_id;
        this.checkInCollection = this.fireStore.collection(`users/${this.userId}/check-in`);
        this.contentReadySource.next(0);
      }
    });
  }

  getCheckIn(currentActiveCheckIn: string): Observable<CheckIn> | undefined {
    return this.checkInCollection?.doc(currentActiveCheckIn).valueChanges();
  }

  async createCheckIn(data: CheckIn): Promise<string> {
    try {
      const id = uuidv4();

      data.id = id;

      await this.checkInCollection?.doc(id).set(data);

      return id;
    } catch (error) {
      console.error('error', error);

      throw(error);
    }
  }
}
