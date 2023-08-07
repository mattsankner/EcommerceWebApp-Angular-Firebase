import { Component } from '@angular/core';
import { map, Observable} from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireList } from '@angular/fire/compat/database';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {

  itemsRef : AngularFireList<any> | undefined
  items: Observable<any[]> | undefined;
  orderId: number = 0;
  constructor(private db: AngularFireDatabase){
    this.itemsRef = db.list('/order');
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ cartKey: c.payload.key, ...c.payload.val()}))
      )
    );
  }

  getId(){
    this.orderId += 1;
    return this.orderId;
  }
  totalPrice:number = 0;
}
