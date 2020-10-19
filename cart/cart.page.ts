import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { ScrollDetail } from '@ionic/core';
import { CartService } from '../services/cart.service';
import { ModalController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '../services/product/firestore.service';
import { Product } from '../models/product.interface';
import { CartItem } from '../models/cart.model';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  cart: Product[] = [];
  showToolbar = false;

  constructor(
    private cartService: CartService,
    private firestore: AngularFirestore,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private firestoreService: FirestoreService,
  ) { }

  async ngOnInit() {


    this.cart = this.cartService.getCart();

    this.firestore.collection('productList').valueChanges()
      .subscribe(val => console.log(val));

  }


  decreaseCartItem(product) {
    this.cartService.decreaseProduct(product);
  }

  increaseCartItem(product) {
    this.cartService.addProduct(product);
  }

  removeCartItem(product) {
    this.cartService.removeProduct(product);
  }

  getTotal() {
    return this.cart.reduce((i, p) => i + p.price * p.qty, 0);
  }

  onScroll($event: CustomEvent<ScrollDetail>) {
    if ($event && $event.detail && $event.detail.scrollTop) {
      const scrollTop = $event.detail.scrollTop;
      this.showToolbar = scrollTop >= 10;

    }
  }


  async checkout() {

    let alert = await this.alertCtrl.create({
      header: 'Thanks for your Order!',
      message: 'We will deliver your food as soon as possible',
      buttons: ['OK']
    });
    alert.present().then(() => {
      this.modalCtrl.dismiss();
    });
  }
}
