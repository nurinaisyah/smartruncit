import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '../services/product/firestore.service';
import {
  LoadingController,
  NavController,
  ToastController
} from '@ionic/angular';
import { from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.page.html',
  styleUrls: ['./update-customer.page.scss'],
})
export class UpdateCustomerPage implements OnInit {
  user = {} as User;
  id: any;

  constructor(
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
    this.getUserById(this.id);
  }

  async getUserById(uid: string) {
    //show loader
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();

    try {
      this.firestore.doc("userList/" + uid)
        .valueChanges()
        .subscribe(data => {
          this.user.name = data["name"];
          this.user.phone = data["phone"];
          this.user.address = data["address"];
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

  async updateUser(user: User) {
    //show loader
    let loader = this.loadingCtrl.create({
      message: "Updating user..."
    });
    (await loader).present();

    try {
      await this.firestore.collection("userList").doc(this.id).update(user);
      this.showToast("User is successfuly updated!");
    } catch (e) {
      this.showToast(e);
    }

    //dissmiss loader
    (await loader).dismiss();

    //redirect to home page
    this.navCtrl.navigateRoot("customer");
    //}
  }

  formValidation() {
    if (!this.user.name) {
      this.showToast("Enter name");
      return false;
    }

    if (!this.user.phone) {
      this.showToast("Enter phone");
      return false;
    }

    if (!this.user.address) {
      this.showToast("Enter address");
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
