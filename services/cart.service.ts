import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { CartPageModule } from '../cart/cart.module';
import { Product } from '../models/product.interface';
import { FirestoreService } from '../services/product/firestore.service'
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  product = {} as Product;
  productList: Product[];
  private cart = [];
  private cartItemCount = new BehaviorSubject(0);

  constructor(
    public firestoreService: FirestoreService,
    private firestore: AngularFirestore,
  ) { }


  getProducts() {
    return this.product;
  }

  getCart() {
    return this.cart;
  }

  getCartItemCount() {
    return this.cartItemCount;
  }

  addProduct(product) {
    let added = false;
    for (let p of this.cart) {
      if (p.id === product.id) {
        p.qty += 1;
        added = true;
        break;
      }
    }
    if (!added) {
      product.qty = 1;
      this.cart.push(product);
    }
    this.cartItemCount.next(this.cartItemCount.value + 1);


  }

  decreaseProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.id === product.id) {
        p.qty -= 1;
        if (p.qty == 0) {
          this.cart.splice(index, 1);
        }
      }
    }
    this.cartItemCount.next(this.cartItemCount.value - 1);
    return this.cartItemCount;
  }

  removeProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.id === product.id) {
        this.cartItemCount.next(this.cartItemCount.value - p.qty);
        this.cart.splice(index, 1);
      }
    }
  }
}
