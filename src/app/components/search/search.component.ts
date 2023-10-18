import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements  OnInit{

  constructor(private router:Router) {
  }
  ngOnInit(): void {
  }
  doSearch(value: string) {
    console.log(`value =${value}`)
    this.router.navigateByUrl(`search/${value}`).then(() => {
      console.log('Navigation completed successfully');
      // For example, update some state or display a message
    });
  }


}
