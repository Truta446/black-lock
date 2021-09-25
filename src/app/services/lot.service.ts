import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Lot } from '../interfaces/lot';

@Injectable({
  providedIn: 'root'
})
export class LotService {
  constructor(private readonly fireStore: AngularFirestore) {}

  getLots(): Observable<Lot[]> | undefined {
    return this.fireStore.collection('lots').valueChanges() as Observable<Lot[]>;
  }

  getLotDetails(id: string): Observable<Lot> | undefined {
    return this.fireStore.doc(`lots/${id}`).valueChanges() as Observable<Lot>;
  }
}
