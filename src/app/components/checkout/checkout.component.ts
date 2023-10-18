import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ShopFormService} from "../../services/shop-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {FormValidators} from "../../validators/form-validators";
import {CartService} from "../../services/cart.service";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";
import {Order} from "../../common/order";
import {OrderItem} from "../../common/order-item";
import {Purchase} from "../../common/purchase";


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{

  checkoutFormGroup!:FormGroup;
  totalPrice: number = 0;
  totalQuantity:number = 0;

  creditCardYear:number[]=[];
  creditCardMonth:number[]=[];

  countries:Country[]=[];

  shippingAddressStates:State[]=[];
  billingAddressStates:State[]=[];

  constructor(private formBuilder:FormBuilder, private shopFormService: ShopFormService,
              private cartService:CartService,
              private checkoutService:CheckoutService,
              private router:Router) {
  }
  ngOnInit(): void {
    this.reviewCardDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2),FormValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2),FormValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, Validators.minLength(2),FormValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),FormValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),FormValidators.notOnlyWhitespace]),
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, Validators.minLength(2),FormValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),FormValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),FormValidators.notOnlyWhitespace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2),FormValidators.notOnlyWhitespace]),
        cardNumber:  new FormControl('', [Validators.required, Validators.pattern('[0-9{16}]')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9{3}]')]),
        expirationMonth: [''],
        expirationYear: [''],
      })
    });
    // populate de credit card month
    // get the current month
    const startMonth:number = new Date().getMonth() + 1;
    console.log("startMonth:" + startMonth);
    this.shopFormService.getCreditCartMonth(startMonth).subscribe(
      data =>{
        console.log("retrieved credit card months:" + JSON.stringify(data));
        this.creditCardMonth = data;
      });

    // populate de credit card year
    this.shopFormService.getCreditCartYear().subscribe(
      data =>{
        console.log("retrieved credit card year:" + JSON.stringify(data));
        this.creditCardYear = data;
      });


    // populate the countries
    this.shopFormService.getCountry().subscribe(
      data =>{
        console.log("retrieved countries:" + JSON.stringify(data));
        this.countries = data;
      });
  }

  OnSubmit() {
    console.log(" Handling the submit button");

    if (this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    // set up oder
    let order = new Order();
    order.totalQuantity = this.totalQuantity;
    order.totalPrice = this.totalPrice;

    // get carts items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    let orderItems:OrderItem[] = [];
    for (let i = 0; i< cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }

    //set up purchase
    let purchase = new Purchase();

    // populate purchase -customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase -shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState:State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry:Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase -billing address
    purchase. billingAddress= this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState:State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry:Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase -order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call rest Api via checkoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response =>{
          alert(`Your order has been received.\n Order tracking number: ${response.orderTrackingNumber}`)

          // reset the card
          this.resetCart();
        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );


    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("the email address is" + this.checkoutFormGroup.get('customer')?.value.email);
    console.log("the shipping address state is" + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);

  }


  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressCode(){return this.checkoutFormGroup.get('shippingAddress.zipCode');}
  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}

  get billingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get billingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get billingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get billingAddressCode(){return this.checkoutFormGroup.get('shippingAddress.zipCode');}
  get billingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}

  get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditCard.securityCode');}



  copyShippingAddressToBillingAddress(event: Event) {
    if ((event.target as HTMLInputElement).checked){
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
        this.billingAddressStates = this.shippingAddressStates;
    }else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear:number = new Date().getFullYear();
    const selectedYear:number = Number(creditCardFormGroup?.value.expirationYear);
    // if current year ist equals the selected year than start with the current month

    let startMonth:number;
    if (currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }else{
      startMonth = 1;
    }
    this.shopFormService.getCreditCartMonth(startMonth).subscribe(
      data =>{
        console.log("retrieved credit card months:" + JSON.stringify(data));
        this.creditCardMonth = data;
      });
  }

  getState(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);


    this.shopFormService.getStates(countryCode).subscribe(
      data =>{
        if (formGroupName === 'shippingAddress'){
            this.shippingAddressStates = data;
           console.log(' shipping address:' + data)
        }else {
           this.billingAddressStates =  data;
          console.log(' billing address:' + this.billingAddressStates)
        }
        // select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      });
  }

   reviewCardDetails() {
    //subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe( totalQuantity => {
      this.totalQuantity = totalQuantity;
    });
    //subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe( totalPrice => {
      this.totalPrice = totalPrice;
    });
  }

  resetCart() {
 // reset cart data
    this.cartService.cartItems =[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products")

  }
}
