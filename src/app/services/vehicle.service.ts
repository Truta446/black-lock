import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { Vehicle } from './../interfaces/vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private contentReadySource = new BehaviorSubject(1);
  contentReady = this.contentReadySource.asObservable();
  private vehiclesCollection?: AngularFirestoreCollection<any>;

  constructor(
    private readonly fireStore: AngularFirestore,
    fbAuth: AngularFireAuth
  ) {
    fbAuth.idTokenResult.subscribe(token => {
      if (token) {
        const userId = token.claims.user_id;
        this.vehiclesCollection = this.fireStore.collection(`users/${userId}/vehicles`);
        this.contentReadySource.next(0);
      }
    });
  }

  getAllVehicles(): Observable<Vehicle[]> | undefined {
    return this.vehiclesCollection?.valueChanges({idField: 'id'});
  }

  getVehicle(vehicleId: string): Observable<Vehicle> | undefined {
    return this.vehiclesCollection?.doc(vehicleId).valueChanges({idField: 'id'});
  }

  createVehicle(vehicle: Vehicle): void {
    vehicle.id = uuidv4();
    this.vehiclesCollection?.doc(vehicle.id).set(vehicle);
  }

  updateVehicle(vehicle: Vehicle): void {
    this.vehiclesCollection?.doc(vehicle.id).set(vehicle, { merge: true });
  }
}
