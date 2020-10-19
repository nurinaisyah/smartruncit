import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController, ToastController, NavController, AlertController } from '@ionic/angular';
import { Admin } from '../models/admin.model';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.page.html',
  styleUrls: ['./login-admin.page.scss'],
})
export class LoginAdminPage implements OnInit {

  admin = {} as Admin;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
  }

  async logIn(admin: Admin) {
    // ) {
    if (admin.email == "admin@gmail.com" && admin.password == "admin123") {
      let toast = this.toastCtrl.create({
        message: 'Welcome! You are now in the admin page',
        duration: 2000,
        position: 'top'
      });

      (await toast).present();
      try {
        await this.afAuth
          .signInWithEmailAndPassword(admin.email, admin.password)
          .then(data => {
            console.log(data);

            //redirect to home page
            this.navCtrl.navigateRoot("admin");
          })
      } catch (e) {
        this.showToast(e);
      }
    }

    else {
      let toast = this.toastCtrl.create({
        message: 'Oppss. You are not the authorized user. You cannot login into this page',
        duration: 3000,
        position: 'top'
      });
      (await toast).present();
    }
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }

}
