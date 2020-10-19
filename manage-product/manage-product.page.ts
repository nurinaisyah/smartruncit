import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from '../services/product/firestore.service';
import { Product } from '../models/product.interface';
import { Router } from '@angular/router';
import { AngularFirestore} from '@angular/fire/firestore';
import { ScrollDetail } from '@ionic/core';
import { 
  LoadingController, 
  NavController, 
  ToastController } from '@ionic/angular';
@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.page.html',
  styleUrls: ['./manage-product.page.scss'],
})
export class ManageProductPage implements OnInit {
  product: any;
  profileUrl: Observable<string>;
  showToolbar = false;

  constructor(
    private firestoreService : FirestoreService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getProduct();
  }

  onScroll($event: CustomEvent<ScrollDetail>) {
    if ($event && $event.detail && $event.detail.scrollTop) {
      const scrollTop = $event.detail.scrollTop;
      this.showToolbar = scrollTop >= 225;
    }
}
  
  async getProduct(){
    //show loader
    let loader = await this.loadingCtrl.create({
      message: "Please wait..."
    });

    loader.present();


    try {
      this.firestore
      .collection("productList")
      .snapshotChanges()
      .subscribe(data => {
        this.product = data.map(e => {
          return {
            id: e.payload.doc.id,
            name: e.payload.doc.data()["name"],
            desc: e.payload.doc.data()["desc"],
            price: e.payload.doc.data()["price"],
            stock: e.payload.doc.data()["stock"],
            category: e.payload.doc.data()["category"],
            profileUrl: e.payload.doc.data()["profileUrl"],

          };
        });

        loader.dismiss();
      });

    } catch (e) {
      this.showToast(e);
    }
  }

  async deleteProduct(id: string){
    //show loader
    let loader = this.loadingCtrl.create({
     message: "Please wait..."
   });
   (await loader).present();


   try {
     await this.firestore.collection('productList').doc(id).delete();
     this.showToast("Product has been deleted permenantly");
     
   } catch (error) {
     console.log(error);
   }
   //dismiss loader
   (await loader).dismiss();
 }

 showToast (message:string){
   this.toastCtrl.create({
     message: message,
     duration: 3000
   }).then(toastData => toastData.present());
  }
}
