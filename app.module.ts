import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import {  AngularFireStorageModule } from '@angular/fire/storage';

import { firebaseConfig } from './credentials'

import {CartPageModule} from './cart/cart.module';
import { CartPage } from './cart/cart.page';
import { UserService } from './services/user.service';
import { UpdateProductPageModule } from './update-product/update-product.module';

import { IonicStorageModule } from '@ionic/Storage';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    CartPageModule,
    UpdateProductPageModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    AngularFireStorageModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy },
      UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
