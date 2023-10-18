import { Injectable } from '@angular/core';
import {Purchase} from "../common/purchase";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private checkoutUrl = 'http://localhost:8080/api/checkout/purchase';
  constructor(private httpClient:HttpClient) { }

  placeOrder(purchase:Purchase): Observable<any>{
    return this.httpClient.post<Purchase>(this.checkoutUrl,purchase);

}
}
