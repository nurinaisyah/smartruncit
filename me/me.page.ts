import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { PopoverController } from '@ionic/angular';
import { HomePopoverComponent } from '../home-popover/home-popover.component';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})

export class MePage implements OnInit {

  id: any;
  name: string;
  phone: string;
  address: string;

  constructor(
    private userservice: UserService,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    public popoverController: PopoverController,
    private actRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,

  ) { }

  user: User = {
    name: '',
    email: '',
    address: '',
    phone: '',
    uid: '',
    password: '',
  };
  public providerId: string = 'null';

  ngOnInit() {
    this.userservice.isAuth().subscribe(data => {
      if (data) {

        this.user.name = data["name"];
        this.user.email = data["email"];
        this.user.phone = data["phone"];
        this.user.address = data["address"];

        this.providerId = data.providerData[0].providerId;
      }
    })
  }

  async getUserById(uid: string) {
    //show loader
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();

    this.firestore.collection("useList").doc(uid)
      .valueChanges()
      .subscribe(data => {
        this.user.name = data["name"];
        this.user.email = data["email"];
        this.user.phone = data["phone"];
        this.user.address = data["address"];
      });
    //dismiss loader
    (await loader).dismiss();
  }

  close() {
    this.userservice.SignOut();
    this.popoverController.dismiss();
  }

  async updateUser(user: User) {
    if (this.formValidation()) {
      //show loader
      let loader = this.loadingCtrl.create({
        message: "Please wait..."
      });
      (await loader).present();

      try {

        await this.firestore.doc("userList/" + this.id).update(user);
      } catch (e) {
        this.showToast(e);
      }
      //dismiss loader
      (await loader).dismiss();

      //redirect to view post page
      this.navCtrl.navigateRoot("me");
    }
  }


  async presentPopover(event) {
    const popover = await this.popoverController.create({
      component: HomePopoverComponent,
      event
    });
    return await popover.present();
  }

  async initializeItems(): Promise<any> {
    const userList = await this.firestore.collection('userList')
      .valueChanges();

    return userList;
  }

  formValidation() {
    if (!this.user.name) {
      this.showToast("Enter name");
      return false;
    }

    if (!this.user.email) {
      this.showToast("Enter email");
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
    })
      .then(toastData => toastData.present());
  }

}
