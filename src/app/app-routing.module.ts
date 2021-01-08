import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {  DashboardComponent } from './dashboard/dashboard.component'
import {  OrdersComponent } from './orders/orders.component'
import {  VehiclesComponent } from './vehicles/vehicles.component'

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }, {
  path: 'dashboard',
  component: DashboardComponent
}, {
  path: 'orders',
  component: OrdersComponent
}, {
  path: 'vehicles',
  component: VehiclesComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
