import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products:Product[] = [];
  currentCategoryId: number = 1;
   previousCategory: number= 1;
  searchMode:boolean = false;

  // property für pagination
  thePageNumber:number =1;
  thePageSize:number = 10;
  theTotalElements:number = 0;


  constructor(private productService: ProductService, private route:ActivatedRoute, private cartService:CartService) {
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    })
  }

  listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword')
    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
  }

  handleListProducts(){
    // check if "id" parameter is available
    const hasCategoryId = this.route.snapshot.paramMap.has("id");
    if (hasCategoryId){
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId= +this.route.snapshot.paramMap.get("id")!;
    }else {
      // not category available .. default category id 1
      this.currentCategoryId = 1;
    }
    //
    //check if we have a different category thant previous
    //note: Angular will reuse a component if ith is currently being viewed
    //
    //if we have a different category id than previous
    // then set thePageNumber back to 1
    /*
    if(this.previousCategory != this.currentCategoryId){
      this.thePageNumber = 1;
    }
    this.previousCategory = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber =${this.thePageNumber}`);

    //now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber-1, this.thePageSize, this.currentCategoryId)
      .subscribe(
        data =>{
          this.products = data._embedded.products;
          this.thePageNumber = data.page.number +1;
          this.thePageSize = data.page.size;
          this.theTotalElements= data.page.totalElements
        });
       */
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        console.log(" alle products", data)
        this.products= data;
      }
    );


    /*
  this.productService.getProductList().subscribe(
    data => {
      console.log(" alle products", data)
      this.products= data;
    }
  );
  */
  }

  private handleSearchProducts() {
       const theKeyword:string = this.route.snapshot.paramMap.get('keyword')!;

       // Search the product using the keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data =>{
        console.log('search ',data)
        this.products = data;
      })
  }

  addToCart(theProduct: Product) {
     console.log(`adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`)

    const theCartItem = new CartItem(theProduct);
     this.cartService.addCart(theCartItem);

  }
}
