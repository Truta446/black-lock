import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListVehiclesComponent } from './list-vehicles/list-vehicles.component';
import { MotorcycleComponent } from './motorcycle/motorcycle.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-vehicles',
    pathMatch: 'full'
  },
  {
    path: 'list-vehicles',
    component: ListVehiclesComponent
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
