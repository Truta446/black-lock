import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from './alert/alert.component';
import { LoadingComponent } from './loading/loading.component';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  loadingRef: any;
  successRef: any;
  dialogRef: any;

  constructor(private dialog: MatDialog) { }

  openLoading(message: string | null = null) {
    this.loadingRef = this.dialog.open(LoadingComponent, {panelClass: 'transparent'});
    this.loadingRef.disableClose = true;
    if (message) {
      this.loadingRef.componentInstance.message = message;
    }
    return this.loadingRef;
  }

  closeLoading() {
    this.loadingRef.close();
  }

  openSuccess(message: string | null = null) {
    this.successRef = this.dialog.open(LoadingComponent, {
      panelClass: 'success', backdropClass: 'success'
    });
    this.successRef.componentInstance.loading = 'success';
    if (message) {
      this.successRef.componentInstance.message = message;
    }
    setTimeout(() => this.successRef.close(), 2000);
    return this.successRef;
  }

  openDialog(title: string = '', message: string = 'Alerta') {
    this.dialogRef = this.dialog.open(AlertComponent, {
      data: {
        title,
        message
      }
    });
    return this.dialogRef;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
