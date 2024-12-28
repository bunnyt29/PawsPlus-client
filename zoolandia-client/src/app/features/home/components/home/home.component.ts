import { Component } from '@angular/core';
import {FastSearchComponent} from '../fast-search/fast-search.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FastSearchComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
