import { Injectable } from '@angular/core';
import { MyProductClass } from './my-product-class';
import { AngularFireDatabase,AngularFireList } from '@angular/fire/compat/database';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductdataService {
  message:string = '';
  productdataService: any;
  sendMsg(msg:string){
    this.message = msg;
  }
  getMsg(){
    return this.message;
  }
  removeFromKeys(id: any) {
    throw new Error('Method not implemented.');
  }
  isAdded(){
  }

allProductsTest: AngularFireList<MyProductClass>;
productsTest: Observable<MyProductClass[]>;

constructor(public db: AngularFireDatabase) {
  this.allProductsTest = this.db.list<MyProductClass>('/myProducts');
  this.productsTest = this.allProductsTest.valueChanges();
}

  //The valueChanges() method returns an Observable of data as a synchronized array of JSON objects.
  //Then, we create a method getProducts() which returns the products 
  //Observable that contains the array of products from the database.
  
  //cart
  cart:MyProductClass[] = [];

  searchProducts(searchText: string): Observable<MyProductClass[]> {
    return this.db.list<MyProductClass>('/myProducts', ref => ref.orderByChild('name').startAt(searchText).endAt(searchText + '\uf8ff')).valueChanges();
  }
  
  private searchResultsSubject = new BehaviorSubject<MyProductClass[]>([]);
  searchResults$ = this.searchResultsSubject.asObservable();

  searchResults: MyProductClass[] = [];

  onSearchSubmit(term:string){
    this.productdataService.setSearchText(term);
    this.productdataService.searchProducts(term).subscribe((results: MyProductClass[]) => {
      this.searchResults = results;
      this.searchResultsSubject.next(results);
    });
  }
  
  addToCart(product: any){
    this.cart.push(product);
    product.quantity++;
  }

  getCartArray(){
    return this.cart;
  }
//search function
  keyArray: any[] = [];
  addToKeys(key:any){
    this.keyArray.push(key);
    console.log(key + " added to keys");
  }

 totalPrice: string = '';
  setPrice(price:any){
    this.totalPrice = price;
  }
  
  getCartPriceTotal(){
    return this.totalPrice;
  }
  getCartProductCount(){
    return this.cart.length;
  }

  displayResults = false;
  display(){
    this.displayResults = !this.displayResults;
    return this.displayResults;
  }
  confirmation:any;
  orderNumber = 0;
  orderAddress = '';

  setResults(result:any){
    this.confirmation = result;
    this.orderAddress = this.confirmation.streetaddress;

    this.orderNumber += 1;
    this.displayResults = !this.displayResults;
  } 

  // searchProducts(search:string):MyProductClass[]{
  //   return this.products.filter(product =>
  //      product.getName().toLowerCase().includes(search.toLowerCase()));
  // }

  searchText = ''
  setSearchText(text:string){
    this.searchText = text;
  }
  getSearchText(){  
    return this.searchText;
  }

  loggedIn:boolean = false;
  isLoggedIN(value:boolean){
    this.loggedIn = value;
    if (this.loggedIn == true){
    console.log("logged in: " + this.loggedIn)}
    else {
      console.log("not logged in: " + this.loggedIn)
    } 

  }
  getLoggedIn(){
    return this.loggedIn;
  }
} 