import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeekDetailingPage } from './week-detailing.page';

const routes: Routes = [
  {
    path: '',
    component: WeekDetailingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeekDetailingPageRoutingModule {}
