import { Component, OnInit, ViewChild } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { FirestoreService } from '../services/product/firestore.service';
import { Product } from '../models/product.interface';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ScrollDetail } from '@ionic/core';
import { CartService } from '../services/cart.service';
import { IonSlides } from '@ionic/angular';
import {
  LoadingController,
  NavController,
  ToastController, PopoverController,
  AlertController
} from '@ionic/angular';
import { UserService } from '../services/user.service';
// import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
export class HomepagePage implements OnInit {
  imageArray: any = [];
  showToolbar = false;
  cart = [];
  items: any = [];

  public productList: any = [];
  //product: Observable<any[]>;
  product = {} as Product;

  sliderConfig = {
    slidesPerView: 1.5,
    spaceBetween: 1,
    centeredSlides: true
  };

  @ViewChild("mySlider") slides: IonSlides;

  ionViewDidEnter() {
    this.slides.startAutoplay();
  }
  ionViewWillLeave() {
    this.slides.startAutoplay();
  }
  constructor(
    private firestore: AngularFirestore,
    private firestoreService: FirestoreService,
    private cartService: CartService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private userservice: UserService,
    public popoverController: PopoverController,

  ) {
    this.imageArray = [
      { 'image': 'assets/grocery (2).jpg' },
      { 'image': 'assets/vegetable.jpg' },
      { 'image': 'assets/fruit.jpg' },
      { 'image': 'assets/img1.png' },
      { 'image': 'assets/img2.png' },
      { 'image': 'assets/img4.png' },
    ];

  }

  async ngOnInit() {
    this.productList = this.firestoreService.getProductList().valueChanges();
    this.productList = await this.initializeItems();

    this.items = this.cartService.getProducts();
    this.cart = this.cartService.getCart();
  }

  async initializeItems(): Promise<any> {
    const productList = await this.firestore.collection('productList')
      .valueChanges();

    return productList;
  }

  onScroll($event: CustomEvent<ScrollDetail>) {
    if ($event && $event.detail && $event.detail.scrollTop) {
      const scrollTop = $event.detail.scrollTop;
      this.showToolbar = scrollTop >= 10;
    }
  }

  async viewCategory() {

    this.firestore.collection("productList").doc("category")
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

  slidesDidLoad() {
    this.slides.startAutoplay();
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }

  close() {
    this.userservice.SignOut();
    this.popoverController.dismiss();
  }
}

