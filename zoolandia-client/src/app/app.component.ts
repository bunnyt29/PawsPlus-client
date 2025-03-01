import {Component, OnInit, Renderer2} from '@angular/core';
import {NavigationStart, Router, RouterLink, RouterOutlet} from '@angular/router';
import {NavigationMenuComponent} from './shared/components/navigation-menu/navigation-menu.component';
import {CommonModule} from '@angular/common';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, NavigationMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'zoolandia-client';
  hideNavbar = false;

  private hiddenRoutes: string[] = ['/profile/edit', '/post/multi-step-form', '/pet/create', '/access-denied', '/404'];
  private hiddenRoutePrefixes: string[] = ['/profile/my-profile-details', '/admin', '/auth', '/profile/preview'];

  constructor(
    private router: Router,
    private renderer: Renderer2
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.hideNavbar =
          this.hiddenRoutes.includes(event.url) ||
          this.hiddenRoutePrefixes.some(prefix => event.url.startsWith(prefix));
      }
    });
  }

  ngOnInit() {
    this.loadGoogleMaps();
  }

  private loadGoogleMaps() {
    const script = this.renderer.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places,geometry&language=bg&loading=async`;
    script.async = true;
    script.defer = true;
    this.renderer.appendChild(document.head, script);
  }
}
