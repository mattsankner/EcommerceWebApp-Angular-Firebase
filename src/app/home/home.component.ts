import { Component} from '@angular/core';
import { map, Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { ProductdataService } from '../productdata.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent{

  itemsRef : AngularFireList<any> | undefined
  items: Observable<any[]> | undefined;
  total: number = 0;
  searchText:string|undefined;
  compareProducts: any[] = [];
  cartFull = false;
  displayItems: any[] = [];

  constructor(
    private db: AngularFireDatabase, public productdataService: ProductdataService
) {
    this.itemsRef = db.list('/myProducts');
    this.items = this.itemsRef?.snapshotChanges().pipe(
        map(changes => {
            const products = changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
            const filteredProducts = products.filter((product, index, self) => {
                const isDuplicate = self.findIndex(p => p.name === product.name && p.price === product.price) !== index;
                return !isDuplicate;
            });
            this.compareProducts = filteredProducts;
            return filteredProducts;
        })
    );
    //take filteredProducts, dump into compareProducts, 
    //then update CartFull if isAdded true to enable cart button
    for (let i = 0; i < this.compareProducts.length; i++){
      if (this.compareProducts[i].isAdded == true){
        this.cartFull = true;
      }
    } 
    // Monitor the cart in Firebase
    this.db.list('/cart').valueChanges().subscribe((cartProducts: any[]) => {
      this.compareProducts.forEach(product => {
        product.isAdded = cartProducts.some((cartProduct: any) => cartProduct.key === product.key);
      });
      this.cartFull = this.compareProducts.some(product => product.isAdded);
    });
      
    this.productdataService.searchResults$.subscribe(results => {
      this.productdataService.searchResults = results;
    });
}
success: Record<number, boolean> = {};  

addToCart(product: any){
  //set cart reference
  const itemRef = this.db.list('/cart');
  //up quantity in cart  
  product.quantity += 1;
  //set isAdded to true 
  product.isAdded = true; 
  itemRef.push(product).then((ref) => {
  // Set the state of the product in Firebase after it has been added to the cart
    this.db.object(`/cart/${ref.key}/isAdded`).set(true);
  });

const productRef = this.db.list('/myProducts');

productRef.update(product.key, {quantity: product.quantity});
productRef.update(product.key, {isAdded: product.isAdded});

// Set success state for the product key
this.success[product.key] = true; // Displaying the success message
} 

onClick(rating: number, key: string) {
  this.db.object(`/myProducts/${key}`).update({rating: rating});
}
}