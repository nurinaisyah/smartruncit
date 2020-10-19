import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from '../services/product/firestore.service';
import { Product } from '../models/product.interface';
import { ActivatedRoute } from '@angular/router';
import {
  LoadingController,
  NavController,
  AlertController,
  ToastController
} from '@ionic/angular';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UpdateProductPage } from '../update-product/update-product.page';
import { AngularFirestore } from '@angular/fire/firestore';
//import { format } from 'path';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  public product: Observable<Product>;

  createProductForm: FormGroup;
  productList: any = [];

  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private navCtrl: NavController,
    private router: Router,
    public modalController: ModalController,
    private firestore: AngularFirestore,
    private actRoute: ActivatedRoute,
    private toastCtrl: ToastController,

  ) { }
  ngOnInit() {
    const productId: string = this.route.snapshot.paramMap.get('id');
    this.product = this.firestoreService.getProductDetails(productId).valueChanges();

    this.firestoreService.getProductDetails(productId);
    (result => {
      this.product = result;
      console.log(this.product)
    })
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }
}
