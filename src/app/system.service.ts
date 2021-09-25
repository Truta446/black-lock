import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { LoadingComponent } from './loading/loading.component';
import { LocalStorage } from './interfaces/local-storage'

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  loadingRef: any;
  successRef: any;
  dialogRef: any;

  constructor(private dialog: MatDialog) { }

  openLoading(message: string | null = null): any {
    this.loadingRef = this.dialog.open(LoadingComponent, {panelClass: 'transparent'});
    this.loadingRef.disableClose = true;

    if (message) {
      this.loadingRef.componentInstance.message = message;
    }

    return this.loadingRef;
  }

  closeLoading(): void {
    this.loadingRef.close();
  }

  private _getAllFromLocalStorage(): LocalStorage {
    const result = localStorage.getItem('blacklock');
    return JSON.parse(result || '{}');
  }

  insertDataOnLocalStorage(data: any): void {
    const blacklock: any = this._getAllFromLocalStorage();
    const key = Object.keys(data)[0] as string;

    blacklock[key] = data[key];

    localStorage.setItem('blacklock', JSON.stringify(blacklock));
  }

  getDataToLocalStorage(): LocalStorage {
    return this._getAllFromLocalStorage();
  }

  cleanLocalStorage(): void {
    const data = {
      location: {},
      amountCents: 0
    };

    localStorage.setItem('blacklock', JSON.stringify(data));
  }
}
