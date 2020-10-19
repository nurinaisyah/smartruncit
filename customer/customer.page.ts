import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  LoadingController,
  ToastController,
  NavController,
  AlertController
}
  from '@ionic/angular';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { observable, Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { ScrollDetail } from '@ionic/core';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})

export class CustomerPage implements OnInit {
  user: any;
  // user: Observable<any[]>;
  public productList: any = [];
  // userList: Observable<User[]>;
  userList: any = [];
  searchTerm: any;
  showToolbar = false;
  router: any;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    public userservice: UserService) { }


  async ngOnInit() {
    this.userList = this.userservice.getUserList().valueChanges();
    this.userList = await this.initializeItems();
  }

  ionViewWillEnter() {
    this.getUser();
  }
  onScroll($event: CustomEvent<ScrollDetail>) {
    if ($event && $event.detail && $event.detail.scrollTop) {
      const scrollTop = $event.detail.scrollTop;
      this.showToolbar = scrollTop >= 10;
    }
  }
  async getUser() {
    //show loader
    let loader = await this.loadingCtrl.create({
      message: "Please wait..."
    });

    loader.present();


    try {
      this.firestore
        .collection("userList")
        .snapshotChanges()
        .subscribe(data => {
          this.user = data.map(e => {
            return {
              uid: e.payload.doc.id,
              name: e.payload.doc.data()["name"],
              phone: e.payload.doc.data()["phone"],
              address: e.payload.doc.data()["address"],
            };
          });

          loader.dismiss();
        });

    } catch (e) {
      this.showToast(e);
    }
  }

  async deleteUser(uid: string) {
    //show loader
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();

    try {
      await this.firestore.collection('userList').doc(uid).delete();
      this.showToast("User has been deleted permenantly.")

    } catch (error) {
      console.log(error);
    }
    //dismiss loader
    (await loader).dismiss();
  }

  async initializeItems(): Promise<any> {
    const userList = await this.firestore.collection('userList')
      .valueChanges();

    return userList;
  }

  async filterList(evt) {
    this.userList = await this.initializeItems();
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.userList = this.userList.filter(user => {
      if (user.name && searchTerm) {
        return (user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }
}
