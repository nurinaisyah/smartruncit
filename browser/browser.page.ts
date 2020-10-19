import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { observable, Observable, Subject } from 'rxjs';
import { CartService } from './../services/cart.service';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { CartPage } from '../cart/cart.page';
import { BehaviorSubject } from 'rxjs';
import { FirestoreService } from '../services/product/firestore.service';
import { Product } from '../models/product.interface';
import { ScrollDetail } from '@ionic/core';
import { first } from 'rxjs/operators';
import {
  LoadingController,
  NavController,
  ToastController,
  AlertController
} from '@ionic/angular';


@Component({
  selector: 'app-browser',
  templateUrl: './browser.page.html',
  styleUrls: ['./browser.page.scss'],
})
export class BrowserPage implements OnInit {
  searchTerm: any;
  showToolbar = false;
  names;
  cart = [];
  cartItemCount: BehaviorSubject<number>;
  productList: any = [];
  product = {} as Product;

  @ViewChild('cart', { static: false, read: ElementRef }) fab: ElementRef;

  constructor(
    private firestore: AngularFirestore,
    private cartService: CartService,
    private firestoreService: FirestoreService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
  ) { }

  async ngOnInit() {
    this.firestore.collection('productList').valueChanges()
      .subscribe(val => console.log(val));

    this.productList = this.firestoreService.getProductList().valueChanges();
    this.productList = await this.initializeItems();
    this.cart = this.cartService.getCart();
    this.cartItemCount = this.cartService.getCartItemCount();
  }

  async initializeItems(): Promise<any> {
    const productList = await this.firestore.collection('productList')
      .valueChanges()
      .pipe(first())
      .toPromise();

    return productList;
  }

  async addToCart(product) {
    //show loader
    let toast = this.toastCtrl.create({
      message: 'Item was added to cart',
      duration: 2000,
      position: 'middle'
    });

    (await toast).present();

    try {
      this.cartService.addProduct(product);

      (await toast).present();

    } catch (error) {
      this.showToast(error);
    }

  }

  onScroll($event: CustomEvent<ScrollDetail>) {
    if ($event && $event.detail && $event.detail.scrollTop) {
      const scrollTop = $event.detail.scrollTop;
      this.showToolbar = scrollTop >= 50;
    }
  }

  async filterList(evt) {
    this.productList = await this.initializeItems();
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.productList = this.productList.filter(product => {
      if (product.name && searchTerm) {
        return (product.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || product.category.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || product.desc.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }

}
