import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NavigationMenuComponent} from './shared/components/navigation-menu/navigation-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NavigationMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'zoolandia-client';
}
