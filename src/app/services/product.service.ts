import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable} from "rxjs";
import { map } from 'rxjs/operators';
import {Product} from "../common/product";
import {ProductCategory} from "../common/product-category";

// unwraps the Json from Spring Data rest _embedded entry
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page:{
    size:number,
    totalElements:number,
    totalPages:number,
    number:number
  }
}
// unwraps the Json from Spring Data rest _embedded entry
interface GetResponseProductCategory {
  _embedded: {
    productsCategory: ProductCategory[];
  }
}
@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private baserUrl = 'http://localhost:8080/api/products';
  private categorySearchUrl = 'http://localhost:8080/api/product-category'

  constructor(private httpClient: HttpClient) {
  }

  /*
  getProductListPaginate(thePage:number,
                         thePageSize:number,
                         theCategoryId: number):Observable<GetResponseProducts> {
    //build url based on category id
    const searchUrl = `${this.baserUrl}/search/findByCategoryId?id=${theCategoryId}`+`&page=${thePage}&size=&${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
   */


getProductList(theCategoryId: number):Observable<Product[]> {
    //build url based on category id
  const searchUrl = `${this.baserUrl}/search/findByCategoryId?id=${theCategoryId}`;
  return this.getProducts(searchUrl);
}

  getProductCategories():Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>('http://localhost:8080/api/product-category')
      .pipe(map(responseCategory => responseCategory._embedded.productsCategory));
  }

  searchProducts(theKeyword: string):Observable<Product[]> {
    //build url based on the keyword
    const searchUrl = `${this.baserUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string) {
    return this.httpClient.get<GetResponseProducts>(searchUrl)
      .pipe(
        map(response => response._embedded.products)
      );
  }

  getProduct(theProductId: number):Observable<Product> {
    // build URL on product id
    const  productUrl = `${this.baserUrl}/${theProductId}`
    return this.httpClient.get<Product>(productUrl)
  }
}
