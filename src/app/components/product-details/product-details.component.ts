import {Component, OnInit} from '@angular/core';
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../services/product.service";
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{

  product! : Product;
 // product= new Product();
  constructor(private route: ActivatedRoute, private productionService:ProductService, private cartService:CartService) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>this.handleProductionDetails());
  }

  private handleProductionDetails() {
    // get the id param string. convert string to a number using the + symbol
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;
    this.productionService.getProduct(theProductId).subscribe(
      data =>{
        this.product = data;
      });
  }

  addToCart(){
    console.log(`adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
    const theCartItem = new CartItem(this.product);
    this.cartService.addCart(theCartItem);
  }
}
