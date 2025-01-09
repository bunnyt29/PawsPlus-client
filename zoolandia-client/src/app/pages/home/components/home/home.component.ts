import { Component } from '@angular/core';
import {FastSearchComponent} from '../fast-search/fast-search.component';
import {NavigationMenuComponent} from '../../../../shared/components/navigation-menu/navigation-menu.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FastSearchComponent,
    NavigationMenuComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
