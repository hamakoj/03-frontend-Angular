import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Country} from "../common/country";
import {State} from "../common/state";
import {map} from "rxjs/operators";

interface GetResponseCountries{
  _embedded:{
    countries:Country[];
  }
}
interface GetResponseStates{
  _embedded:{
    states:State[];
  }
}
@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient:HttpClient) { }

  getCountry():Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map( response => response._embedded.countries)
    );
  }
  getStates(theCountryCode: string):Observable<State[]>{
    //search
    const searchStateUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStateUrl).pipe(
      map( response => response._embedded.states)
    );

  }

 // month
  getCreditCartMonth(startMonth:number): Observable<number[]>{
    let data: number[]=[];
    // build an array for month dropdown list
    // start at desired startMonth and loop until 12

    for (let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }
    return of(data);
  }

  // year
  getCreditCartYear(): Observable<number[]>{
    let data: number[]=[];
    // build an array for month dropdown list
    // start at desired startMonth and loop until 12

    const startYear:number = new Date().getFullYear(); // to have the current year
    const endYear:number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }
    return of(data);
  }
}
