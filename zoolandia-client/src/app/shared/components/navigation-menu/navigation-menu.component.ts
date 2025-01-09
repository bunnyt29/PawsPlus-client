import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'navigation-menu',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './navigation-menu.component.html',
  styleUrl: './navigation-menu.component.scss'
})
export class NavigationMenuComponent {

}
