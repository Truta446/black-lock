import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { NgxViacepModule } from '@brunoc/ngx-viacep';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

import { RegistersRoutingModule } from './registers-routing.module';
import { MotorcycleComponent } from './motorcycle/motorcycle.component';


@NgModule({
  declarations: [MotorcycleComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegistersRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatBadgeModule,
    MatTooltipModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    NgxViacepModule,
    NgxMaskModule.forChild(),
  ]
})
export class RegistersModule { }
