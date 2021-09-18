import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MotorcycleComponent } from './motorcycle/motorcycle.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'motorcycle',
    pathMatch: 'full'
  },
  {
    path: 'motorcycle',
    component: MotorcycleComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistersRoutingModule { }
