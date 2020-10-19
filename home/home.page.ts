import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { async } from '@angular/core/testing';
import { LoadingController, ToastController, NavController, AlertController } from '@ionic/angular';
import { User } from '../models/user.model';
import { Admin } from '../models/admin.model';
import { UserService } from '../services/user.service';
import { auth } from 'firebase/app'
import { Router } from '@angular/router';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
// 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [UserService]
})
export class HomePage implements OnInit {
  user = {} as User;
  admin = {} as Admin;
  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    public userservice: UserService
  ) { }
  ngOnInit() { }
  async login(user: User) {
    if (this.formValidation()) {
      //show loader
      let loader = this.loadingCtrl.create({
        message: "Please wait..."
      });
      (await loader).present();

      try {
        await this.afAuth
          .signInWithEmailAndPassword(user.email, user.password)
          .then(async data => {
            console.log(data);

            let toast = this.toastCtrl.create({
              message: 'Welcome to SmartRuncit!',
              duration: 3000,
              position: 'top'
            });
            (await toast).present();
            

            //redirect to home page
            this.navCtrl.navigateRoot("login");
          })
      } catch (e) {
        
        this.showToast(e);
      }
      //dismis loader
      (await loader).dismiss();
    }
  }

  async adminLogin(admin:Admin){
    try {
      
        //redirect to home page
        this.navCtrl.navigateRoot("manage-product");
    } catch (error) {
      
    }
  }
  
  async resetPassword(email: string) {
    //
    let alert = this.alertCtrl.create({
      //title: 'Enter Your Email',
      message: "Please enter the email to reset your password",
      inputs: [
        {
          name: 'recoverEmail',
          placeholder: 'you@example.com'
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit',
          handler: async data => {

            //show loader
            let loader = this.loadingCtrl.create({
              //dismissOnPageChange: true,
              message: "Reseting your password..."
            });

            (await loader).present();

            //call user service
            this.userservice.forgotPasswordUser(data.recoverEmail).then(async () => {

              (await loader).dismiss().then(async () => {
                //showpopup
                let alert = this.alertCtrl.create({
                  //title: 'Enter Your Email',
                  message: 'A new password has been sent to your email',
                  buttons: ['OK']
                });
                (await alert).present();
              })
            }, async error => {
              (await loader).dismiss().then(async () => {
              let alert = this.alertCtrl.create({
                //title: 'Enter Your Email',
                message: error.message,
                buttons: ['OK']
              });
              (await alert).present();
            })
            });
          
          }
        }
      ]
    });

    (await alert).present();
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
