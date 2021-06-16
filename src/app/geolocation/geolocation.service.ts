import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { AccessPoint } from '../interfaces/access-point';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  constructor(private readonly fireStore: AngularFirestore) {}

  getAccessPoints(): Observable<AccessPoint[]> | undefined {
    return this.fireStore.collection('accessPoints').valueChanges({idField: 'id'}) as Observable<AccessPoint[]>;
  }
}
