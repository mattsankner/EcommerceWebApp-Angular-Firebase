import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  isLoggedIn = false;
  constructor(public firebaseAuth: AngularFireAuth) {}

  //try to understand this code more?
   async signin(email: string, password: string) {
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
    .then((res: { user: any; }) => {
      this.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(res.user))
    }).catch((error:any) => console.log(error));
  }

  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
  }
}
