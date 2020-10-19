import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  collectionName = 'Items';

  constructor(
    private firestore: AngularFirestore,
  ) { }

  create_items(product) {
    return this.firestore.collection(this.collectionName).add(product);
  }

  read_items() {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }

  update_items(productID, product) {
    this.firestore.doc(this.collectionName + '/' + productID).update(product);
  }

  delete_items(product_id) {
    this.firestore.doc(this.collectionName + '/' + product_id).delete();
  }
}
