import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QrcodeReaderComponent } from './qrcode-reader/qrcode-reader.component';
import { VehicleChoiceComponent } from './vehicle-choice/vehicle-choice.component';
import { HoursChoiceComponent } from './hours-choice/hours-choice.component';
import { PaymentChoiceComponent } from './payment-choice/payment-choice.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'qrcode-reader',
    pathMatch: 'full'
  },
  {
    path: 'qrcode-reader',
    component: QrcodeReaderComponent
  },
  {
    path: 'vehicle-choice',
    component: VehicleChoiceComponent
  },
  {
    path: 'hours-choice',
    component: HoursChoiceComponent
  },
  {
    path: 'payment-choice',
    component: PaymentChoiceComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckInRoutingModule { }
