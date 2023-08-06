import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductdataService } from '../productdata.service';
import { FormControl} from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireList } from '@angular/fire/compat/database';
import { map, Observable} from 'rxjs';

interface Product{
  id: number;
  name:string;
  price:number;
}
interface Order {
  orderId: number;  
  currentDate: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  Suite: string;
  zipCode: string;
  City: string;
  State: string;
  Country: string;
  productInfo: Product[];
  totalCost: number;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent{

  firstName: string = '';
  lastName: string = '';
  streetAddress: string='';
  Suite: string='';
  zipCode: string='';
  City: string='';
  State: string='';
  Country: string='';

  firstNameBilling: string | undefined;
  lastNameBilling: string  | undefined;
  streetAddressBilling: string | undefined;
  suiteBilling: string  | undefined;
  zipCodeBilling: string  | undefined;
  CityBilling: string | undefined;
  StateBilling: string  | undefined;
  CountryBilling: string  | undefined;
  lastNameBillingControl!: FormControl;

itemsRef : AngularFireList<any> | undefined
items: Observable<any[]> | undefined;
productInfoArray: any[] = [];

constructor(
  private route: ActivatedRoute, private myservice:ProductdataService, private db: AngularFireDatabase
  ) { 
  this.itemsRef = db.list('/cart');
  this.items = this.itemsRef.snapshotChanges().pipe(
    map((changes) =>
      changes.map((c) => ({ cartKey: c.payload.key, ...c.payload.val() }))
    )
  );
  this.items.subscribe((cartItems) => {
    this.productInfoArray = cartItems.map((cartItem) => ({
      id: cartItem.id,
      name: cartItem.name,
      price: cartItem.price
    }));
  });
}

billingDisabled: boolean = true;
useShippingAddress: boolean = true;

clearFields(){

  this.firstNameBilling ='';
  this.lastNameBilling ='';
  this.streetAddressBilling ='';
  this.suiteBilling ='';
  this.zipCodeBilling ='';
  this.CityBilling ='';
  this.StateBilling ='';
  this.CountryBilling ='';
}

changebutton = true;
onBillingCheckboxChange(event: any) {

  this.useShippingAddress = event.target.checked;
  if(this.useShippingAddress){
    this.firstNameBilling = this.firstName;
    this.lastNameBilling = this.lastName;
    this.streetAddressBilling = this.streetAddress;
    this.suiteBilling = this.Suite;
    this.zipCodeBilling = this.zipCode;
    this.CityBilling = this.City;
    this.StateBilling = this.State;
    this.CountryBilling = this.Country;
    this.billingDisabled = true;
    return;
  }
  this.clearFields();

}
orderPlaced = false;
getprice(){
  console.log(this.myservice.getCartPriceTotal() + " price in checkout getter")
  return this.myservice.getCartPriceTotal()
}

orderId = 0;
msg = '';

async onSubmit(value:any){
  let totalCost = 0;
  for (const product of this.productInfoArray) {
    totalCost += product.price;
  }
  this.orderId += 1;
  const order: Order = {
    orderId: this.orderId,
    currentDate: new Date().toISOString().slice(0, 10),
    firstName: this.firstName,
    lastName: this.lastName,
    streetAddress: this.streetAddress,
    Suite: this.Suite,
    zipCode: this.zipCode,
    City: this.City,
    State: this.State,
    Country: this.Country,
    productInfo: this.productInfoArray,
    totalCost: totalCost,
  }
  this.msg = "Order Placed, Thank You!"
  const orderRef = this.db.list('/order').push({});
  orderRef.set(order);
  this.orderPlaced = true;
}
}
