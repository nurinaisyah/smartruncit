import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  LoadingController,
  AlertController,
  NavController,
  ToastController
} from '@ionic/angular';
import { FirestoreService } from '../services/product/firestore.service';
import { Router } from '@angular/router';
import { Product } from '../models/product.interface';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
// import { log } from 'console';
import { async } from '@angular/core/testing';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import { ScrollDetail } from '@ionic/core';
// import { threadId } from 'worker_threads';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  public createProductForm: FormGroup
  product = {} as Product;

  // product: AngularFirestoreCollection;
  profileUrl: Observable<string>;
  title = "cloudsSorage";
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  showToolbar = false;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public firestoreService: FirestoreService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient,
  ) {
    this.createProductForm = formBuilder.group({
      name: ['', Validators.required],
      stock: [0, Validators.required],
      desc: ['', Validators.required],
      price: [0, Validators.required],
      category: ['', Validators.required],
    })
  }

  ngOnInit() {
  }

  onFileSelected(event) {

    const id = Math.random().toString(36).substring(2);
    const file = event.target.files[0];
    const filePath = `images/productList_${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    task.snapshotChanges().pipe(
      finalize(() =>
        this.profileUrl = ref.getDownloadURL()))
      .subscribe();
  }

  chooseFile(e) {
    this.selectedFile = e.target.files;
  }

  async createProduct() {

    try {
      const loading = await this.loadingCtrl.create()

      const name = this.createProductForm.value.name;
      const stock = this.createProductForm.value.stock;
      const desc = this.createProductForm.value.desc;
      const price = this.createProductForm.value.price;
      const category = this.createProductForm.value.category;
      this.firestoreService
        .createProduct(name, stock, desc, price, category)
        .then(
          () => {
            loading.dismiss().then(() => {
              this.router.navigateByUrl('/manage-product');
            });
          }
        )

        ;

    } catch (error) {
      console.log(error);
    }
  }

  onScroll($event: CustomEvent<ScrollDetail>) {
    if ($event && $event.detail && $event.detail.scrollTop) {
      const scrollTop = $event.detail.scrollTop;
      this.showToolbar = scrollTop >= 225;
    }
  }


  formValidation() {
    if (!this.product.name) {
      this.showToast("Enter name");
      return false;
    }

    if (!this.product.desc) {
      this.showToast("Enter desciption");
      return false;
    }

    if (!this.product.stock) {
      this.showToast("Enter stock");
      return false;
    }

    if (!this.product.price) {
      this.showToast("Enter price");
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


}
