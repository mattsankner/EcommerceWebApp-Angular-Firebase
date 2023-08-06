import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../firebase-auth.service'; 
import firebase from 'firebase/compat/app';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ProductdataService } from '../productdata.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
  user: any;
  hasAccess = false;
  message = '';
  latestId = 12;
  added = '';

  // for form
  product = {
    id: 0,
    name: '',
    description: '',
    price: '',
    quantity: 0,
    isAdded: false,
    image: '',
  };

  constructor(public fireAuthService: FirebaseAuthService, private db: AngularFireDatabase, private productdataService: ProductdataService) {}


  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
        this.hasAccess = true;
      } else {
        this.user = null;
        this.hasAccess = false;
      }
    });
  }

  async onLogin(v:any){
    await this.fireAuthService.signin(v.email, v.password);
    if (this.fireAuthService.isLoggedIn) {
      alert('You are logged in');
      this.message = 'You are logged in';
      this.hasAccess = true;
      this.productdataService.isLoggedIN(this.hasAccess);
    }
    else {
      alert('You are not logged in');
      this.hasAccess = false;
      this.message = 'Enter Correct Username and Password';
    }

  } 

  onLogout(){
    this.fireAuthService.logout();
    this.hasAccess = false;
    this.message = 'You are not logged in';
    this.productdataService.isLoggedIN(this.hasAccess);
  }


  onSubmit(value:any) {
    console.log(this.latestId)
    this.product = {
    id: this.latestId + 1,
    name: value.productName,
    description: value.productDescription,
    price: value.productPrice,
    quantity: 1,
    image: "assets/hockeymonkey2.png",
    isAdded: false,
  };

    this.db.list('/myProducts').push(this.product);
    this.latestId += 1;

    this.added = "Product added to products page!"

}
}
