import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { PopoverController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  constructor(
    public afStore: AngularFirestore,
    private userservice: UserService,
    public popoverController: PopoverController,
  ) { }

  ngOnInit() {
  }

  close(){
    this.userservice.SignOut();
    this.popoverController.dismiss();
  }
}
