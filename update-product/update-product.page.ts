import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '../services/product/firestore.service';
import {
  LoadingController,
  NavController,
  ToastController
} from '@ionic/angular';
import { from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product.interface';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.page.html',
  styleUrls: ['./update-product.page.scss'],
})
export class UpdateProductPage implements OnInit {

  product = {} as Product;
  id: any;

  constructor(
    public modalController: ModalController,
    private firestoreService: FirestoreService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private firestore: AngularFirestore,
    private actRoute: ActivatedRoute
  ) {
    this.id = this.actRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.getProductById(this.id);
  }

  async getProductById(id: string) {
    //show loader
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();

    try {
      this.firestore.doc("productList/" + id)
        .valueChanges()
        .subscribe(data => {
          this.product.name = data["name"];
          this.product.desc = data["desc"];
          this.product.price = data["price"];
          this.product.stock = data["stock"];
          this.product.category = data["category"];
        })
        ;

      //dismiss loader
      (await loader).dismiss();
    }
    catch (e) {
      console.log(e);
      this.showToast(e);
    }
  }


  async updateProduct(product: Product) {
    //   show loader
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();

    let toast = this.toastCtrl.create({
      message: 'Product was updated successfully',
      duration: 2000,
      position: 'middle'
    });

    try {
      await this.firestore.collection("productList").doc(this.id).update(product);

    } catch (e) {
      this.showToast(e);
    }

    //dissmiss loader
    (await loader).dismiss();

    //redirect to home page
    this.navCtrl.navigateRoot("manage-product");
    (await toast).present();
    //}
  }


  formValidation() {
    if (!this.product.name) {
      this.showToast("Enter name");
      return false;
    }

    if (!this.product.desc) {
      this.showToast("Enter desc");
      return false;
    }

    if (!this.product.price) {
      this.showToast("Enter price");
      return false;
    }

    if (!this.product.stock) {
      this.showToast("Enter stock");
      return false;
    }

    if (!this.product.category) {
      this.showToast("Enter category");
      return false;
    }

    return true;
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }


  CloseModal() {
    this.modalController.dismiss()
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Product was updated successfully',
      duration: 3000,
      position: 'middle'
    });
  }

}
