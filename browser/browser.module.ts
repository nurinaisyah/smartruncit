import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrowserPageRoutingModule } from './browser-routing.module';

import { BrowserPage } from './browser.page';

import { environment } from '../../environments/environment';
import { AngularFireModule } from '@angular/fire';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrowserPageRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  declarations: [BrowserPage]
})
export class BrowserPageModule {}
