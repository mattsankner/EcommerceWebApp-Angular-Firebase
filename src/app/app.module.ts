import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { FormsModule } from '@angular/forms';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { FooterComponent } from './footer/footer.component';
import { AdminComponent } from './admin/admin.component';


import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFireDatabaseModule} from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { OrdersComponent } from './orders/orders.component';


  @NgModule({
    declarations: [
      AppComponent,
      HomeComponent,
      CartComponent,
      CheckoutComponent,
      FooterComponent,
      AdminComponent,
      OrdersComponent
    ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireAuthModule,
      AngularFireStorageModule,
      AngularFireDatabaseModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    exports: [
      AngularFireAuthModule
    ]
  })
  export class AppModule { }
