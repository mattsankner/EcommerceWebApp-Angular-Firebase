import { Component } from '@angular/core';
import { map, take } from 'rxjs';
import { ProductdataService } from '../productdata.service';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable} from 'rxjs';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

itemsRef : AngularFireList<any> | undefined
items: Observable<any[]> | undefined;
totalQuantity:number=0;
totalPrice:number = 0;
newPrice:string = "";
cartEmpty:boolean = true;
cartSpace:boolean = true;

constructor(private myservice:ProductdataService,
  private db: AngularFireDatabase){
    this.itemsRef = db.list('/cart');
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ cartKey: c.payload.key, ...c.payload.val()}))
      )
    );

   //subscription to the observable item
   //When items change, update total quantity and price

    this.items?.subscribe((items:any[]) => {
      this.totalQuantity = 0;
      this.totalPrice = 0;

      
      items.forEach((item:any) => {
        if (typeof this.totalQuantity !== 'undefined' && this.totalQuantity !== null) {
          this.totalQuantity += item.quantity;
          this.totalPrice += (item.price * item.quantity);
          this.totalPrice = +(this.totalPrice.toFixed(2));  

        }
        //for footer placement
        if (this.totalQuantity > 0){
          this.cartEmpty = false;
        }
        if (this.totalQuantity > 3){
          this.cartSpace = false;
        }
      })
       this.newPrice = this.totalPrice.toLocaleString(undefined, {
        minimumFractionDigits: 2
      });
      this.myservice.setPrice(this.newPrice);
    });
}

removeFromCart(key:string, product:any){
  
  this.itemsRef!.remove(key);
  product.quantity -= 1; 

  //price and quantity update
  this.totalQuantity -= product.quantity;
  this.totalPrice -= (product.price * product.quantity);
  this.totalPrice = +(this.totalPrice.toFixed(2));
  this.newPrice = this.totalPrice.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });

  const productRef = this.db.list('/myProducts');
  productRef.update(product.key, {quantity: product.quantity});
  productRef.update(product.key, {isAdded: false})
  this.myservice.setPrice(this.newPrice);
}

updateQuantity(key: string, product: any, newQuantity: number) {
  // Calculate the difference between the old and new quantity
  const quantityDifference = newQuantity - product.quantity;

  // Update the quantity in the cart
  this.itemsRef!.update(key, { quantity: newQuantity });

  // Update total quantity and price
  this.totalQuantity += quantityDifference;
  this.totalPrice += (product.price * quantityDifference);
  this.totalPrice = +(this.totalPrice.toFixed(2)); // Round to 2 decimal places
  this.newPrice = this.totalPrice.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });

  // Update the product in your products list
  const productRef = this.db.list('/myProducts');
  productRef.update(product.key, { quantity: newQuantity });
}
getRoundedPrice(price: number, quantity: number): string {
  let total = price * quantity;
  return total.toFixed(2);
}


clearCart() {
  // clear cart in firebase
  this.db.list('/cart').remove();

  // update quantity and isAdded in myProducts
  this.db.list('/myProducts').snapshotChanges().pipe(take(1)).subscribe((products: any[]) => {
    products.forEach(productSnapshot => {
      const key = productSnapshot.payload.key;
      this.db.list('/myProducts').update(key, {isAdded: false, quantity: 0});
    });
  });
}
}
