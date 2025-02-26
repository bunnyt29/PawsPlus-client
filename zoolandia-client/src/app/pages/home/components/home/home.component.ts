import { Component } from '@angular/core';
import {FastSearchComponent} from '../fast-search/fast-search.component';
import {NavigationMenuComponent} from '../../../../shared/components/navigation-menu/navigation-menu.component';
import {ServicesComponent} from '../services/services.component';
import {BecomeSitterComponent} from '../become-sitter/become-sitter.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FastSearchComponent,
    ServicesComponent,
    BecomeSitterComponent,
    NavigationMenuComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
