import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  LoadingController,
  NavController,
  ToastController
} from '@ionic/angular';
import { User } from '../models/user.model';

import { auth } from 'firebase/app'
import { AngularFirestore } from '@angular/fire/firestore'
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  user = {} as User;

  public createUserForm: FormGroup

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    public firestore: AngularFirestore,
    public userService: UserService,
    public alertController: AlertController,
    public router: Router,
    formBuilder: FormBuilder,
  ) {
    this.createUserForm = formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    })

    this.createUserForm.valueChanges.subscribe(console.log)
  }

  ngOnInit() {

  }

  async presentAlert(title: string, content: string) {
    const alert = await this.alertController.create({
      header: title,
      message: content,
      buttons: ['OK']
    })

    await alert.present()
  }

  async createUser(user: User) {

    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();


    try {
      await this.afAuth
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(data => console.log(data))
      const loading = await this.loadingCtrl.create();
      const name = this.createUserForm.value.name;
      const phone = this.createUserForm.value.phone;
      const address = this.createUserForm.value.address;

      this.userService
        .createUser(name, phone, address)
        .then(
          () => {
            loading.dismiss().then(() => {
              //direct to home
              this.router.navigateByUrl('/home');
            });
          }
        );

      //dismiss loader
      (await loader).dismiss();

    }
    catch (err) {
      this.showToast(err);
      //dismiss loader
      (await loader).dismiss();
    }
    //redirect to home page
    this.navCtrl.navigateRoot("home");
  }

  formValidation() {
    if (!this.user.email) {
      this.showToast("Enter email");
      return false;
    }

    if (!this.user.password) {
      this.showToast("Enter password");
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
