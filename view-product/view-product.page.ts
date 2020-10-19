import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from '../services/product/firestore.service';
import { Product } from '../models/product.interface';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, ToastController, NavController, } from '@ionic/angular';
import { Router } from '@angular/router';
import { CartService } from './../services/cart.service';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { CartPage } from '../cart/cart.page';
import { CartItem } from '../models/cart.model';

import { first } from 'rxjs/operators';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.page.html',
  styleUrls: ['./view-product.page.scss'],
})
export class ViewProductPage implements OnInit {
  public product: Observable<Product>;
  productList: any;
  cart = [];
  cartItemCount: BehaviorSubject<number>;

  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    public alertCtrl: AlertController,
    private cartService: CartService,
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  async ngOnInit() {

    this.firestore.collection('productList').valueChanges()
      .subscribe(val => console.log(val));

    this.productList = this.firestoreService.getProductList().valueChanges();
    this.productList = await this.initializeItems();

    const productId: string = this.route.snapshot.paramMap.get('id');
    this.product = this.firestoreService.getProductDetails(productId).valueChanges();
  }

  itemsCollection: AngularFirestoreCollection<any>; //firebase sollection
  items: Observable<any[]>; //read collection

  ionViewWillEnter() {
    this.itemsCollection = this.firestore.collection('Items'); //ref()
    this.items = this.itemsCollection.valueChanges()
    console.log(this.items)
  }

  addToCart(product) {

    try {
      this.cartService.addProduct(product);


      this.showToast("Item successfuly added into the cart");

    }
    catch (e) {
      console.log(e);
    }

  }

  async initializeItems(): Promise<any> {
    const productList = await this.firestore.collection('productList')
      .valueChanges()
      .pipe(first())
      .toPromise();

    return productList;
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }
}
