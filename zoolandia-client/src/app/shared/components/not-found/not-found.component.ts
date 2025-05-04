import {Component} from '@angular/core';

import {GoogleAutocompleteComponent} from "../google-autocomplete/google-autocomplete.component";
import {RouterLink} from "@angular/router";
import {Location} from '@angular/common';
@Component({
  selector: 'app-not-found',
  standalone: true,
    imports: [
        GoogleAutocompleteComponent,
        RouterLink
    ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  constructor(private location: Location)
  {}

  goBack() {
    this.location.back();
  }
}
