import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PermissionComponent } from './permission/permission.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'permission',
    pathMatch: 'full'
  },
  {
    path: 'permission',
    component: PermissionComponent
  },
  {
    path: 'map',
    component: MapComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeolocationRoutingModule { }
