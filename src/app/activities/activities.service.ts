import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { Activity } from '../interfaces/activity';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  private contentReadySource = new BehaviorSubject(0);
  contentReady = this.contentReadySource.asObservable();
  userId?: string;
  activities: Array<{}> = [];
  lastDocument: any;

  constructor(private readonly fireStore: AngularFirestore, fbAuth: AngularFireAuth) {
    fbAuth.idTokenResult.subscribe(result => {
      if (result){
        this.userId = result.claims.user_id;
        this.contentReadySource.next(0);
      }
    });
  }

  getActivities(): Promise<Activity[]> {
    return this.fireStore
      .collection(
        `users/${this.userId}/activities`,
        (ref) => {
          if (this.lastDocument) {
            return ref.orderBy('startHour', 'desc')
              .startAfter(this.lastDocument)
              .limit(7);
          } else {
            return ref.orderBy('startHour', 'desc').limit(7);
          }
        }
      )
      .get()
      .pipe(
        take(1),
        map(snap => {
          const last = snap.docs[snap.docs.length - 1];

          if (last) {
            this.lastDocument = last;

            return snap.docs.map(docSnap => {
              return docSnap.data();
            });
          }

          return [];
        })
      )
      .toPromise()
      .then((activities) => activities)
      .catch((err) => console.log(err)) as Promise<Activity[]>;
  }

  addActivity(data: Activity): void {
    const id = uuidv4();

    this.fireStore.collection(`users/${this.userId}/activities`)?.doc(id).set({
      id,
      amount: data.amount,
      description: data.description,
      startHour: data.startHour,
      endHour: data.endHour,
      type: data.type,
      vehicleId: data.vehicleId
    });
  }
}
