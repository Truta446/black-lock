import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';

import { CheckInRoutingModule } from './check-in-routing.module';
import { QrcodeReaderComponent } from './qrcode-reader/qrcode-reader.component';
import { HoursChoiceComponent } from './hours-choice/hours-choice.component';
import { PaymentChoiceComponent } from './payment-choice/payment-choice.component';

@NgModule({
  declarations: [
    QrcodeReaderComponent,
    HoursChoiceComponent,
    PaymentChoiceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CheckInRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatListModule,
    MatRadioModule,
    ZXingScannerModule
  ]
})
export class CheckInModule { }
