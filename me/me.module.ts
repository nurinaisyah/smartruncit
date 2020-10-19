import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MePageRoutingModule } from './me-routing.module';

import { MePage } from './me.page';
import { HomePopoverComponent } from '../home-popover/home-popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MePageRoutingModule,
  ],
  entryComponents: [HomePopoverComponent],
  declarations: [MePage, HomePopoverComponent]
})
export class MePageModule {}
