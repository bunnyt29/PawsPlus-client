import { Component } from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {NavigationMenuComponent} from './shared/components/navigation-menu/navigation-menu.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, NavigationMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'zoolandia-client';
  hideNavbar = false;

  private hiddenRoutes: string[] = ['/auth/login', '/auth/role-selection', '/profile/edit', '/post/multi-step-form', '/pet/create', '/access-denied', '/404'];
  private hiddenRoutePrefixes: string[] = ['/profile/my-profile-details', '/auth/register'];

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.hideNavbar =
          this.hiddenRoutes.includes(event.url) ||
          this.hiddenRoutePrefixes.some(prefix => event.url.startsWith(prefix));
      }
    });
  }
}
