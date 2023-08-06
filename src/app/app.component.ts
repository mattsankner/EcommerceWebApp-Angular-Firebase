import { Component, ViewChild } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { MyProductClass } from './my-product-class';
import {ProductdataService} from './productdata.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'project1';
  @ViewChild(HomeComponent)
  homeComponent!: HomeComponent;

  constructor(private productdataService: ProductdataService) {}
  
    searchResults: MyProductClass[] = [];

    onSearchSubmit(term:string){
      this.productdataService.setSearchText(term);
      this.productdataService.searchProducts(term).subscribe(results => {
        this.searchResults = results;
      });
    }
  //function for orders component, not active
    // getLog(){
    //   return this.productdataService.getLoggedIn();
    // }
   
}
