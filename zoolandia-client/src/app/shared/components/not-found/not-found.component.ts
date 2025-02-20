import { Component } from '@angular/core';
import {GoogleAutocompleteComponent} from "../google-autocomplete/google-autocomplete.component";

@Component({
  selector: 'app-not-found',
  standalone: true,
    imports: [
        GoogleAutocompleteComponent
    ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
}
