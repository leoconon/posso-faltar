import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeekDetailingPageRoutingModule } from './week-detailing-routing.module';

import { WeekDetailingPage } from './week-detailing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeekDetailingPageRoutingModule
  ],
  declarations: [WeekDetailingPage]
})
export class WeekDetailingPageModule {}
