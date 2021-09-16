import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddBalanceComponent } from './add-balance/add-balance.component';
import { MethodComponent } from './method/method.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'add-balance',
    pathMatch: 'full'
  },
  {
    path: 'add-balance',
    component: AddBalanceComponent
  },
  {
    path: 'method',
    component: MethodComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletRoutingModule { }
