import {Component, Inject, OnInit} from '@angular/core';
import {OKTA_AUTH} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";
import OktaSignIn from "@okta/okta-signin-widget";
import myAppConfig from "../../config/my-app-config";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  oktaSignIn: any;
  constructor( @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {

    this.oktaSignIn = new OktaSignIn(
      {
        baseUrl: myAppConfig.authConfig.issuer.split('/oauth2')[0],
        clientId: myAppConfig.authConfig.clientId,
        redirectUri:myAppConfig.authConfig.redirectUri,
        logo: 'assets/images/logo.png',
        authParams: {
          pkce: true,  //pkce= proof key for code Exchange
          issuer: myAppConfig.authConfig.issuer,
          scopes: myAppConfig.authConfig.scopes
        }
      });
  }
  ngOnInit(): void {
    this.oktaSignIn.remove();
    this.oktaSignIn.renderEl({el:'#okta-sign-in-widget'}, // this have to be same as dic in id login.html
      (response:any) =>{
      if (response.status === 'SUCCESS'){
        console.log('Authentication was successful', response);
        this.oktaAuth.signInWithRedirect();
      }},
      (error:any) =>{
      throw error;
      }
    )
  }

}
